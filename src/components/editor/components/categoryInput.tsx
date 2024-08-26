import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flex } from '@/components/common/Flex'
import { css } from 'styled-components'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { ArrowRight, Merge, Plus } from 'lucide-react'
import { run } from '@/lib/run'
import { motion, AnimatePresence } from 'framer-motion'

interface ICategorySuggestion {
    categoryId?: string
    name: string
    type: 'create' | 'fuse' | 'switch'
}

export function CategoryInput() {
    const theme = useTheme()

    const textFieldRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState('')
    const [inputFocused, setInputFocused] = useState(false)

    const {
        selected,
        cards,
        cardsMap,
        categories,
        categoriesMap,
        updateCard,
        addCategory,
        updateCategory,
        deleteCategory,
    } = useTemplateEditorContext()

    const selectedCard = useMemo(() => {
        if (selected?.type !== 'card') return undefined
        return cardsMap.get(selected.uuid)
    }, [selected, cardsMap])
    const selectedCardsCategory = useMemo(() => {
        if (selected?.type !== 'card') return undefined
        const selectedCard = cardsMap.get(selected.uuid)
        if (!selectedCard) return undefined
        if (!selectedCard.categoryId) return null
        const category = categoriesMap.get(selectedCard.categoryId)
        if (!category) {
            updateCard(selected.uuid, { categoryId: null })
            return null
        }
        return category
    }, [selected, cardsMap, categoriesMap, updateCard])
    const cardsCountInSCCategory = useMemo(() => {
        if (!selectedCardsCategory) return undefined
        return cards.filter(
            (card) => card.categoryId === selectedCardsCategory.uuid
        ).length
    }, [cards, selectedCardsCategory])

    const otherCategories = useMemo(
        () =>
            categories.filter(
                (category) => category.uuid !== selectedCardsCategory?.uuid
            ),
        [categories, selectedCardsCategory]
    )

    const suggestedCategories: ICategorySuggestion[] = useMemo(() => {
        const basedOnInput = otherCategories.filter((category) =>
            category.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        const createForInput: ICategorySuggestion[] =
            (!cardsCountInSCCategory || cardsCountInSCCategory > 1) &&
            inputValue !== selectedCardsCategory?.name &&
            inputValue !== ''
                ? [{ name: inputValue, type: 'create' }]
                : []
        if (basedOnInput.length > 0)
            return createForInput.concat(
                basedOnInput.map((category) => ({
                    categoryId: category.uuid,
                    name: category.name,
                    type: cardsCountInSCCategory === 1 ? 'fuse' : 'switch',
                }))
            )
        return createForInput.concat(
            otherCategories.map((category) => ({
                categoryId: category.uuid,
                name: category.name,
                type: cardsCountInSCCategory === 1 ? 'fuse' : 'switch',
            }))
        )
    }, [
        otherCategories,
        cardsCountInSCCategory,
        inputValue,
        selectedCardsCategory?.name,
    ])

    const onTextFieldChange = useCallback(
        (value: string) => {
            if (!selectedCardsCategory) return
            setInputValue(value)
            if (
                cardsCountInSCCategory === 1 &&
                selectedCardsCategory.name !== value &&
                value !== ''
            ) {
                updateCategory(selectedCardsCategory.uuid, (toUpdate) => {
                    return toUpdate.name !== value ? { name: value } : {}
                })
            }
        },
        [cardsCountInSCCategory, selectedCardsCategory, updateCategory]
    )

    const onTextFieldBlur = useCallback(
        () =>
            setTimeout(() => {
                setInputFocused(false)
                console.log(inputValue)
                selectedCardsCategory &&
                    setInputValue(selectedCardsCategory.name)
            }, 100),
        [inputValue, selectedCardsCategory]
    )

    const onSuggestionClick = useCallback(
        (suggestion: ICategorySuggestion) => {
            switch (suggestion.type) {
                case 'create':
                    if (!selectedCard) return
                    const newCategory = addCategory({
                        name: suggestion.name,
                        ...selectedCard,
                    })
                    updateCard(selectedCard.uuid, {
                        categoryId: newCategory.uuid,
                    })
                    break
                case 'fuse': {
                    if (
                        !selectedCard ||
                        !suggestion.categoryId ||
                        (cardsCountInSCCategory ?? 0) > 1
                    )
                        return
                    const selectedCategory = categoriesMap.get(
                        suggestion.categoryId
                    )
                    if (!selectedCategory) return
                    selectedCard.categoryId &&
                        deleteCategory(
                            selectedCard.categoryId,
                            suggestion.categoryId
                        )
                    break
                }
                case 'switch': {
                    if (selected?.type !== 'card' || !suggestion.categoryId)
                        return
                    const selectedCategory = categoriesMap.get(
                        suggestion.categoryId
                    )
                    if (!selectedCategory) return
                    updateCard(selected.uuid, {
                        ...selectedCategory,
                        categoryId: suggestion.categoryId,
                    })
                    break
                }
            }
        },
        [
            addCategory,
            cardsCountInSCCategory,
            categoriesMap,
            deleteCategory,
            selected,
            selectedCard,
            updateCard,
        ]
    )

    const onNoCategoryClick = useCallback(
        (checked: boolean) => {
            if (!selectedCard) return
            if (checked) {
                setInputValue('')
                updateCard(selectedCard.uuid, {
                    categoryId: null,
                })
                cardsCountInSCCategory === 1 &&
                    selectedCard.categoryId &&
                    deleteCategory(selectedCard.categoryId)
            } else {
                if (categories.length === 0) {
                    const newCategory = addCategory({
                        name: 'Neue Kategorie',
                        ...selectedCard,
                    })
                    updateCard(selectedCard.uuid, {
                        categoryId: newCategory.uuid,
                    })
                } else {
                    updateCard(selectedCard.uuid, {
                        categoryId: categories[0].uuid,
                    })
                }
            }
        },
        [
            addCategory,
            cardsCountInSCCategory,
            categories,
            deleteCategory,
            selectedCard,
            updateCard,
        ]
    )

    useEffect(
        () =>
            selectedCardsCategory
                ? setInputValue(selectedCardsCategory.name)
                : setInputValue(''),
        [selectedCardsCategory]
    )

    if (selected?.type !== 'card') return null

    return (
        <Flex
            dir='column'
            gap={6}
            styles={css`
                padding-top: 6px;
                width: 100%;
            `}
        >
            <Label htmlFor='category-input'>Kategorie</Label>
            <div
                css={css`
                    position: relative;
                `}
            >
                <Input
                    id='category-input'
                    ref={textFieldRef}
                    value={inputValue}
                    disabled={selectedCardsCategory === null}
                    onChange={(e) => onTextFieldChange(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={onTextFieldBlur}
                    placeholder={'Kategorie'}
                    autoCorrect={'off'}
                    autoComplete={'off'}
                    onKeyDown={(event) =>
                        event.key === 'Enter' && textFieldRef.current?.blur()
                    }
                    css={css`
                        resize: none;
                        border: 1px solid ${theme.palette.slate[300]};
                        opacity: ${selectedCardsCategory !== null ? 1 : 0.5};
                        &:focus {
                            outline: 2px solid ${theme.palette.slate[300]};
                        }
                    `}
                />
                <AnimatePresence>
                    {inputFocused && suggestedCategories.length > 0 && (
                        <motion.div
                            initial={{ y: -10, opacity: 0, zIndex: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                zIndex: theme.zIndex.dropdown,
                            }}
                            exit={{ opacity: 0, zIndex: 0 }}
                            css={css`
                                position: absolute;
                                top: 100%;
                                left: 0;
                                width: 100%;
                                background-color: ${theme.palette.white};
                                border: 1px solid ${theme.palette.slate[300]};
                                border-radius: 6px;
                                overflow: hidden;
                            `}
                        >
                            {suggestedCategories.map((suggestion) => (
                                <div
                                    key={suggestion.name}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onSuggestionClick(suggestion)
                                    }}
                                    css={css`
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        padding: 8px 12px;
                                        cursor: pointer;
                                        font-size: ${theme.fontSize.small};
                                        font-weight: 400;
                                        border-top: 1px solid
                                            ${theme.palette.slate[300]};
                                        &:first-of-type {
                                            border-top: none;
                                        }
                                        &:hover {
                                            background-color: ${theme.palette
                                                .slate[50]};
                                        }
                                    `}
                                >
                                    {suggestion.name}
                                    {run(() => {
                                        switch (suggestion.type) {
                                            case 'create':
                                                // prettier-ignore
                                                return <Plus size={14} color={theme.palette.slate[600]} />
                                            case 'fuse':
                                                // prettier-ignore
                                                return <Merge size={14} color={theme.palette.slate[600]} />
                                            case 'switch':
                                                // prettier-ignore
                                                return <ArrowRight size={14} color={theme.palette.slate[600]} />
                                        }
                                    })}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Flex
                dir='row'
                align='center'
                gap={5}
                styles={css`
                    margin-top: 2px;
                `}
            >
                <Checkbox
                    id='no-category'
                    checked={selectedCardsCategory === null}
                    disabled={inputFocused && suggestedCategories.length > 0}
                    onCheckedChange={(checked) =>
                        onNoCategoryClick(checked === true)
                    }
                />
                <Label
                    htmlFor='no-category'
                    css={css`
                        cursor: pointer;
                        font-size: ${theme.fontSize.extraSmall};
                        font-weight: 500;
                        color: ${!selectedCardsCategory
                            ? theme.palette.gray[600]
                            : theme.palette.gray[400]};
                    `}
                >
                    Keine Kategorie
                </Label>
            </Flex>
        </Flex>
    )
}

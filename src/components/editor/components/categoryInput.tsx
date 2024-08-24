import { useEffect, useMemo, useState } from 'react'
import { Flex } from '@/components/common/Flex'
import { css } from 'styled-components'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { noOp } from '@/utils/types'

export function CategoryInput() {
    const theme = useTheme()

    const [inputValue, setInputValue] = useState('')

    const { selected, cardsMap, categories, categoriesMap, updateCard } =
        useTemplateEditorContext()

    const selectedCardsCategory = useMemo(() => {
        if (selected?.type !== 'card') return undefined
        const selectedCard = cardsMap.get(selected.uuid)
        if (!selectedCard) return undefined
        if (!selectedCard.categoryId) return null
        return categoriesMap.get(selectedCard.categoryId)
    }, [selected, cardsMap, categoriesMap])

    useEffect(
        () =>
            selectedCardsCategory
                ? setInputValue(selectedCardsCategory.name)
                : noOp,
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
            <Input
                id='category-input'
                value={inputValue}
                disabled={!selectedCardsCategory}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={'Kategorie'}
                css={css`
                    resize: none;
                    border: 1px solid ${theme.palette.slate[300]};
                    opacity: ${selectedCardsCategory ? 1 : 0.5};
                    &:focus {
                        outline: 2px solid ${theme.palette.slate[300]};
                    }
                `}
            />
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
                    checked={!selectedCardsCategory}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            setInputValue('')
                            updateCard(selected.uuid, {
                                categoryId: null,
                            })
                        } else {
                            updateCard(selected.uuid, {
                                categoryId: categories[0].uuid,
                            })
                        }
                    }}
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

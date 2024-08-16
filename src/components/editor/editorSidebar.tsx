import {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SwitchButton } from '@/components/ui/switchButton'
import { ColorMenu, FeaturedColor } from '@/components/editor/colorMenu'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { THEME } from '@/utils/theme'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { Flex } from '@/components/common/Flex'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface IEditorSidebarRef {
    focusTextArea: () => void
}

const defaultCardFeatureColors: FeaturedColor[] = [
    { name: 'Blau', color: THEME.palette.template.blue },
    { name: 'Magenta', color: THEME.palette.template.magenta },
    { name: 'Gelb', color: THEME.palette.template.yellow },
    { name: 'Weiß', color: THEME.palette.white },
    { name: 'Schwarz', color: THEME.palette.black },
]

const defaultBackgroundFeatureColors: FeaturedColor[] = [
    { name: 'D. Grau', color: THEME.palette.template.background },
    { name: 'Magenta', color: THEME.palette.template.magenta },
]

// EditorColorPickerAttribute
const EditorCPAttribute = {
    text: 'Text',
    background: 'Background',
} as const

const EditorSidebar = forwardRef<IEditorSidebarRef>((_, ref) => {
    const theme = useTheme()

    const prevEditorIdRef = useRef<string>()
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [selectedCPAttribute, setSelectedCPAttribute] = useState<
        (typeof EditorCPAttribute)[keyof typeof EditorCPAttribute]
    >(EditorCPAttribute.text)

    const {
        selected,
        templateBackgroundColor,
        updateTemplateBackgroundColor,
        titleCard,
        updateTitleCard,
        cards,
        updateCard,
        deleteCard,
        moveCard,
        getPossibleDirectionsForCard,
        categories,
        updateCategory,
    } = useTemplateEditorContext()

    const selectedType = useMemo(() => selected?.type, [selected])
    const selectedCard = useMemo(
        () =>
            selected?.type === 'card'
                ? cards.find((card) => card.uuid === selected?.uuid)
                : undefined,
        [selected, cards]
    )
    const possibleDirectionsForCard = useMemo(
        () =>
            selectedCard
                ? getPossibleDirectionsForCard(selectedCard.uuid)
                : undefined,
        [selectedCard, getPossibleDirectionsForCard]
    )
    const selectedCategory = useMemo(
        () =>
            selected?.type === 'category'
                ? categories.find(
                      (category) => category.uuid === selected?.uuid
                  )
                : undefined,
        [selected, categories]
    )

    const editorId = useMemo(
        () =>
            selected?.type +
            (selected?.type === 'card' || selected?.type === 'category'
                ? `-${selected.uuid}`
                : ''),
        [selected]
    )

    const selectedText = useMemo(() => {
        switch (selectedType) {
            case 'title':
                return titleCard.title
            case 'card':
                return selectedCard?.title
            case 'category':
                return selectedCategory?.name
        }
    }, [
        selectedType,
        titleCard.title,
        selectedCard?.title,
        selectedCategory?.name,
    ])

    const setSelectedText = useCallback(
        (text: string) => {
            if (selected) {
                switch (selected.type) {
                    case 'title':
                        return updateTitleCard({ title: text })
                    case 'card':
                        return updateCard(selected.uuid, { title: text })
                    case 'category':
                        return updateCategory(selected.uuid, { name: text })
                }
            }
        },
        [selected, updateTitleCard, updateCard, updateCategory]
    )

    const selectedColor = useMemo(() => {
        if (
            selectedType !== 'background' &&
            selectedCPAttribute === EditorCPAttribute.text
        ) {
            switch (selectedType) {
                case 'title':
                    return titleCard.textColor
                case 'card':
                    return selectedCard?.textColor
                case 'category':
                    return selectedCategory?.textColor
            }
        }
        switch (selectedType) {
            case 'background':
                return templateBackgroundColor
            case 'title':
                return titleCard.backgroundColor
            case 'card':
                return selectedCard?.backgroundColor
            case 'category':
                return selectedCategory?.backgroundColor
        }
    }, [
        selectedType,
        selectedCPAttribute,
        selectedCard,
        templateBackgroundColor,
        titleCard,
        selectedCategory,
    ])

    const onSelectedColorChange = useCallback(
        (color: string) => {
            if (!selected) return
            if (
                selected.type !== 'background' &&
                selectedCPAttribute === EditorCPAttribute.text
            ) {
                switch (selected.type) {
                    case 'title':
                        return updateTitleCard({ textColor: color })
                    case 'card':
                        return updateCard(selected.uuid, { textColor: color })
                    case 'category':
                        return updateCategory(selected.uuid, {
                            textColor: color,
                        })
                }
            }
            switch (selected.type) {
                case 'background':
                    return updateTemplateBackgroundColor(color)
                case 'title':
                    return updateTitleCard({ backgroundColor: color })
                case 'card':
                    return updateCard(selected.uuid, { backgroundColor: color })
                case 'category':
                    return updateCategory(selected.uuid, {
                        backgroundColor: color,
                    })
            }
        },
        [
            selected,
            selectedCPAttribute,
            updateTitleCard,
            updateCard,
            updateTemplateBackgroundColor,
            updateCategory,
        ]
    )

    const textAreaTitle = useMemo(() => {
        switch (selectedType) {
            case 'title':
                return 'Überschrift'
            case 'card':
                return 'Text in der Kachel'
            case 'category':
                return 'Name der Kategorie'
        }
    }, [selectedType])

    const textAreaPlaceholder = useMemo(() => {
        switch (selectedType) {
            case 'title':
                return 'Juli 2024'
            case 'card':
                return '16. April - JuLis & Friends...'
            case 'category':
                return 'Kategorie'
        }
    }, [selectedType])

    useImperativeHandle(ref, () => ({
        focusTextArea: () => textAreaRef.current?.focus(),
    }))

    // Reset selected attribute when switching between selected elements
    useEffect(() => {
        if (prevEditorIdRef.current !== editorId) {
            setSelectedCPAttribute(EditorCPAttribute.text)
            prevEditorIdRef.current = editorId
        }
    }, [editorId])

    return selected ? (
        <Flex
            dir='column'
            gap={10}
            styles={css`
                height: 100%;
                width: 100%;
                background: ${theme.palette.gray[75]};
                padding: 64px 16px 16px;
            `}
        >
            <h2
                css={css`
                    font-size: ${theme.fontSize.smallLarge};
                    font-weight: bold;
                    margin-bottom: ${selectedType === 'background'
                        ? '-20px'
                        : '0'};
                `}
            >
                Bearbeitungsleiste
            </h2>
            {selectedType !== 'background' && (
                <Flex
                    dir='column'
                    gap={6}
                    css={css`
                        margin-top: 10px;
                        width: 100%;
                    `}
                >
                    <Label htmlFor='text-field'>{textAreaTitle}</Label>
                    <Textarea
                        ref={textAreaRef}
                        id='text-field'
                        value={selectedText}
                        onChange={(e) => setSelectedText(e.target.value)}
                        placeholder={textAreaPlaceholder}
                        css={css`
                            resize: none;
                            border: 1px solid ${theme.palette.slate[300]};
                            &:focus {
                                outline: 2px solid ${theme.palette.slate[300]};
                            }
                        `}
                    />
                </Flex>
            )}
            <h3
                css={css`
                    margin-top: 16px;
                    font-size: ${theme.fontSize.medium};
                    font-weight: 600;
                    color: ${theme.palette.gray[600]};
                `}
            >
                {selectedType === 'background' ? 'Hintergrundfarbe' : 'Farben'}
            </h3>
            {/*{showApplyOnSimilar && (*/}
            {/*    <div className='flex items-center space-x-2'>*/}
            {/*        <Switch*/}
            {/*            id='apply-on-similar'*/}
            {/*            checked={applyOnSimilar}*/}
            {/*            onCheckedChange={onApplyOnSimilarChange}*/}
            {/*        />*/}
            {/*        <Label htmlFor='apply-on-similar'>*/}
            {/*            Auf gleichfarbige anwenden*/}
            {/*        </Label>*/}
            {/*    </div>*/}
            {/*)}*/}
            {selectedType !== 'background' && (
                <SwitchButton
                    layoutIdExtension={editorId}
                    selected={selectedCPAttribute}
                    options={Object.values(EditorCPAttribute)}
                    onChange={(selected) =>
                        setSelectedCPAttribute(
                            selected as typeof selectedCPAttribute
                        )
                    }
                />
            )}

            <ColorMenu
                selectedColor={selectedColor ?? '#fff'}
                onColorChange={onSelectedColorChange}
                featuredColors={
                    selectedType === 'background'
                        ? defaultBackgroundFeatureColors
                        : defaultCardFeatureColors
                }
            />

            {selectedCard && (
                <Fragment>
                    <h3
                        css={css`
                            margin-top: 16px;
                            font-size: ${theme.fontSize.medium};
                            font-weight: 600;
                            color: ${theme.palette.gray[600]};
                        `}
                    >
                        Aktionen
                    </h3>
                    <Flex dir='row' align='center' gap={5}>
                        <button
                            onClick={() => deleteCard(selectedCard.uuid)}
                            css={css`
                                flex: 1;
                                grid-column: span 2;
                                border-radius: 6px;
                                border: 2px solid ${theme.palette.red[500]};
                                background-color: ${theme.palette.white};
                                padding: 8px 16px;
                                font-weight: 600;
                                color: ${theme.palette.red[500]};
                                margin-right: 5px;
                            `}
                        >
                            Löschen
                        </button>
                        <button
                            // prettier-ignore
                            disabled={ !possibleDirectionsForCard?.includes('up') }
                            onClick={() => moveCard(selectedCard.uuid, 'up')}
                            // prettier-ignore
                            css={css`
                                display: flex;
                                justify-content: center;
                                border-radius: 6px;
                                border: 2px solid ${theme.palette.gray[500]};
                                background-color: ${theme.palette.white};
                                padding: 8px 12px;
                                font-weight: 600;
                                color: ${theme.palette.gray[500]};
                                opacity: ${possibleDirectionsForCard?.includes('up') ? 1 : 0.5};
                            `}
                        >
                            <ChevronUp />
                        </button>
                        <button
                            // prettier-ignore
                            disabled={ !possibleDirectionsForCard?.includes('down') }
                            onClick={() => moveCard(selectedCard.uuid, 'down')}
                            // prettier-ignore
                            css={css`
                                display: flex;
                                justify-content: center;
                                border-radius: 6px;
                                border: 2px solid ${theme.palette.gray[500]};
                                background-color: ${theme.palette.white};
                                padding: 8px 12px;
                                font-weight: 600;
                                color: ${theme.palette.gray[500]};
                                opacity: ${possibleDirectionsForCard?.includes('down') ? 1 : 0.5};
                            `}
                        >
                            <ChevronDown />
                        </button>
                    </Flex>
                </Fragment>
            )}
        </Flex>
    ) : (
        <Flex
            dir='column'
            gap={10}
            styles={css`
                height: 100%;
                width: 100%;
                background: ${theme.palette.gray[75]};
                padding: 64px 16px 16px;
            `}
        >
            <h2
                css={css`
                    font-size: ${theme.fontSize.smallLarge};
                    font-weight: bold;
                `}
            >
                Bearbeitungsleiste
            </h2>
            <p
                css={css`
                    color: ${theme.palette.gray[500]};
                    font-size: ${theme.fontSize.extraSmall};
                `}
            >
                Bitte wähle etwas aus um es hier zu bearbeiten.
            </p>
        </Flex>
    )
})

EditorSidebar.displayName = 'EditorSidebar'

export { EditorSidebar }

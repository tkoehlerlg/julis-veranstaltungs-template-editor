import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { Flex } from '@/components/common/Flex'
import { TitleTextField } from '@/components/editor/components/titleTextField'
import { CategoryInput } from '@/components/editor/components/categoryInput'
import {
    ColorSection,
    ColorSectionRef,
} from '@/components/editor/components/colorSection'
import { ActionMenu } from '@/components/editor/components/actionMenu'

export interface IEditorSidebarRef {
    focusTextArea: () => void
}

const EditorSidebar = forwardRef<IEditorSidebarRef>((_, ref) => {
    const theme = useTheme()

    const prevEditorId = useRef<string>()
    const titleTextFieldRef = useRef<HTMLTextAreaElement>(null)
    const colorSectionRef = useRef<ColorSectionRef>(null)

    const { selected, cards, getPossibleDirectionsForCard, resetLocalStorage } =
        useTemplateEditorContext()

    const selectedType = useMemo(() => selected?.type, [selected])
    const selectedCard = useMemo(
        () =>
            selected?.type === 'card' &&
            cards.find((card) => card.uuid === selected?.uuid),
        [selected, cards]
    )
    const possibleDirectionsForCard = useMemo(
        () => selectedCard && getPossibleDirectionsForCard(selectedCard.uuid),
        [selectedCard, getPossibleDirectionsForCard]
    )

    const editorId = useMemo(
        () =>
            selected?.type +
            (selected?.type === 'card' || selected?.type === 'category'
                ? `-${selected.uuid}`
                : ''),
        [selected]
    )

    // Reset selected attribute when switching between selected elements
    useEffect(() => {
        if (prevEditorId.current !== editorId) {
            colorSectionRef.current?.setSelectedAttribute('text')
            prevEditorId.current = editorId
        }
    }, [editorId])

    useImperativeHandle(ref, () => ({
        focusTextArea: () => {
            const textArea = titleTextFieldRef.current
            if (!textArea) return
            const inputLength = textArea.value.length
            textArea.setSelectionRange(inputLength, inputLength)
            textArea.focus()
        },
    }))

    return selected ? (
        <Flex
            dir='column'
            gap={10}
            styles={css`
                height: 100%;
                width: 100%;
                background: ${theme.palette.gray[75]};
                padding: 64px 16px 16px;
                max-height: 100vh;
                overflow-y: scroll;
                overscroll-behavior-y: contain;
                // hide scrollbar
                scrollbar-width: none;
                -ms-overflow-style: none;
                &::-webkit-scrollbar {
                    display: none;
                }
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
            <TitleTextField ref={titleTextFieldRef} />
            <CategoryInput />
            <h3
                css={css`
                    margin-top: 10px;
                    font-size: ${theme.fontSize.medium};
                    font-weight: 600;
                    color: ${theme.palette.gray[600]};
                `}
            >
                {selectedType === 'background' ? 'Hintergrundfarbe' : 'Farben'}
            </h3>
            <ColorSection id={editorId} ref={colorSectionRef} />
            <ActionMenu />
        </Flex>
    ) : (
        <Flex
            dir='column'
            gap={10}
            styles={css`
                position: relative;
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
            <Flex
                styles={css`
                    position: absolute;
                    width: calc(100% - 32px);
                    bottom: 32px;
                    right: 16px;
                `}
            >
                <button
                    onClick={() => resetLocalStorage()}
                    css={css`
                        border: 2px solid ${theme.palette.red[500]};
                        background-color: ${theme.palette.white};
                        color: ${theme.palette.red[500]};
                        min-height: 40px;
                        padding: 5px 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: ${theme.fontSize.extraSmall};
                        font-weight: 500;
                        width: 100%;
                    `}
                >
                    Template zurücksetzen
                </button>
            </Flex>
        </Flex>
    )
})

EditorSidebar.displayName = 'EditorSidebar'

export { EditorSidebar }

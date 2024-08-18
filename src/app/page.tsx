'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorSidebar } from '@/components/editor'
import {
    TemplateEditorContextProvider,
    useTemplateEditorContext,
} from '@/contexts/templateEditor'
import { TemplateHeadline } from '@/components/template/templateHeadline'
import { TemplateBox } from '@/components/template/templateBox'
import { EventCard } from '@/components/template/eventCard'
import { AddButton } from '@/components/template/addButton'
import { TitleCard } from '@/components/template/titleCard'
import { Flex } from '@/components/common/Flex'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { CategoriesContainer } from '@/components/template/categoriesContainer'
import { useRef } from 'react'
import domToImage from 'dom-to-image'
import { DownloadIcon, RedoIcon, UndoIcon } from 'lucide-react'
import { useKey } from 'react-use'
import { Tooltip } from '@/components/common/Tooltip'

export default function App() {
    return (
        <TemplateEditorContextProvider>
            <TemplateEditor />
        </TemplateEditorContextProvider>
    )
}

function TemplateEditor() {
    const theme = useTheme()
    const divRef = useRef<HTMLDivElement>(null)
    const {
        isLoadingFromLocalStorage,
        selected,
        setSelected,
        templateBackgroundColor,
        cards,
        addCard,
        titleCard,
        categories,
        editorSidebarRef,
        historyControl,
    } = useTemplateEditorContext()

    const saveAsImage = async () => {
        if (divRef.current) {
            try {
                const scaleFactor = 1900 / divRef.current.offsetWidth
                const dataUrl = await domToImage.toPng(divRef.current, {
                    quality: 100,
                    height: divRef.current.offsetHeight * scaleFactor,
                    width: 1900,
                    style: {
                        transform: `scale(${scaleFactor * 0.8})`,
                        'transform-origin': 'top left',
                    },
                })

                const link = document.createElement('a')
                link.download = `${titleCard.title}.png`
                link.href = dataUrl
                link.click()
            } catch (error) {
                console.error('Error capturing div:', error)
                alert('Failed to capture the div. Please try again.')
            }
        }
    }

    useKey(
        (e) => e.metaKey && e.key === 'z',
        (e) => {
            if (e.shiftKey) {
                if (historyControl.canRedo) historyControl.redo()
            } else {
                if (historyControl.canUndo) historyControl.undo()
            }
        }
    )

    return (
        <main>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    defaultSize={75}
                    css={css`
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        height: 100dvh;
                        padding-top: 40px;
                        padding-left: 40px;
                    `}
                    onClick={() => setSelected(undefined)}
                >
                    <TemplateHeadline />
                    <Flex
                        align='center'
                        justify='center'
                        styles={css`
                            height: 100%;
                            width: 100%;
                            pointer-events: none;
                        `}
                    >
                        {!isLoadingFromLocalStorage ? (
                            <TemplateBox
                                ref={divRef}
                                isSelected={selected?.type === 'background'}
                                backgroundColor={templateBackgroundColor}
                                onClick={() =>
                                    setSelected({ type: 'background' })
                                }
                                css={css`
                                    scale: 1.25;
                                    pointer-events: auto;
                                `}
                            >
                                <TitleCard />
                                <AddButton
                                    onClick={() => addCard(0)}
                                    styles={
                                        cards.length === 0
                                            ? css`
                                                  margin-top: -2px;
                                                  margin-bottom: -9px;
                                              `
                                            : undefined
                                    }
                                />
                                <div className={'relative flex flex-col gap-1'}>
                                    {cards.map((card, index) => (
                                        <div key={card.uuid}>
                                            <EventCard card={card} />
                                            <AddButton
                                                paddingTop={6.5}
                                                paddingBottom={
                                                    index === cards.length - 1
                                                        ? 0
                                                        : 2.5
                                                }
                                                onClick={() =>
                                                    addCard(index + 1)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <CategoriesContainer categories={categories} />
                            </TemplateBox>
                        ) : (
                            <div>Lade von Lokalem Speicher...</div>
                        )}
                    </Flex>
                    <Tooltip
                        id={'download'}
                        place={'top-end'}
                        tooltip={'Als Bild speichern'}
                        styles={css`
                            position: absolute;
                            bottom: 20px;
                            right: 20px;
                        `}
                    >
                        <button
                            onClick={() => saveAsImage()}
                            css={css`
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 40px;
                                width: 40px;
                                background-color: ${theme.palette.slate[100]};
                                border: 1px solid ${theme.palette.slate[200]};
                                border-radius: 50%;
                            `}
                        >
                            <DownloadIcon
                                size={20}
                                color={theme.palette.slate[600]}
                            />
                        </button>
                    </Tooltip>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    minSize={20}
                    maxSize={25}
                    defaultSize={25}
                    className={'border-l'}
                >
                    <EditorSidebar ref={editorSidebarRef} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}

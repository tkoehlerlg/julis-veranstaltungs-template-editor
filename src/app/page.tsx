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
import { AddButton } from '@/components/template/addButton'
import { EventCard } from '@/components/template/eventCard'
import { TemplateBox } from '@/components/template/templateBox'
import { TitleCard } from '@/components/template/titleCard'
import { Flex } from '@/components/common/Flex'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { CategoriesContainer } from '@/components/template/categoriesContainer'
import { useRef } from 'react'
import domToImage from 'dom-to-image'
import { DownloadIcon } from 'lucide-react'

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
    } = useTemplateEditorContext()

    const saveAsImage = async () => {
        if (divRef.current) {
            try {
                const dataUrl = await domToImage.toPng(divRef.current, {
                    height: divRef.current.offsetHeight * 2.5,
                    width: divRef.current.offsetWidth * 2.5,
                    style: {
                        transform: 'scale(2.5)',
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
                    <Flex
                        dir='row'
                        align='center'
                        gap={20}
                        styles={css`
                            pointer-events: none;
                        `}
                    >
                        <h1
                            css={css`
                                font-family: ${theme.font.montserrat};
                                font-size: ${theme.fontSize.display6};
                                font-weight: 900;
                                color: ${theme.palette.template.magenta};
                                pointer-events: auto;
                            `}
                        >
                            JuLis Veranstaltungs-Template-Editor
                        </h1>
                    </Flex>
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
                                <AddButton onClick={() => addCard(0)} />
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
                    <button
                        onClick={() => saveAsImage()}
                        css={css`
                            position: absolute;
                            bottom: 20px;
                            right: 20px;
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

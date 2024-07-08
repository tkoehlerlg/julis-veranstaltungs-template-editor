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
import { PopUp } from '@/components/common/PopUp'

export default function App() {
    return (
        <TemplateEditorContextProvider>
            <TemplateEditor />
        </TemplateEditorContextProvider>
    )
}

function TemplateEditor() {
    const theme = useTheme()
    const {
        isLoadingFromLocalStorage,
        resetLocalStorage,
        selected,
        setSelected,
        templateBackgroundColor,
        cards,
        addCard,
        categories,
        editorSidebarRef,
    } = useTemplateEditorContext()

    return (
        <main>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    defaultSize={75}
                    css={css`
                        display: flex;
                        flex-direction: column;
                        height: 100dvh;
                        padding-top: 40px;
                        padding-left: 40px;
                    `}
                    onClick={() => setSelected(undefined)}
                >
                    <Flex dir='row' align='center' gap={20}>
                        <h1
                            css={css`
                                font-family: ${theme.font.montserrat};
                                font-size: ${theme.fontSize.display6};
                                font-weight: 900;
                                color: ${theme.palette.template.magenta};
                            `}
                        >
                            JuLis Veranstaltungs-Template-Editor
                        </h1>
                        <button
                            onClick={() => resetLocalStorage()}
                            css={css`
                                background-color: ${theme.palette.slate[100]};
                                color: ${theme.palette.slate[800]};
                                border: none;
                                padding: 5px 10px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: ${theme.fontSize.extraSmall};
                                font-weight: 500;
                            `}
                        >
                            Reset
                        </button>
                    </Flex>
                    <div
                        className={
                            'flex h-full w-full flex-col items-center justify-center'
                        }
                    >
                        {!isLoadingFromLocalStorage ? (
                            <TemplateBox
                                isSelected={selected?.type === 'background'}
                                backgroundColor={templateBackgroundColor}
                                onClick={() =>
                                    setSelected({ type: 'background' })
                                }
                                className={'scale-125'}
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
                    </div>
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

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

export default function App() {
    return (
        <TemplateEditorContextProvider>
            <TemplateEditor />
        </TemplateEditorContextProvider>
    )
}

function TemplateEditor() {
    const {
        selected,
        setSelected,
        templateBackgroundColor,
        cards,
        addCard,
        editorSidebarRef,
    } = useTemplateEditorContext()

    return (
        <main>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    defaultSize={75}
                    className={'flex h-dvh flex-col pl-10 pt-11'}
                    onClick={() => setSelected(undefined)}
                >
                    <h1 className='font-monserrat text-3xl font-black text-magenta'>
                        JuLis Veranstaltungs-Template-Editor
                    </h1>
                    <div
                        className={
                            'flex h-full w-full flex-col items-center justify-center'
                        }
                    >
                        <TemplateBox
                            isSelected={selected?.type === 'background'}
                            backgroundColor={templateBackgroundColor}
                            onClick={() => setSelected({ type: 'background' })}
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
                                            onClick={() => addCard(index + 1)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </TemplateBox>
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

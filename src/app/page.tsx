'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorSidebar } from '@/components/editor/sidebar'
import {
    TemplateEditorContextProvider,
    useTemplateEditorContext,
} from '@/contexts/templateEditor/templateEditorContext'
import { AddButton } from '@/components/editor/template/addButton'
import { EventCardView } from '@/components/editor/template/eventCard'
import { TemplateBox } from '@/components/editor/template/templateBox'
import { TitleCard } from '@/components/editor/template/titleCard'

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
        titleCard,
        cards,
        addCard,
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
                                        <EventCardView
                                            {...card}
                                            isSelected={
                                                selected?.type === 'card' &&
                                                selected.uuid == card.uuid
                                            }
                                            onClick={() =>
                                                setSelected({
                                                    type: 'card',
                                                    uuid: card.uuid,
                                                })
                                            }
                                        />
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
                    <EditorSidebar />
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}

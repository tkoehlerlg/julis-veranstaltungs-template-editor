'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorSidebar } from '@/components/editor/sidebar'
import {
    TemplateBox,
    TitleCardView,
    EventCardView,
} from '@/components/editor/template'
import {
    EditorContextProvider,
    useEditorContext,
} from '@/contexts/editorContext'
import { useMemo } from 'react'
import { Plus } from 'lucide-react'

export default function App() {
    return (
        <EditorContextProvider>
            <Home />
        </EditorContextProvider>
    )
}

function Home() {
    const { selected, setSelected, templateBackgroundColor, titleCard, cards } =
        useEditorContext()

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
                            <TitleCardView
                                {...titleCard}
                                isSelected={selected?.type === 'title'}
                                onClick={() => setSelected({ type: 'title' })}
                            />
                            <AddButton />
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

const AddButton = ({
    onTap,
    paddingTop = 0,
    paddingBottom = 0,
}: {
    onTap?: () => void
    paddingTop?: number
    paddingBottom?: number
}) => (
    <div
        className={
            'relative z-50 -my-1 flex h-0 w-full cursor-pointer flex-row items-center px-5 opacity-0 transition-opacity duration-200  hover:opacity-100'
        }
        style={{ paddingTop, paddingBottom }}
        onClick={(e) => {
            e.stopPropagation()
            onTap?.()
        }}
    >
        <div
            className={
                'box-content h-[1.5px] w-full rounded-l-md border-[0.5px] border-r-0 border-black bg-white'
            }
        />
        <div
            className={
                'flex h-3.5 min-w-3.5 items-center justify-center rounded-md border-[0.5px] border-black bg-white'
            }
        >
            <Plus size={10} strokeWidth={2.5} color={'black'} />
        </div>
        <div
            className={
                'box-content h-[1.5px] w-full rounded-r-md border-[0.5px] border-l-0 border-black bg-white'
            }
        />
    </div>
)

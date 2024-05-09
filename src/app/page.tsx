'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorSidebar } from '@/components/editorSidebar'
import {
    TemplateBox,
    EventCard,
    TitleCardView,
    TitleCard,
    defaultTitleCard,
} from '@/components/template'
import { useCallback, useMemo, useState } from 'react'

export type SelectionType = 'headline' | 'card' | 'background'

type Selection =
    | {
          type: 'background'
      }
    | {
          type: 'headline'
      }
    | {
          type: 'card'
          id: string
      }

export default function Home() {
    const [selected, setSelected] = useState<Selection>({
        type: 'card',
        id: '',
    })
    const [templateBackgroundColor, setTemplateBackgroundColor] =
        useState('#1E1F21')
    const [titleCard, setTitleCard] = useState<TitleCard>(defaultTitleCard)
    const [cards, setCards] = useState<EventCard[]>([])

    const selectedTextColor = useMemo(() => {
        return undefined
    }, [])

    const selectedBackgroundColor = useMemo(() => {
        return templateBackgroundColor
    }, [selected, templateBackgroundColor])
    const setSelectedBackgroundColor = useCallback((color: string) => {
        switch (selected.type) {
            case 'background':
                setTemplateBackgroundColor(color)
                break
            case 'headline':
                break
            case 'card':
                break
        }
    }, [])

    const selectBackground = () => setSelected({ type: 'background' })
    const selectHeadline = () => setSelected({ type: 'headline' })
    const selectCard = (id: string) => setSelected({ type: 'card', id: id })

    return (
        <main>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    defaultSize={75}
                    className={'flex h-dvh flex-col pl-10 pt-11'}
                    onClick={selectBackground}
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
                            backgroundColor={templateBackgroundColor}
                            onClick={selectBackground}
                        >
                            <TitleCardView {...titleCard} />
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
                    <EditorSidebar
                        editorMode={selected.type}
                        textColor={'#000'}
                        backgroundColor={selectedBackgroundColor}
                        onBackgroundColorChange={setSelectedBackgroundColor}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}

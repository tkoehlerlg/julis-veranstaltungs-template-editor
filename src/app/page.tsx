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
    EventCardView,
} from '@/components/template'
import { useCallback, useMemo, useState } from 'react'
import { ThemeTemplate } from '@/lib/color'

type Selection =
    | {
          type: 'background'
      }
    | {
          type: 'title'
      }
    | {
          type: 'card'
          uuid: string
      }

export default function Home() {
    const [selected, setSelected] = useState<Selection>({
        type: 'background',
    })
    const [templateBackgroundColor, setTemplateBackgroundColor] = useState(
        ThemeTemplate.background as string
    )
    const [titleCard, setTitleCard] = useState<TitleCard>(defaultTitleCard)
    const [cards, setCards] = useState<EventCard[]>([
        {
            uuid: '',
            title: 'Test Event',
            textColor: '#000',
            backgroundColor: '#fff',
        },
    ])

    const selectedText = useMemo(() => {
        switch (selected.type) {
            case 'title':
                return titleCard.title
            case 'card':
                const card = cards.find((card) => card.uuid === selected.uuid)
                return card?.title
        }
    }, [cards, selected, titleCard.title])
    const setSelectedText = useCallback(
        (text: string) => {
            switch (selected.type) {
                case 'title':
                    setTitleCard((prevState) => ({
                        ...prevState,
                        title: text,
                    }))
                    break
                case 'card':
                    setCards((prevState) => {
                        if (
                            !prevState.some(
                                (card) => card.uuid === selected.uuid
                            )
                        )
                            return prevState
                        return prevState.map((card) =>
                            card.uuid === selected.uuid
                                ? { ...card, title: text }
                                : card
                        )
                    })
            }
        },
        [selected]
    )

    const selectedTextColor = useMemo(() => {
        switch (selected.type) {
            case 'title':
                return titleCard.textColor
            case 'card':
                const card = cards.find((card) => card.uuid === selected.uuid)
                return card?.textColor
        }
    }, [cards, selected, titleCard.textColor])
    const setSelectedTextColor = useCallback(
        (color: string) => {
            switch (selected.type) {
                case 'title':
                    setTitleCard((prevState) => ({
                        ...prevState,
                        textColor: color,
                    }))
                    break
                case 'card':
                    setCards((prevState) => {
                        if (
                            !prevState.some(
                                (card) => card.uuid === selected.uuid
                            )
                        )
                            return prevState
                        return prevState.map((card) =>
                            card.uuid === selected.uuid
                                ? { ...card, textColor: color }
                                : card
                        )
                    })
            }
        },
        [selected]
    )

    const selectedBackgroundColor = useMemo(() => {
        switch (selected.type) {
            case 'background':
                return templateBackgroundColor
            case 'title':
                return titleCard.backgroundColor
            case 'card':
                const card = cards.find((card) => card.uuid === selected.uuid)
                return card?.backgroundColor
        }
    }, [cards, selected, templateBackgroundColor, titleCard.backgroundColor])
    const setSelectedBackgroundColor = useCallback(
        (color: string) => {
            switch (selected.type) {
                case 'background':
                    setTemplateBackgroundColor(color)
                    break
                case 'title':
                    setTitleCard((prevState) => ({
                        ...prevState,
                        backgroundColor: color,
                    }))
                    break
                case 'card':
                    setCards((prevState) => {
                        if (
                            !prevState.some(
                                (card) => card.uuid === selected.uuid
                            )
                        )
                            return prevState
                        return prevState.map((card) =>
                            card.uuid === selected.uuid
                                ? { ...card, backgroundColor: color }
                                : card
                        )
                    })
            }
        },
        [selected]
    )

    const selectBackground = () => setSelected({ type: 'background' })
    const selectTitleCard = () => setSelected({ type: 'title' })
    const selectCard = (id: string) => setSelected({ type: 'card', uuid: id })

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
                            isSelected={selected.type === 'background'}
                            backgroundColor={templateBackgroundColor}
                            onClick={selectBackground}
                        >
                            <TitleCardView
                                {...titleCard}
                                isSelected={selected.type === 'title'}
                                onClick={selectTitleCard}
                            />
                            {cards.map((card) => (
                                <EventCardView key={card.uuid} {...card} />
                            ))}
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
                        text={selectedText}
                        onTextChange={setSelectedText}
                        textColor={selectedTextColor}
                        onTextColorChange={setSelectedTextColor}
                        backgroundColor={selectedBackgroundColor}
                        onBackgroundColorChange={setSelectedBackgroundColor}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}

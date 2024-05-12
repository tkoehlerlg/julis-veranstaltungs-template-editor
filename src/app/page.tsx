'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorSidebar } from '@/components/editorSidebar'
import {
    TemplateBox,
    TitleCardView,
    EventCardView,
} from '@/components/template'
import { AppContextProvider, useAppContext } from '@/app/appContext'
import { useMemo } from 'react'

export default function App() {
    return (
        <AppContextProvider>
            <Home />
        </AppContextProvider>
    )
}

function Home() {
    const {
        selected,
        setBackgroundSelected,
        setTitleSelected,
        setCardSelected,
        templateBackgroundColor,
        titleCard,
        cards,
        selectedText,
        selectedTextColor,
        selectedBackgroundColor,
        setSelectedText,
        setSelectedTextColor,
        setSelectedBackgroundColor,
    } = useAppContext()

    const editorId = useMemo(
        () =>
            selected.type +
            (selected.type === 'card' ? `-${selected.uuid}` : ''),
        [selected]
    )

    return (
        <main>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    defaultSize={75}
                    className={'flex h-dvh flex-col pl-10 pt-11'}
                    onClick={setBackgroundSelected}
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
                            onClick={setBackgroundSelected}
                            className={'scale-125'}
                        >
                            <TitleCardView
                                {...titleCard}
                                isSelected={selected.type === 'title'}
                                onClick={setTitleSelected}
                            />
                            <div className={'flex flex-col gap-1'}>
                                {cards.map((card) => (
                                    <EventCardView
                                        key={card.uuid}
                                        {...card}
                                        isSelected={
                                            selected.type === 'card' &&
                                            selected.uuid == card.uuid
                                        }
                                        onClick={() =>
                                            setCardSelected(card.uuid)
                                        }
                                    />
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
                    <EditorSidebar
                        editorId={editorId}
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

import { createContext, useCallback, useContext, useState } from 'react'
import { ITitleCard, IEventCard, Selection } from './types'
import { uuid } from 'uuidv4'
import { ChildProps } from '@/lib/propTypes'
import { THEME } from '@/utils/theme'

interface IEditorContent {
    selected?: Selection
    setSelected: (
        selection:
            | Selection
            | undefined
            | ((prev: Selection | undefined) => Selection | undefined)
    ) => void
    templateBackgroundColor: string
    updateTemplateBackgroundColor: (color: string) => void
    titleCard: ITitleCard
    updateTitleCard: (card: Partial<ITitleCard>) => void
    cards: IEventCard[]
    addCard: (atPosition?: number) => void
    updateCard(uuid: string, card: Partial<IEventCard>): void
    deleteCard: (uuid: string) => void
}

const didNotInitAlert = () =>
    console.log('You did not initiate TemplateEditorContext')

const TemplateEditorContext = createContext<IEditorContent>({
    selected: undefined,
    setSelected: () => didNotInitAlert,
    templateBackgroundColor: THEME.palette.template.background,
    updateTemplateBackgroundColor: () => didNotInitAlert,
    titleCard: {
        title: '',
        textColor: THEME.palette.template.yellow,
        backgroundColor: THEME.palette.template.magenta,
    },
    updateTitleCard: () => didNotInitAlert,
    cards: [],
    addCard: () => didNotInitAlert,
    updateCard: () => didNotInitAlert,
    deleteCard: () => didNotInitAlert,
})

export const useTemplateEditorContext = () => useContext(TemplateEditorContext)

export function TemplateEditorContextProvider({ children }: ChildProps) {
    const [selected, setSelected] = useState<Selection | undefined>(undefined)
    const [templateBackgroundColor, setTemplateBackgroundColor] = useState(
        THEME.palette.template.background as string
    )
    const [titleCard, setTitleCard] = useState<ITitleCard>({
        title: '',
        textColor: THEME.palette.template.yellow,
        backgroundColor: THEME.palette.template.magenta,
    })
    const [cards, setCards] = useState<IEventCard[]>([
        {
            uuid: '000',
            title: 'Test Event',
            textColor: THEME.palette.template.yellow,
            backgroundColor: THEME.palette.template.magenta,
        },
        {
            uuid: '001',
            title: 'Test Event 2',
            textColor: THEME.palette.template.yellow,
            backgroundColor: THEME.palette.template.magenta,
        },
    ])

    const updateTemplateBackgroundColor = useCallback(
        (color: string) => setTemplateBackgroundColor(color),
        []
    )

    const updateTitleCard = useCallback(
        (card: Partial<ITitleCard>) =>
            setTitleCard((prevState) => ({ ...prevState, ...card })),
        []
    )

    const addCard = useCallback((atPosition?: number) => {
        const newCard: IEventCard = {
            uuid: uuid(),
            title: 'Neues Event',
            textColor: THEME.palette.template.yellow,
            backgroundColor: THEME.palette.template.magenta,
        }
        if (atPosition !== undefined) {
            setCards((prevState) => {
                const newCards = [...prevState]
                newCards.splice(atPosition, 0, newCard)
                return newCards
            })
        } else {
            setCards((prevState) => [...prevState, newCard])
        }
        setSelected({ type: 'card', uuid: newCard.uuid })
    }, [])

    const updateCard = useCallback(
        (uuid: string, updatedCard: Partial<IEventCard>) =>
            setCards((prevState) =>
                prevState.map((card) =>
                    card.uuid === uuid ? { ...card, ...updatedCard } : card
                )
            ),
        []
    )

    const deleteCard = useCallback(
        (uuid: string) => {
            const index = cards.findIndex((card) => card.uuid === uuid)
            setCards((prevState) =>
                prevState.filter((card) => card.uuid !== uuid)
            )
            if (selected?.type === 'card' && selected.uuid === uuid) {
                if (index === 0) {
                    setSelected({ type: 'title' })
                } else {
                    setSelected({
                        type: 'card',
                        uuid: cards[index - 1].uuid,
                    })
                }
            }
        },
        [cards, selected]
    )

    return (
        <TemplateEditorContext.Provider
            value={{
                selected,
                setSelected,
                templateBackgroundColor,
                updateTemplateBackgroundColor,
                titleCard,
                updateTitleCard,
                cards,
                addCard,
                updateCard,
                deleteCard,
            }}
        >
            {children}
        </TemplateEditorContext.Provider>
    )
}

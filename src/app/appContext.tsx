import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { ThemeTemplate } from '@/lib/color'
import { TitleCard, EventCard, TTitleCard } from '@/components/template'

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

interface IAppContet {
    selected: Selection
    setBackgroundSelected: () => void
    setTitleSelected: () => void
    setCardSelected: (uuid: string) => void
    templateBackgroundColor: string
    titleCard: TTitleCard
    cards: EventCard[]
    selectedText?: string
    selectedTextColor?: string
    selectedBackgroundColor?: string
    setSelectedText: (text: string) => void
    setSelectedTextColor: (color: string) => void
    setSelectedBackgroundColor: (color: string) => void
}

const didNotInitAlert = () => {
    console.log('You did not initiate AppContext')
}
const AppContext = createContext<IAppContet>({
    selected: { type: 'background' },
    setBackgroundSelected: () => didNotInitAlert,
    setTitleSelected: () => didNotInitAlert,
    setCardSelected: (uuid: string) => didNotInitAlert,
    templateBackgroundColor: ThemeTemplate.background,
    titleCard: TitleCard,
    cards: [],
    selectedText: undefined,
    selectedTextColor: undefined,
    selectedBackgroundColor: undefined,
    setSelectedText: (text: string) => didNotInitAlert,
    setSelectedTextColor: (color: string) => didNotInitAlert,
    setSelectedBackgroundColor: (color: string) => didNotInitAlert,
})

export const useAppContext = () => useContext(AppContext)

export function AppContextProvider({ children }: { children: ReactNode }) {
    const [selected, setSelected] = useState<Selection>({
        type: 'background',
    })
    const [templateBackgroundColor, setTemplateBackgroundColor] = useState(
        ThemeTemplate.background as string
    )
    const [titleCard, setTitleCard] = useState<TTitleCard>(TitleCard)
    const [cards, setCards] = useState<EventCard[]>([
        {
            uuid: '000',
            title: 'Test Event',
            textColor: ThemeTemplate.yellow,
            backgroundColor: ThemeTemplate.magenta,
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

    const setBackgroundSelected = () => setSelected({ type: 'background' })
    const setTitleSelected = () => setSelected({ type: 'title' })
    const setCardSelected = (uuid: string) =>
        setSelected({ type: 'card', uuid })

    return (
        <AppContext.Provider
            value={{
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
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

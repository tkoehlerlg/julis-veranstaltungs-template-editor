import {
    createContext,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import {
    ITitleCard,
    titleCardSchema,
    IEventCard,
    eventCardSchema,
    Selection,
    ICategory,
    categorySchema,
} from './types'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { ChildProps } from '@/lib/propTypes'
import { THEME } from '@/utils/theme'
import { IEditorSidebarRef } from '@/components/editor/editorSidebar'

type Directions = 'down' | 'up'

interface IEditorContent {
    isLoadingFromLocalStorage: boolean
    resetLocalStorage: () => void
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
    moveCard: (uuid: string, direction: 'up' | 'down', by?: number) => void
    getPossibleDirectionsForCard: (uuid: string) => Directions[]
    editorSidebarRef?: RefObject<IEditorSidebarRef>
    categories: ICategory[]
    updateCategory: (uuid: string, category: Partial<ICategory>) => void
    focusEditorSidebarTitle: () => void
}

const didNotInitAlert = () =>
    console.log('You did not initiate TemplateEditorContext')

const TemplateEditorContext = createContext<IEditorContent>({
    isLoadingFromLocalStorage: false,
    resetLocalStorage: () => didNotInitAlert,
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
    moveCard: () => didNotInitAlert,
    getPossibleDirectionsForCard: () => [],
    categories: [],
    updateCategory: () => didNotInitAlert,
    editorSidebarRef: undefined,
    focusEditorSidebarTitle: () => didNotInitAlert,
})

const defaultStyle = {
    textColor: THEME.palette.template.yellow,
    backgroundColor: THEME.palette.template.magenta,
}

export const useTemplateEditorContext = () => useContext(TemplateEditorContext)

const templateEditorNameSpace = '8a3e7d6f-af5c-4bfb-b0be-2d1a5e4d6f9f'

export function TemplateEditorContextProvider({ children }: ChildProps) {
    const [isLoadingFromLocalStorage, setIsLoadingFromLocalStorage] =
        useState(true)
    const [selected, setSelected] = useState<Selection | undefined>(undefined)
    const [templateBackgroundColor, baseSetTemplateBackgroundColor] = useState(
        THEME.palette.template.background as string
    )
    const [titleCard, baseSetTitleCard] = useState<ITitleCard>({
        title: '',
        ...defaultStyle,
    })
    const [cards, baseSetCards] = useState<IEventCard[]>([
        {
            uuid: uuidv4(),
            categoryId: uuidv5('category-1', templateEditorNameSpace),
            title: '',
            ...defaultStyle,
        },
    ])
    const [categories, baseSetCategories] = useState<ICategory[]>([
        {
            uuid: uuidv5('category-1', templateEditorNameSpace),
            name: '',
            ...defaultStyle,
        },
    ])
    const editorSidebarRef = useRef<IEditorSidebarRef>(null)

    const setTemplateBackgroundColor = useCallback((color: string) => {
        localStorage.setItem('templateBackgroundColor', color)
        baseSetTemplateBackgroundColor(color)
    }, [])

    const setTitleCard = useCallback((card: Partial<ITitleCard>) => {
        baseSetTitleCard((prevState) => {
            const newTitleCard = { ...prevState, ...card }
            localStorage.setItem('titleCard', JSON.stringify(newTitleCard))
            return newTitleCard
        })
    }, [])

    const setCards = useCallback(
        (cards: IEventCard[] | ((prevState: IEventCard[]) => IEventCard[])) => {
            baseSetCards((prevState) => {
                const newCards =
                    typeof cards === 'function' ? cards(prevState) : cards
                localStorage.setItem('cards', JSON.stringify(newCards))
                return newCards
            })
        },
        []
    )

    const setCategories = useCallback(
        (
            categories: ICategory[] | ((prevState: ICategory[]) => ICategory[])
        ) => {
            baseSetCategories((prevState) => {
                const newCategories =
                    typeof categories === 'function'
                        ? categories(prevState)
                        : categories
                localStorage.setItem(
                    'categories',
                    JSON.stringify(newCategories)
                )
                return newCategories
            })
        },
        []
    )

    // Run on mount only
    useEffect(() => {
        const templateBackgroundColor = localStorage.getItem(
            'templateBackgroundColor'
        )
        if (templateBackgroundColor) {
            baseSetTemplateBackgroundColor(templateBackgroundColor)
        }
        const titleCard = localStorage.getItem('titleCard')
        try {
            if (titleCard && titleCard !== 'undefined') {
                const parsedTitleCard = titleCardSchema.safeParse(
                    JSON.parse(titleCard)
                )
                if (parsedTitleCard.success) {
                    baseSetTitleCard(parsedTitleCard.data)
                }
            }

            const cards = localStorage.getItem('cards')
            if (cards && cards !== 'undefined') {
                const parsedCards = eventCardSchema
                    .array()
                    .safeParse(JSON.parse(cards))
                if (parsedCards.success) {
                    baseSetCards(parsedCards.data)
                }
            }

            const categories = localStorage.getItem('categories')
            if (categories && categories !== 'undefined') {
                const parsedCategories = categorySchema
                    .array()
                    .safeParse(JSON.parse(categories))
                if (parsedCategories.success) {
                    baseSetCategories(parsedCategories.data)
                }
            }
            setIsLoadingFromLocalStorage(false)
        } catch (error) {
            console.error('Error loading from localStorage', error)
        }
    }, [])

    const resetLocalStorage = useCallback(() => {
        localStorage.removeItem('templateBackgroundColor')
        localStorage.removeItem('titleCard')
        localStorage.removeItem('cards')
        localStorage.removeItem('categories')
        baseSetTemplateBackgroundColor(THEME.palette.template.background)
        baseSetTitleCard({ title: '', ...defaultStyle })
        baseSetCards([
            {
                uuid: uuidv4(),
                categoryId: uuidv5('category-1', templateEditorNameSpace),
                title: '',
                ...defaultStyle,
            },
        ])
        baseSetCategories([
            {
                uuid: uuidv5('category-1', templateEditorNameSpace),
                name: '',
                ...defaultStyle,
            },
        ])
        setSelected(undefined)
    }, [])

    const updateTemplateBackgroundColor = useCallback(
        (color: string) => setTemplateBackgroundColor(color),
        [setTemplateBackgroundColor]
    )

    const updateTitleCard = useCallback(
        (card: Partial<ITitleCard>) => setTitleCard(card),
        [setTitleCard]
    )

    const addCard = useCallback(
        (atPosition?: number) => {
            const newCard: IEventCard = {
                uuid: uuidv4(),
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
        },
        [setCards]
    )

    const updateCard = useCallback(
        (uuid: string, updatedCard: Partial<IEventCard>) =>
            setCards((prevState) =>
                prevState.map((card) =>
                    card.uuid === uuid ? { ...card, ...updatedCard } : card
                )
            ),
        [setCards]
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
        [cards, setCards, selected]
    )

    const moveCard = useCallback(
        (uuid: string, direction: 'up' | 'down', by: number = 1) => {
            const index = cards.findIndex((card) => card.uuid === uuid)
            if (index === -1) return
            const newIndex = direction === 'up' ? index - by : index + by
            if (newIndex < 0 || newIndex >= cards.length) return
            const newCards = [...cards]
            newCards.splice(index, 1)
            newCards.splice(newIndex, 0, cards[index])
            setCards(newCards)
        },
        [cards, setCards]
    )

    const getPossibleDirectionsForCard = useCallback(
        (uuid: string) => {
            const cardIndex = cards.findIndex((card) => card.uuid === uuid)
            let possibleDirections: Directions[] = []
            if (cardIndex > 0) possibleDirections.push('up')
            if (cardIndex < cards.length - 1) possibleDirections.push('down')
            return possibleDirections
        },
        [cards]
    )

    const updateCategory = useCallback(
        (uuid: string, category: Partial<ICategory>) => {
            setCategories((prevState) =>
                prevState.map((cat) =>
                    cat.uuid === uuid ? { ...cat, ...category } : cat
                )
            )
            if (
                category.textColor === undefined &&
                category.backgroundColor === undefined
            ) {
                return
            }
            setCards((prevState) =>
                prevState.map((card) =>
                    card.categoryId === uuid
                        ? {
                              ...card,
                              textColor: category.textColor ?? card.textColor,
                              backgroundColor:
                                  category.backgroundColor ??
                                  card.backgroundColor,
                          }
                        : card
                )
            )
        },
        [setCategories, setCards]
    )

    const focusEditorSidebarTitle = useCallback(() => {
        editorSidebarRef.current?.focusTextArea()
    }, [editorSidebarRef])

    return (
        <TemplateEditorContext.Provider
            value={{
                isLoadingFromLocalStorage,
                resetLocalStorage,
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
                categories,
                updateCategory,
                editorSidebarRef,
                focusEditorSidebarTitle,
                moveCard,
                getPossibleDirectionsForCard,
            }}
        >
            {children}
        </TemplateEditorContext.Provider>
    )
}

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
    ICreateCategory,
} from './types'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { ChildProps } from '@/lib/propTypes'
import { THEME } from '@/utils/theme'
import { IEditorSidebarRef } from '@/components/editor/editorSidebar'
import { useHistory } from '@/lib/hooks/useHistory'

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
    cardsMap: Map<string, IEventCard>
    addCard: (atPosition?: number) => void
    updateCard(uuid: string, card: Partial<IEventCard>): void
    deleteCard: (uuid: string) => void
    moveCard: (uuid: string, direction: 'up' | 'down', by?: number) => void
    getPossibleDirectionsForCard: (uuid: string) => Directions[]
    editorSidebarRef?: RefObject<IEditorSidebarRef>
    categories: ICategory[]
    categoriesMap: Map<string, ICategory>
    addCategory: (newCategory: ICreateCategory) => ICategory
    updateCategory: (
        uuid: string,
        category:
            | ((prevState: ICategory) => Partial<ICategory>)
            | Partial<ICategory>
    ) => void
    deleteCategory: (uuid: string, replaceWith?: string) => void
    focusEditorSidebarTitle: () => void
    historyControl: {
        canUndo: boolean
        canRedo: boolean
        undo: () => void
        redo: () => void
    }
}

const didNotInitAlert = () =>
    console.log('You did not initiate TemplateEditorContext')
function throwNotInitError<T>(): T {
    throw new Error('You did not initiate TemplateEditorContext')
}

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
    cardsMap: new Map(),
    addCard: () => didNotInitAlert,
    updateCard: () => didNotInitAlert,
    deleteCard: () => didNotInitAlert,
    moveCard: () => didNotInitAlert,
    getPossibleDirectionsForCard: () => [],
    categories: [],
    categoriesMap: new Map(),
    addCategory: () => throwNotInitError<ICategory>(),
    updateCategory: () => didNotInitAlert,
    deleteCategory: () => didNotInitAlert,
    editorSidebarRef: undefined,
    focusEditorSidebarTitle: () => didNotInitAlert,
    historyControl: {
        canUndo: false,
        canRedo: false,
        undo: () => didNotInitAlert,
        redo: () => didNotInitAlert,
    },
})

interface TemplateState {
    backgroundColor: string
    titleCard: ITitleCard
    cards: IEventCard[]
    categories: ICategory[]
}

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
    const [
        {
            backgroundColor: templateBackgroundColor,
            titleCard,
            cards,
            categories,
        },
        setTemplateState,
        historyControl,
    ] = useHistory<TemplateState>({
        backgroundColor: THEME.palette.template.background,
        titleCard: {
            title: '',
            ...defaultStyle,
        },
        cards: [
            {
                uuid: uuidv4(),
                categoryId: uuidv5('category-1', templateEditorNameSpace),
                title: '',
                ...defaultStyle,
            },
        ],
        categories: [
            {
                uuid: uuidv5('category-1', templateEditorNameSpace),
                name: '',
                ...defaultStyle,
            },
        ],
    })
    const cardsMap = new Map(cards.map((card) => [card.uuid, card]))
    const categoriesMap = new Map(categories.map((cat) => [cat.uuid, cat]))
    const editorSidebarRef = useRef<IEditorSidebarRef>(null)

    const setTemplateBackgroundColor = useCallback(
        (color: string) => {
            localStorage.setItem('templateBackgroundColor', color)
            setTemplateState((prevState) => ({
                ...prevState,
                backgroundColor: color,
            }))
        },
        [setTemplateState]
    )

    const setTitleCard = useCallback(
        (titleCard: Partial<ITitleCard>) => {
            setTemplateState((prevState) => {
                const newTitleCard = { ...prevState.titleCard, ...titleCard }
                localStorage.setItem('titleCard', JSON.stringify(newTitleCard))
                return { ...prevState, titleCard: newTitleCard }
            })
        },
        [setTemplateState]
    )

    const setCards = useCallback(
        (cards: IEventCard[] | ((prevState: IEventCard[]) => IEventCard[])) => {
            setTemplateState((prevState) => {
                const newCards =
                    typeof cards === 'function' ? cards(prevState.cards) : cards
                localStorage.setItem('cards', JSON.stringify(newCards))
                return { ...prevState, cards: newCards }
            })
        },
        [setTemplateState]
    )

    const setCategories = useCallback(
        (
            categories: ICategory[] | ((prevState: ICategory[]) => ICategory[])
        ) => {
            setTemplateState((prevState) => {
                const newCategories =
                    typeof categories === 'function'
                        ? categories(prevState.categories)
                        : categories
                localStorage.setItem(
                    'categories',
                    JSON.stringify(newCategories)
                )
                return { ...prevState, categories: newCategories }
            })
        },
        [setTemplateState]
    )

    const undo = useCallback(() => {
        const newState = historyControl.goBack()
        if (
            (selected?.type === 'card' &&
                !newState.cards.find((card) => card.uuid === selected.uuid)) ||
            (selected?.type === 'category' &&
                !newState.categories.find(
                    (category) => category.uuid === selected.uuid
                ))
        ) {
            setSelected(undefined)
        }
    }, [historyControl, selected])

    const redo = useCallback(() => {
        const newState = historyControl.goForward()
        if (
            (selected?.type === 'card' &&
                !newState.cards.find((card) => card.uuid === selected.uuid)) ||
            (selected?.type === 'category' &&
                !newState.categories.find(
                    (category) => category.uuid === selected.uuid
                ))
        ) {
            setSelected(undefined)
        }
    }, [historyControl, selected])

    useEffect(() => {
        const templateBackgroundColor = localStorage.getItem(
            'templateBackgroundColor'
        )
        if (templateBackgroundColor) {
            setTemplateState(
                (prevState) => ({
                    ...prevState,
                    backgroundColor: templateBackgroundColor,
                }),
                false
            )
        }
        const titleCard = localStorage.getItem('titleCard')
        try {
            if (titleCard && titleCard !== 'undefined') {
                const parsedTitleCard = titleCardSchema.safeParse(
                    JSON.parse(titleCard)
                )
                if (parsedTitleCard.success) {
                    setTemplateState(
                        (prevState) => ({
                            ...prevState,
                            titleCard: parsedTitleCard.data,
                        }),
                        false
                    )
                } else {
                    console.error(
                        'Error parsing titleCard',
                        parsedTitleCard.error
                    )
                }
            }

            const cards = localStorage.getItem('cards')
            if (cards && cards !== 'undefined') {
                const parsedCards = eventCardSchema
                    .array()
                    .safeParse(JSON.parse(cards))
                if (parsedCards.success) {
                    setTemplateState(
                        (prevState) => ({
                            ...prevState,
                            cards: parsedCards.data,
                        }),
                        false
                    )
                } else {
                    console.error('Error parsing cards', parsedCards.error)
                }
            }

            const categories = localStorage.getItem('categories')
            if (categories && categories !== 'undefined') {
                const parsedCategories = categorySchema
                    .array()
                    .safeParse(JSON.parse(categories))
                if (parsedCategories.success) {
                    setTemplateState(
                        (prevState) => ({
                            ...prevState,
                            categories: parsedCategories.data,
                        }),
                        false
                    )
                } else {
                    console.error(
                        'Error parsing categories',
                        parsedCategories.error
                    )
                }
            }
            setIsLoadingFromLocalStorage(false)
        } catch (error) {
            console.error('Error loading from localStorage', error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Run on mount only

    const resetLocalStorage = useCallback(() => {
        localStorage.removeItem('templateBackgroundColor')
        localStorage.removeItem('titleCard')
        localStorage.removeItem('cards')
        localStorage.removeItem('categories')
        setTemplateState({
            backgroundColor: THEME.palette.template.background,
            titleCard: {
                title: '',
                ...defaultStyle,
            },
            cards: [
                {
                    uuid: uuidv4(),
                    categoryId: uuidv5('category-1', templateEditorNameSpace),
                    title: '',
                    ...defaultStyle,
                },
            ],
            categories: [
                {
                    uuid: uuidv5('category-1', templateEditorNameSpace),
                    name: '',
                    ...defaultStyle,
                },
            ],
        })
    }, [setTemplateState])

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
                categoryId: categories[0].uuid ?? null, // TODO: Create new category
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
        [categories, setCards]
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
                    if (cards.length <= 1) {
                        setSelected(undefined)
                    } else {
                        setSelected({
                            type: 'card',
                            uuid: cards[1].uuid,
                        })
                    }
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

    const addCategory = useCallback(
        (newCategory: ICreateCategory) => {
            const newCategoryWithUuid = {
                ...defaultStyle,
                ...newCategory,
                uuid: uuidv4(),
            }
            setCategories((prevState) => [...prevState, newCategoryWithUuid])
            return newCategoryWithUuid
        },
        [setCategories]
    )

    const updateCategory = useCallback(
        (
            uuid: string,
            category:
                | ((prevState: ICategory) => Partial<ICategory>)
                | Partial<ICategory>
        ) => {
            const toUpdate = categories.find((cat) => cat.uuid === uuid)
            if (!toUpdate) return
            const updatedCategory =
                typeof category === 'function' ? category(toUpdate) : category
            setCategories((prevState) => {
                return prevState.map((cat) =>
                    cat.uuid === uuid ? { ...cat, ...updatedCategory } : cat
                )
            })
            if (
                updatedCategory.textColor === undefined &&
                updatedCategory.backgroundColor === undefined
            ) {
                return
            }
            setCards((prevState) =>
                prevState.map((card) =>
                    card.categoryId === uuid
                        ? {
                              ...card,
                              textColor:
                                  updatedCategory.textColor ?? card.textColor,
                              backgroundColor:
                                  updatedCategory.backgroundColor ??
                                  card.backgroundColor,
                          }
                        : card
                )
            )
        },
        [categories, setCategories, setCards]
    )

    const deleteCategory = useCallback(
        (uuid: string, replaceWith?: string) => {
            setCategories((prevState) =>
                prevState.filter((cat) => cat.uuid !== uuid)
            )
            setCards((prevState) =>
                prevState.map((card) =>
                    card.categoryId === uuid
                        ? { ...card, categoryId: replaceWith ?? null }
                        : card
                )
            )
            if (selected?.type === 'category' && selected.uuid === uuid)
                setSelected(undefined)
        },
        [selected, setCategories, setCards]
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
                cardsMap,
                addCard,
                updateCard,
                deleteCard,
                categories,
                categoriesMap,
                addCategory,
                updateCategory,
                deleteCategory,
                editorSidebarRef,
                focusEditorSidebarTitle,
                moveCard,
                getPossibleDirectionsForCard,
                historyControl: {
                    canUndo: historyControl.canGoBack,
                    canRedo: historyControl.canGoForward,
                    undo,
                    redo,
                },
            }}
        >
            {children}
        </TemplateEditorContext.Provider>
    )
}

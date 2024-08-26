import { useCallback, useMemo, useState } from 'react'

export function useHistory<T>(
    initialState: T,
    updateInterval = 5,
    maxHistory = 50
) {
    const [history, setHistory] = useState<T[]>([initialState])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

    const currentState = useMemo(
        () => history[Math.min(currentIndex, history.length - 1)],
        [history, currentIndex]
    )

    const updateState = useCallback(
        (newState: T | ((prevState: T) => T), createNewHistory = true) => {
            const now = Date.now()
            if (
                updateInterval !== 0 &&
                now - lastUpdateTime < updateInterval * 1000
            ) {
                createNewHistory = false
            }
            if (createNewHistory) {
                setLastUpdateTime(now)
                setCurrentIndex((prevIndex) => {
                    setHistory((prevState) => [
                        ...prevState.slice(
                            Math.max(0, prevState.length - maxHistory + 1),
                            prevIndex + 1
                        ),
                        typeof newState === 'function'
                            ? (newState as (prevState: T) => T)(
                                  prevState[prevIndex]
                              )
                            : newState,
                    ])
                    return prevIndex + 1
                })
            } else {
                setHistory((prev) => [
                    ...prev.slice(
                        Math.max(0, prev.length - maxHistory + 1),
                        currentIndex
                    ),
                    typeof newState === 'function'
                        ? (newState as (prevState: T) => T)(prev[currentIndex])
                        : newState,
                ])
            }
        },
        [currentIndex, lastUpdateTime, maxHistory, updateInterval]
    )

    const canGoBack = useMemo(() => currentIndex > 0, [currentIndex])
    const canGoForward = useMemo(
        () => currentIndex < history.length - 1,
        [currentIndex, history]
    )

    const goBack = useCallback(() => {
        let newIndex = currentIndex
        if (currentIndex > 0)
            setCurrentIndex((prev) => {
                newIndex = prev - 1
                return newIndex
            })
        return history[newIndex]
    }, [currentIndex, history])
    const goForward = useCallback(() => {
        let newIndex = currentIndex
        if (currentIndex < history.length - 1)
            setCurrentIndex((prev) => {
                newIndex = prev + 1
                return newIndex
            })
        return history[newIndex]
    }, [currentIndex, history])

    return [
        currentState,
        updateState,
        {
            goBack,
            goForward,
            canGoBack,
            canGoForward,
        },
    ] as const
}

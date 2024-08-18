import { useCallback, useMemo, useState } from 'react'

export function useHistory<T>(
    initialState: T,
    updateInterval = 5,
    maxHistory = 50
) {
    const [history, setHistory] = useState<T[]>([initialState])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

    const currentState = useMemo(() => {
        return history[currentIndex]
    }, [history, currentIndex])

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
                setHistory((prev) => [
                    ...prev.slice(
                        Math.max(0, prev.length - maxHistory + 1),
                        currentIndex + 1
                    ),
                    typeof newState === 'function'
                        ? (newState as (prevState: T) => T)(prev[currentIndex])
                        : newState,
                ])
                setCurrentIndex((prev) => prev + 1)
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
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1)
    }, [currentIndex])
    const goForward = useCallback(() => {
        if (currentIndex < history.length - 1)
            setCurrentIndex((prev) => prev + 1)
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

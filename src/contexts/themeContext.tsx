'use client'

import { createContext, useContext } from 'react'

import { THEME } from '@/utils/theme'
import { ChildProps } from '@/lib/propTypes'

const ThemeContext = createContext(THEME)

export const useTheme = () => useContext(ThemeContext)

// Put this in your _app.tsx component and wrap all pages with it
export const GlobalThemeWrapper = ({ children }: ChildProps) => {
    return (
        <ThemeContext.Provider value={THEME}>{children}</ThemeContext.Provider>
    )
}

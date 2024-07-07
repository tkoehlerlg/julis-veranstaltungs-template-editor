import { ReactNode } from 'react'
import { RuleSet } from 'styled-components'

export interface ChildProps {
    children: ReactNode
}

export interface StyleProps {
    styles?: CssStyles
}

export type CssStyles = RuleSet<any>

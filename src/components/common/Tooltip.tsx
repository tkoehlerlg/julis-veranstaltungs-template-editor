'use client'

import { ReactNode, CSSProperties, useState, useMemo } from 'react'
import { ChildProps, CssStyles } from '@/lib/propTypes'
import { IPosition, Tooltip as ReactTooltip } from 'react-tooltip'
import { useTheme } from '@/contexts/themeContext'

type VariantType = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

type PlacesType =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'

type GlobalCloseEvents = {
    escape?: boolean
    scroll?: boolean
    resize?: boolean
    clickOutsideAnchor?: boolean
}

interface TooltipProps extends ChildProps {
    id: string
    tooltip: ReactNode
    tooltipStyles?: CSSProperties
    styles?: CssStyles
    place?: PlacesType
    offset?: number
    variant?: VariantType
    openOnClick?: boolean
    delayShow?: number
    delayHide?: number
    float?: boolean
    hidden?: boolean
    noArrow?: boolean
    clickable?: boolean
    globalCloseEvents?: GlobalCloseEvents
    /**
     * @description Used to disable default tooltip behavior.
     * Overrides `openEvents`, `closeEvents`, and `globalCloseEvents`.
     */
    imperativeModeOnly?: boolean
    position?: IPosition
    isOpen?: boolean
    defaultIsOpen?: boolean
    disableStyleInjection?: boolean | 'core'
    /**
     * @description see https://developer.mozilla.org/en-US/docs/Web/CSS/border.
     *
     * Adding a border with width > 3px, or with `em/cm/rem/...` instead of `px`
     * might break the tooltip arrow positioning.
     */
    border?: CSSProperties['border']
    opacity?: CSSProperties['opacity']
    arrowColor?: CSSProperties['backgroundColor']
    setIsOpen?: (value: boolean) => void
    afterShow?: () => void
    afterHide?: () => void
    disableTooltip?: (anchorRef: HTMLElement | null) => boolean
    role?: React.AriaRole
}

export function Tooltip(props: TooltipProps) {
    const theme = useTheme()
    const id = 'tooltip-' + props.id
    const variant = props.variant ?? 'light'

    const baseStyles: CSSProperties = useMemo(() => {
        switch (variant) {
            case 'dark':
                return {
                    backgroundColor: theme.palette.slate[800],
                    color: theme.palette.white,
                }
            case 'light':
                return {
                    backgroundColor: theme.palette.slate[200],
                    color: theme.palette.black,
                }
            default:
                return {}
        }
    }, [variant, theme])

    return (
        <div css={props.styles}>
            <a className={id}>{props.children}</a>
            <ReactTooltip
                anchorSelect={'.' + id}
                variant={variant}
                style={{
                    ...baseStyles,
                    ...props.tooltipStyles,
                }}
                {...props}
            >
                {props.tooltip}
            </ReactTooltip>
        </div>
    )
}

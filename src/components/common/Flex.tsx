import { forwardRef, MouseEvent, useMemo } from 'react'
import { ChildProps, StyleProps } from '@/lib/propTypes'
import { css } from 'styled-components'
import { motion, MotionProps } from 'framer-motion'
import { run } from '@/lib/run'

interface FlexProps extends ChildProps, StyleProps {
    id?: string
    dir?: 'row' | 'column'
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
    flex?: number
    basis?: string
    align?: 'center' | 'start' | 'end' | 'baseline'
    justify?:
        | 'center'
        | 'start'
        | 'end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    motionProps?: MotionProps
    childMarginRight?: string | number
    childMarginBottom?: string | number
    gap?: number
    stopPropagation?: boolean
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    onMouseUp?: () => void
    onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void
    onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void
}

/**
 * This component is a simple implementation of a flexbox.
 */
const Flex = forwardRef<HTMLDivElement, FlexProps>(
    (
        {
            id,
            dir = 'row',
            children,
            styles,
            align,
            wrap,
            justify,
            motionProps,
            flex,
            basis,
            childMarginBottom,
            childMarginRight,
            gap,
            stopPropagation = true,
            onClick,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
        },
        ref
    ) => {
        const defaultProps = useMemo(() => {
            return {
                id,
                onClick,
                onMouseUp,
                onMouseEnter,
                onMouseLeave,
            }
        }, [id, onClick, onMouseUp, onMouseEnter, onMouseLeave])

        const defaultStyles = css`
            display: flex;
            flex-direction: ${dir};

            ${run(() => {
                if (align) {
                    return css`
                        align-items: ${align};
                    `
                }
            })}

            ${run(() => {
                if (justify) {
                    return css`
                        justify-content: ${justify};
                    `
                }
            })}

        ${run(() => {
                if (wrap) {
                    return css`
                        flex-wrap: ${wrap};
                    `
                }
            })}

        ${run(() => {
                if (typeof flex === 'number') {
                    return css`
                        flex: ${flex};
                    `
                }
            })}

        ${run(() => {
                if (basis) {
                    return css`
                        flex-basis: ${basis};
                    `
                }
            })}

        ${run(() => {
                if (childMarginBottom) {
                    return css`
                        & > *:not(:last-child) {
                            margin-bottom: ${typeof childMarginBottom ===
                            'number'
                                ? `${childMarginBottom}px`
                                : childMarginBottom};
                        }
                    `
                }
            })}
          

        ${run(() => {
                if (childMarginRight) {
                    return css`
                        & > *:not(:last-child) {
                            margin-right: ${typeof childMarginRight === 'number'
                                ? `${childMarginRight}px`
                                : childMarginRight};
                        }
                    `
                }
            })}
     

        ${run(() => {
                if (gap) {
                    return css`
                        gap: ${`${gap}px`};
                    `
                }
            })}

        cursor: ${onClick ? 'pointer' : 'default'};
            -webkit-tap-highlight-color: transparent;

            :focus {
                outline: none;
            }

            ${styles}
        `

        if (!motionProps) {
            return (
                <div
                    {...defaultProps}
                    ref={ref}
                    css={defaultStyles}
                    onClick={(e) => {
                        if (stopPropagation) e.stopPropagation()
                        onClick?.(e)
                    }}
                >
                    {children}
                </div>
            )
        }

        return (
            <motion.div
                {...defaultProps}
                {...motionProps}
                css={defaultStyles}
                ref={ref}
                onClick={(e) => {
                    if (stopPropagation) e.stopPropagation()
                    onClick?.(e)
                }}
            >
                {children}
            </motion.div>
        )
    }
)

Flex.displayName = 'Flex'

export { Flex }

import { IEventCard } from '@/contexts/templateEditor/types'
import { isColorLight } from '@/lib/color'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { useCallback, useMemo } from 'react'
import { css } from 'styled-components'

export function EventCard({ card: eventCard }: { card: IEventCard }) {
    const theme = useTheme()
    const {
        selected,
        setSelected: baseSetSelected,
        focusEditorSidebarTitle,
    } = useTemplateEditorContext()

    const isSelected = useMemo(
        () => selected?.type === 'card' && selected.uuid === eventCard.uuid,
        [eventCard.uuid, selected]
    )
    const setSelected = useCallback(
        () => baseSetSelected({ type: 'card', uuid: eventCard.uuid }),
        [baseSetSelected, eventCard.uuid]
    )

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelected()
            }}
            css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                min-height: 22px;
                width: 100%;
                cursor: pointer;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    left: -2px;
                    background-color: ${eventCard.backgroundColor};
                    box-sizing: border-box;
                    height: 100%;
                    width: 100%;
                    transform: skewX(-9deg);
                    border-width: ${isSelected ? '2.5px' : '0'};
                    border-color: ${isColorLight(eventCard.backgroundColor)
                        ? theme.palette.black
                        : theme.palette.white};
                `}
            />
            <p
                onClick={() => setTimeout(() => focusEditorSidebarTitle(), 10)}
                css={css`
                    position: relative;
                    cursor: text;
                    white-space: pre-line;
                    padding: 4px 8px;
                    text-align: center;
                    font-family: ${theme.font.montserrat};
                    font-size: ${theme.fontSize.extraTiny};
                    font-weight: 900;
                    color: ${eventCard.title === ''
                        ? theme.palette.whiteOpacity[500]
                        : eventCard.textColor};
                `}
            >
                {eventCard.title === '' ? 'Event Title' : eventCard.title}
            </p>
        </div>
    )
}

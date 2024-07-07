import { isColorLight } from '@/lib/color'
import { css } from 'styled-components'
import { useTemplateEditorContext } from '@/contexts/templateEditor/templateEditorContext'
import { useCallback, useMemo } from 'react'
import { useTheme } from '@/contexts/themeContext'
import { Flex } from '@/components/common/Flex'

export function TitleCard() {
    const theme = useTheme()
    const {
        selected,
        setSelected: baseSetSelected,
        titleCard,
        focusEditorSidebarTitle,
    } = useTemplateEditorContext()

    const isSelected = useMemo(() => selected?.type === 'title', [selected])

    const setSelected = useCallback(
        () => baseSetSelected({ type: 'title' }),
        [baseSetSelected]
    )

    return (
        <Flex
            dir='column'
            align='center'
            justify='center'
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelected()
            }}
            styles={css`
                position: relative;
                min-height: 42px;
                width: 100%;
                cursor: pointer;
            `}
        >
            <div
                css={css`
                    z-index: -1;
                    position: absolute;
                    left: -2px;
                    height: 100%;
                    width: 100%;
                    background-color: ${titleCard.backgroundColor};
                    box-sizing: border-box;
                    transform: skewX(-9deg);
                    border-width: ${isSelected ? '2.5px' : '0'};
                    border-color: ${isColorLight(titleCard.backgroundColor)
                        ? theme.palette.black
                        : theme.palette.white};
                `}
            />
            <p
                onClick={() => setTimeout(() => focusEditorSidebarTitle(), 10)}
                css={css`
                    position: relative;
                    cursor: text;
                    white-space: pre-wrap;
                    padding: 6px 8px;
                    text-align: center;
                    font-family: ${theme.font.montserrat};
                    font-size: ${theme.fontSize.medium};
                    font-weight: 900;
                    color: ${titleCard.title === ''
                        ? theme.palette.whiteOpacity[500]
                        : titleCard.textColor};
                `}
            >
                {titleCard.title === '' ? 'Titel' : titleCard.title}
            </p>
        </Flex>
    )
}

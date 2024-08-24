import { ICategory } from '@/contexts/templateEditor/types'
import { isColorLight } from '@/lib/color'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { useCallback, useMemo } from 'react'
import { css } from 'styled-components'

export function CategoryCard({ category }: { category: ICategory }) {
    const theme = useTheme()
    const {
        selected,
        setSelected: baseSetSelected,
        focusEditorSidebarTitle,
    } = useTemplateEditorContext()

    const isSelected = useMemo(
        () => selected?.type === 'category' && selected.uuid === category.uuid,
        [category.uuid, selected]
    )
    const setSelected = useCallback(
        () => baseSetSelected({ type: 'category', uuid: category.uuid }),
        [baseSetSelected, category.uuid]
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
                min-height: 16px;
                min-width: 100px;
                cursor: pointer;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    left: -2px;
                    background-color: ${category.backgroundColor};
                    box-sizing: border-box;
                    height: 100%;
                    width: 100%;
                    transform: skewX(-9deg);
                    border-width: ${isSelected ? '2.5px' : '0'};
                    border-color: ${isColorLight(category.backgroundColor)
                        ? theme.palette.black
                        : theme.palette.white};
                `}
            />
            <div style={{ padding: '0 30px' }}>
                <p
                    onClick={() =>
                        setTimeout(() => focusEditorSidebarTitle(), 10)
                    }
                    css={css`
                        position: relative;
                        cursor: text;
                        white-space: pre-line;
                        padding: 1.5px 10px;
                        text-align: center;
                        font-family: ${theme.font.montserrat};
                        font-size: ${theme.fontSize.extraTiny};
                        font-weight: 900;
                        color: ${category.name === ''
                            ? theme.palette.whiteOpacity[500]
                            : category.textColor};
                    `}
                >
                    {category.name === '' ? 'Kategorie Name' : category.name}
                </p>
            </div>
        </div>
    )
}

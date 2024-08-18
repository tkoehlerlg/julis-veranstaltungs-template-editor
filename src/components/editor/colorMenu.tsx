import { HexColorInput, HexColorPicker } from 'react-colorful'
import { isColorLight } from '@/lib/color'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'

export type FeaturedColor = {
    name?: string
    color: string
}

interface ColorMenuProps {
    selectedColor: string
    onColorChange?: (color: string) => void
    featuredColors: FeaturedColor[]
}

export function ColorMenu({
    selectedColor,
    onColorChange,
    featuredColors,
}: ColorMenuProps) {
    const theme = useTheme()

    return (
        <div
            className={'color-picker'} // in src/styles/globals.css
            css={css`
                display: flex;
                flex-direction: column;
                gap: 16px;
                border-radius: 8px;
                border: 1px solid ${theme.palette.slate[200]};
                background-color: ${theme.palette.white};
                padding-bottom: 10px;
            `}
        >
            <HexColorPicker color={selectedColor} onChange={onColorChange} />
            <div
                css={css`
                    display: flex;
                    flex-direction: row;
                    align-items: baseline;
                    gap: 6px;
                    padding: 0 10px;
                    font-size: ${theme.fontSize.small};
                    font-weight: 500;
                `}
            >
                <p>HEX:</p>
                <HexColorInput
                    color={selectedColor}
                    onChange={onColorChange}
                    css={css`
                        width: 74px;
                        border-radius: 8px;
                        background-color: ${theme.palette.slate[100]};
                        padding: 10px;
                        font-size: ${theme.fontSize.small};
                        outline: none;
                    `}
                />
            </div>
            <div
                css={css`
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 6px;
                    padding: 0 10px;
                `}
            >
                {featuredColors.map((fc) => (
                    <div
                        key={fc.name}
                        css={css`
                            display: flex;
                            flex: 1;
                            flex-direction: column;
                            align-items: start;
                            gap: 4px;
                            cursor: pointer;
                        `}
                        onClick={() => onColorChange?.(fc.color)}
                    >
                        <div
                            css={css`
                                height: 44px;
                                width: 100%;
                                border-radius: 8px;
                                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                                background-color: ${fc.color};
                            `}
                        />
                        {fc.name && (
                            <p
                                css={css`
                                    font-size: 12px;
                                    color: ${isColorLight(fc.color, 0.85)
                                        ? 'black'
                                        : fc.color};
                                `}
                            >
                                {fc.name}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

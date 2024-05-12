import { HexColorInput, HexColorPicker } from 'react-colorful'
import { isColorLight } from '@/lib/color'

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
    return (
        <div
            className={
                'color-picker flex flex-col gap-4 rounded-lg border border-slate-200 bg-white pb-2.5'
            }
        >
            <HexColorPicker color={selectedColor} onChange={onColorChange} />
            <div
                className={
                    'flex flex-row items-baseline gap-1.5 px-2.5 text-sm font-medium'
                }
            >
                <p>HEX:</p>
                <HexColorInput
                    color={selectedColor}
                    onChange={onColorChange}
                    className={
                        'w-[72px] rounded-lg bg-slate-100 px-2.5 py-1 text-sm focus:outline-0'
                    }
                />
            </div>
            <div className={'grid grid-cols-4 gap-1.5 px-2.5'}>
                {featuredColors.map((fc) => (
                    <div
                        key={fc.name}
                        className={
                            'flex flex-1 cursor-pointer flex-col items-start gap-1'
                        }
                        onClick={() => onColorChange?.(fc.color)}
                    >
                        <div
                            className={`h-11 w-full rounded-lg shadow`}
                            style={{ backgroundColor: fc.color }}
                        />
                        {fc.name && (
                            <p
                                className={'text-[12px]'}
                                style={{
                                    color: isColorLight(fc.color, 0.85)
                                        ? 'black'
                                        : fc.color,
                                }}
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

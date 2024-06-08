import { CardStyles } from './types'
import { isColorLight, ThemeTemplate } from '@/lib/color'

export type TTitleCard = CardStyles & {
    isSelected?: boolean
    title: string
    onClick?: () => void
}

export const TitleCard: TTitleCard = {
    title: 'Test',
    textColor: ThemeTemplate.white,
    backgroundColor: ThemeTemplate.magenta,
}

export function TitleCardView({
    isSelected,
    title,
    textColor,
    backgroundColor,
    onClick,
}: TTitleCard) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClick?.()
            }}
            className={
                'relative flex min-h-[42px] w-full cursor-pointer flex-col items-center justify-center'
            }
        >
            <div
                className={
                    'absolute -left-0.5 box-border h-full w-full -skew-x-[9deg] border-[2.5px]'
                }
                style={{
                    backgroundColor: backgroundColor,
                    borderColor: isSelected
                        ? !isColorLight(backgroundColor)
                            ? 'white'
                            : 'black'
                        : 'transparent',
                }}
            />
            <p
                className={
                    'relative cursor-text whitespace-pre-wrap px-2 py-1.5 text-center font-monserrat text-lg font-black'
                }
                style={{
                    color: textColor,
                }}
            >
                {title}
            </p>
        </div>
    )
}

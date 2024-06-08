import { CardStyles } from '@/components/editor/template/card/types'
import { isColorLight } from '@/lib/color'

export type EventCard = CardStyles & {
    uuid: string
    isSelected?: boolean
    title: string
    textColor: string
    backgroundColor: string
    onClick?: () => void
}

export function EventCardView({
    isSelected,
    title,
    textColor,
    backgroundColor,
    onClick,
}: EventCard) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClick?.()
            }}
            className={
                'relative flex min-h-[22px] w-full cursor-pointer flex-col items-center justify-center'
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
                    'relative cursor-text whitespace-pre-line px-2 py-1 text-center font-monserrat text-[10px] font-black'
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

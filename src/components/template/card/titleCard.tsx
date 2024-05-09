import { CardStyles } from './types'
import { ThemeTemplate } from '@/lib/color'

export type TitleCard = CardStyles & {
    title: string
}

export const defaultTitleCard: TitleCard = {
    title: 'Test',
    textColor: ThemeTemplate.white,
    backgroundColor: ThemeTemplate.magenta,
}

export function TitleCardView({
    title,
    textColor,
    backgroundColor,
}: TitleCard) {
    return (
        <div
            className={
                'relative flex h-[42px] w-full flex-col items-center justify-center'
            }
        >
            <div
                className={'absolute -left-0.5 h-full w-full -skew-x-[9deg]'}
                style={{
                    backgroundColor: backgroundColor,
                }}
            />
            <p
                className={'relative font-monserrat text-lg font-black'}
                style={{
                    color: textColor,
                }}
            >
                {title}
            </p>
        </div>
    )
}

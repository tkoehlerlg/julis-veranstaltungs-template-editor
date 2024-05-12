import { ReactNode } from 'react'
import { isColorLight, ThemeTemplate } from '@/lib/color'

type TemplateBoxProps = {
    isSelected?: boolean
    backgroundColor: string
    onClick?: () => void
    children?: ReactNode | ReactNode[]
}

export function TemplateBox({
    isSelected,
    backgroundColor,
    onClick,
    children,
}: TemplateBoxProps) {
    return (
        <div
            className={
                'box-border w-[480px] cursor-pointer border-[2.5px] px-[27px] py-[16px]'
            }
            style={{
                backgroundColor: backgroundColor,
                borderColor: isSelected
                    ? isColorLight(backgroundColor)
                        ? 'black'
                        : ThemeTemplate.magenta
                    : 'transparent',
            }}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClick?.()
            }}
        >
            {children}
        </div>
    )
}

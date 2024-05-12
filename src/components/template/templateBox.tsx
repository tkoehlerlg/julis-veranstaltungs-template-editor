import { ReactNode } from 'react'
import { isColorLight, ThemeTemplate } from '@/lib/color'
import { cn } from '@/lib/utils'

type TemplateBoxProps = {
    isSelected?: boolean
    backgroundColor: string
    onClick?: () => void
    className?: string
    children?: ReactNode | ReactNode[]
}

export function TemplateBox({
    isSelected,
    backgroundColor,
    onClick,
    className,
    children,
}: TemplateBoxProps) {
    return (
        <div
            className={cn(
                'box-border flex w-[480px] cursor-pointer flex-col gap-2 border-[2.5px] px-[27px] py-[16px]',
                className
            )}
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

import { ReactNode } from 'react'

type TemplateBoxProps = {
    backgroundColor: string
    onClick?: () => void
    children?: ReactNode | ReactNode[]
}

export function TemplateBox({
    backgroundColor,
    onClick,
    children,
}: TemplateBoxProps) {
    return (
        <div
            className={'w-[400px] px-[27px] py-[16px]'}
            style={{
                backgroundColor: backgroundColor,
            }}
            onClick={(e) => {
                e.preventDefault()
                onClick?.()
            }}
        >
            {children}
        </div>
    )
}

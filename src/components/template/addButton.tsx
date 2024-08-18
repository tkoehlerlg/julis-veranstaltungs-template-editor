import { Plus } from 'lucide-react'
import { CssStyles } from '@/lib/propTypes'
import { css } from 'styled-components'

export const AddButton = ({
    onClick,
    paddingTop = 0,
    paddingBottom = 0,
    styles,
}: {
    onClick?: () => void
    paddingTop?: number
    paddingBottom?: number
    styles?: CssStyles
}) => (
    <div
        css={css`
            position: relative;
            z-index: 50;
            margin-top: -4px;
            margin-bottom: -4px;
            display: flex;
            height: 0;
            width: 100%;
            cursor: pointer;
            flex-direction: row;
            align-items: center;
            opacity: 0;
            transition: opacity 200ms;
            padding: ${paddingTop}px 20px ${paddingBottom}px;
            &:hover {
                opacity: 1;
            }
            ${styles}
        `}
        onClick={(e) => {
            e.stopPropagation()
            onClick?.()
        }}
    >
        <div
            css={css`
                box-sizing: content-box;
                height: 1.5px;
                width: 100%;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border: 0.5px solid black;
                border-right: 0;
                background-color: white;
            `}
        />
        <div
            css={css`
                display: flex;
                height: 14px;
                min-width: 14px;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                border: 0.5px solid black;
                background-color: white;
            `}
        >
            <Plus size={10} strokeWidth={2.5} color={'black'} />
        </div>
        <div
            css={css`
                box-sizing: content-box;
                height: 1.5px;
                width: 100%;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                border: 0.5px solid black;
                border-left: 0;
                background-color: white;
            `}
        />
    </div>
)

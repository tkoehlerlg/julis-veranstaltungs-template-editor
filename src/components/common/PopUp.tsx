import { Modal } from '@/components/common/Modal'
import { Flex } from '@/components/common/Flex'
import { useTheme } from '@/contexts/themeContext'
import styled, { css } from 'styled-components'

interface PopUp {
    title: string
    content: string
    primaryButtonText: string
    primaryButtonAction: () => void
    secondaryButtonText?: string
    secondaryButtonAction?: () => void
    onClose?: () => void
}

export function PopUp({
    title,
    content,
    primaryButtonText,
    primaryButtonAction,
    secondaryButtonText,
    secondaryButtonAction,
    onClose,
}: PopUp) {
    const theme = useTheme()
    const Button = styled.button<{ primary?: boolean }>`
        background-color: ${theme.palette.gray[100]};
        color: ${theme.palette.black};
        border: none;
        border-radius: 5px;
        padding: 10px 18px;
        margin-right: 10px;
        cursor: pointer;
        font-size: ${theme.fontSize.small};
        font-weight: 600;

        ${(props) =>
            props.primary &&
            css`
                background: ${theme.palette.template.blue};
                color: ${theme.palette.white};
            `}
    `

    return (
        <Modal onClose={onClose}>
            <Flex
                dir={'column'}
                align={'start'}
                gap={5}
                styles={css`
                    padding: 20px 30px;
                    border-radius: 15px;
                    background-color: ${theme.palette.white};
                    border: 2px solid ${theme.palette.slate[300]};
                    min-width: 400px;
                `}
            >
                <h1
                    css={css`
                        font-weight: 700;
                        font-size: ${theme.fontSize.smallLarge};
                    `}
                >
                    {title}
                </h1>
                <p>{content}</p>
                <Flex
                    dir={'column'}
                    align={'start'}
                    gap={10}
                    styles={css`
                        margin-top: 20px;
                    `}
                >
                    <Button primary onClick={primaryButtonAction}>
                        {primaryButtonText}
                    </Button>
                    {secondaryButtonText && secondaryButtonAction && (
                        <Button onClick={secondaryButtonAction}>
                            {secondaryButtonText}
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Modal>
    )
}

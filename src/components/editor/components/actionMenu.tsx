import { ChevronDown, ChevronUp } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { css } from 'styled-components'
import { Flex } from '@/components/common/Flex'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'

export function ActionMenu() {
    const theme = useTheme()

    const { selected, deleteCard, moveCard, getPossibleDirectionsForCard } =
        useTemplateEditorContext()

    const possibleDirectionsForCard = useMemo(
        () =>
            selected?.type === 'card'
                ? getPossibleDirectionsForCard(selected.uuid)
                : undefined,
        [getPossibleDirectionsForCard, selected]
    )

    if (selected?.type !== 'card') return null

    return (
        <Fragment>
            <h3
                css={css`
                    margin-top: 16px;
                    font-size: ${theme.fontSize.medium};
                    font-weight: 600;
                    color: ${theme.palette.gray[600]};
                `}
            >
                Aktionen
            </h3>
            <Flex dir='row' align='center' gap={5}>
                <button
                    onClick={() => deleteCard(selected.uuid)}
                    css={css`
                        flex: 1;
                        grid-column: span 2;
                        border-radius: 6px;
                        border: 2px solid ${theme.palette.red[500]};
                        background-color: ${theme.palette.white};
                        padding: 8px 16px;
                        font-weight: 600;
                        color: ${theme.palette.red[500]};
                        margin-right: 5px;
                    `}
                >
                    Löschen
                </button>
                <button
                    // prettier-ignore
                    disabled={ !possibleDirectionsForCard?.includes('up') }
                    onClick={() => moveCard(selected.uuid, 'up')}
                    // prettier-ignore
                    css={css`
                                display: flex;
                                justify-content: center;
                                border-radius: 6px;
                                border: 2px solid ${theme.palette.gray[500]};
                                background-color: ${theme.palette.white};
                                padding: 8px 12px;
                                font-weight: 600;
                                color: ${theme.palette.gray[500]};
                                opacity: ${possibleDirectionsForCard?.includes('up') ? 1 : 0.5};
                            `}
                >
                    <ChevronUp />
                </button>
                <button
                    // prettier-ignore
                    disabled={ !possibleDirectionsForCard?.includes('down') }
                    onClick={() => moveCard(selected.uuid, 'down')}
                    // prettier-ignore
                    css={css`
                                display: flex;
                                justify-content: center;
                                border-radius: 6px;
                                border: 2px solid ${theme.palette.gray[500]};
                                background-color: ${theme.palette.white};
                                padding: 8px 12px;
                                font-weight: 600;
                                color: ${theme.palette.gray[500]};
                                opacity: ${possibleDirectionsForCard?.includes('down') ? 1 : 0.5};
                            `}
                >
                    <ChevronDown />
                </button>
            </Flex>
        </Fragment>
    )
}

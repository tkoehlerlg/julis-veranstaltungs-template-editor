import { css } from 'styled-components'
import { Flex } from '@/components/common/Flex'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { RedoIcon, UndoIcon } from 'lucide-react'
import { Tooltip } from '@/components/common/Tooltip'

export const TemplateHeadline = () => {
    const theme = useTheme()
    const { historyControl } = useTemplateEditorContext()

    return (
        <Flex
            dir='row'
            align='center'
            gap={10}
            styles={css`
                pointer-events: none;
            `}
        >
            <h1
                css={css`
                    font-family: ${theme.font.montserrat};
                    font-size: ${theme.fontSize.display6};
                    font-weight: 900;
                    color: ${theme.palette.template.magenta};
                    pointer-events: auto;
                    margin-right: 10px;
                `}
            >
                JuLis Veranstaltungs-Template-Editor
            </h1>
            <Tooltip
                id={'undo'}
                tooltip={
                    <div>
                        Undo <kbd>cmd</kbd> + <kbd>Z</kbd>
                    </div>
                }
            >
                <button
                    disabled={!historyControl.canUndo}
                    onClick={() => historyControl.undo()}
                    css={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: auto;
                        height: 23px;
                        width: 33px;
                        background-color: ${theme.palette.slate[100]};
                        border: 1px solid ${theme.palette.slate[200]};
                        border-radius: 4px;
                        opacity: ${historyControl.canUndo ? 1 : 0.5};
                    `}
                >
                    <UndoIcon size={15} color={theme.palette.slate[600]} />
                </button>
            </Tooltip>
            <Tooltip
                id={'redo'}
                tooltip={
                    <div>
                        Redo <kbd>cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
                    </div>
                }
            >
                <button
                    disabled={!historyControl.canRedo}
                    onClick={() => historyControl.redo()}
                    css={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: auto;
                        height: 23px;
                        width: 33px;
                        background-color: ${theme.palette.slate[100]};
                        border: 1px solid ${theme.palette.slate[200]};
                        border-radius: 4px;
                        opacity: ${historyControl.canRedo ? 1 : 0.5};
                    `}
                >
                    <RedoIcon size={15} color={theme.palette.slate[600]} />
                </button>
            </Tooltip>
        </Flex>
    )
}

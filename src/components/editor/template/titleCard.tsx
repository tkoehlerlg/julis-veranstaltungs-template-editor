import { isColorLight } from '@/lib/color'
import { css } from 'styled-components'
import { useTemplateEditorContext } from '@/contexts/templateEditor/templateEditorContext'
import { useCallback, useMemo } from 'react'

export function TitleCard() {
    const {
        selected,
        setSelected: baseSetSelected,
        titleCard,
        updateTitleCard,
    } = useTemplateEditorContext()

    const isSelected = useMemo(() => selected?.type === 'title', [selected])

    const setSelected = useCallback(
        () => baseSetSelected({ type: 'title' }),
        [baseSetSelected]
    )

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelected()
            }}
            aria-label={'Template Title'}
            className={
                'relative flex min-h-[42px] w-full cursor-pointer flex-col items-center justify-center'
            }
        >
            <div
                className={
                    'absolute -left-0.5 box-border h-full w-full -skew-x-[9deg] border-[2.5px]'
                }
                style={{
                    backgroundColor: titleCard.backgroundColor,
                    borderColor: isSelected
                        ? !isColorLight(titleCard.backgroundColor)
                            ? 'white'
                            : 'black'
                        : 'transparent',
                }}
            />
            <textarea
                value={titleCard.title}
                onChange={(e) => updateTitleCard({ title: e.target.value })}
                placeholder={'Titel'}
                css={css`
                    background-color: blue;
                `}
            />
        </div>
    )
}

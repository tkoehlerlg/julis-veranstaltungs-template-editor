import { forwardRef, useCallback, useMemo } from 'react'
import { useTheme } from '@/contexts/themeContext'
import { useTemplateEditorContext } from '@/contexts/templateEditor'
import { Flex } from '@/components/common/Flex'
import { css } from 'styled-components'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const TitleTextField = forwardRef<HTMLTextAreaElement>((_, ref) => {
    const theme = useTheme()
    const {
        selected,
        titleCard,
        updateTitleCard,
        cardsMap,
        updateCard,
        categoriesMap,
        updateCategory,
    } = useTemplateEditorContext()

    const selectedText = useMemo(() => {
        switch (selected?.type) {
            case 'title':
                return titleCard.title
            case 'card':
                return cardsMap.get(selected.uuid)?.title
            case 'category':
                return categoriesMap.get(selected.uuid)?.name
        }
    }, [selected, titleCard.title, cardsMap, categoriesMap])

    const textAreaTitle = useMemo(() => {
        switch (selected?.type) {
            case 'title':
                return 'Überschrift'
            case 'card':
                return 'Text in der Kachel'
            case 'category':
                return 'Name der Kategorie'
        }
    }, [selected?.type])

    const textAreaPlaceholder = useMemo(() => {
        switch (selected?.type) {
            case 'title':
                return 'Juli 2024'
            case 'card':
                return '16. April - JuLis & Friends...'
            case 'category':
                return 'Kategorie'
        }
    }, [selected?.type])

    const setSelectedText = useCallback(
        (text: string) => {
            if (selected) {
                switch (selected.type) {
                    case 'title':
                        return updateTitleCard({ title: text })
                    case 'card':
                        return updateCard(selected.uuid, { title: text })
                    case 'category':
                        return updateCategory(selected.uuid, { name: text })
                }
            }
        },
        [selected, updateTitleCard, updateCard, updateCategory]
    )

    if (selected?.type === 'background') return null

    return (
        <Flex
            dir='column'
            gap={6}
            styles={css`
                margin-top: 10px;
                width: 100%;
            `}
        >
            <Label htmlFor='text-field'>{textAreaTitle}</Label>
            <Textarea
                ref={ref}
                id='text-field'
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder={textAreaPlaceholder}
                css={css`
                    resize: none;
                    border: 1px solid ${theme.palette.slate[300]};
                    &:focus {
                        outline: 2px solid ${theme.palette.slate[300]};
                    }
                `}
            />
        </Flex>
    )
})

TitleTextField.displayName = 'TitleTextField'

export { TitleTextField }

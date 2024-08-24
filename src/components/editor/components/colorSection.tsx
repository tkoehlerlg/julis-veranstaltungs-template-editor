import {
    forwardRef,
    Fragment,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react'
import { SwitchButton } from '@/components/ui/switchButton'
import { ColorMenu } from './colorMenu'
import { EditorDefaults } from '../defaults'
import { useTemplateEditorContext } from '@/contexts/templateEditor'

type ColorPickerAttribute = 'text' | 'background'

export interface ColorSectionRef {
    setSelectedAttribute: (attribute: ColorPickerAttribute) => void
}
interface ColorSectionProps {
    id: string
}

const ColorPickerAttributeLabel: Record<ColorPickerAttribute, string> = {
    text: 'Text',
    background: 'Background',
} as const

const ColorSection = forwardRef<ColorSectionRef, ColorSectionProps>(
    ({ id }, ref) => {
        const [selectedAttribute, setSelectedAttribute] =
            useState<ColorPickerAttribute>('text')

        const {
            templateBackgroundColor,
            selected,
            titleCard,
            cardsMap,
            categoriesMap,
            updateTemplateBackgroundColor,
            updateTitleCard,
            updateCard,
            updateCategory,
        } = useTemplateEditorContext()

        const selectedType = useMemo(() => selected?.type, [selected])
        const selectedCard = useMemo(
            () =>
                selected?.type === 'card'
                    ? cardsMap.get(selected.uuid)
                    : undefined,
            [selected, cardsMap]
        )
        const selectedCategory = useMemo(
            () =>
                selected?.type === 'category'
                    ? categoriesMap.get(selected.uuid)
                    : undefined,
            [selected, categoriesMap]
        )

        const selectedColor = useMemo(() => {
            if (selectedType !== 'background' && selectedAttribute === 'text') {
                switch (selectedType) {
                    case 'title':
                        return titleCard.textColor
                    case 'card':
                        return selectedCard?.textColor
                    case 'category':
                        return selectedCategory?.textColor
                }
            }
            switch (selectedType) {
                case 'background':
                    return templateBackgroundColor
                case 'title':
                    return titleCard.backgroundColor
                case 'card':
                    return selectedCard?.backgroundColor
                case 'category':
                    return selectedCategory?.backgroundColor
            }
        }, [
            selectedType,
            selectedAttribute,
            titleCard.textColor,
            titleCard.backgroundColor,
            selectedCard?.textColor,
            selectedCard?.backgroundColor,
            selectedCategory?.textColor,
            selectedCategory?.backgroundColor,
            templateBackgroundColor,
        ])

        const onSelectedColorChange = useCallback(
            (color: string) => {
                if (!selected) return
                if (
                    selected.type !== 'background' &&
                    selectedAttribute === 'text'
                ) {
                    switch (selected.type) {
                        case 'title':
                            return updateTitleCard({ textColor: color })
                        case 'card':
                            return updateCard(selected.uuid, {
                                textColor: color,
                            })
                        case 'category':
                            return updateCategory(selected.uuid, {
                                textColor: color,
                            })
                    }
                }
                switch (selected.type) {
                    case 'background':
                        return updateTemplateBackgroundColor(color)
                    case 'title':
                        return updateTitleCard({ backgroundColor: color })
                    case 'card':
                        return updateCard(selected.uuid, {
                            backgroundColor: color,
                        })
                    case 'category':
                        return updateCategory(selected.uuid, {
                            backgroundColor: color,
                        })
                }
            },
            [
                selected,
                selectedAttribute,
                updateCard,
                updateCategory,
                updateTemplateBackgroundColor,
                updateTitleCard,
            ]
        )

        useImperativeHandle(ref, () => ({
            setSelectedAttribute,
        }))

        return (
            <Fragment>
                {selected?.type !== 'background' && (
                    <SwitchButton
                        layoutIdExtension={id}
                        selected={selectedAttribute}
                        options={
                            Object.keys(
                                ColorPickerAttributeLabel
                            ) as ColorPickerAttribute[]
                        }
                        onChange={setSelectedAttribute}
                    />
                )}

                <ColorMenu
                    selectedColor={selectedColor ?? '#fff'}
                    onColorChange={onSelectedColorChange}
                    featuredColors={
                        selectedType === 'background'
                            ? EditorDefaults.backgroundFeatureColors
                            : EditorDefaults.cardFeatureColors
                    }
                />
            </Fragment>
        )
    }
)

ColorSection.displayName = 'ColorSection'

export { ColorSection }

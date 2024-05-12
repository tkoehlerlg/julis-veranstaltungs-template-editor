import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SwitchButton } from '@/components/switchButton'
import { ThemeTemplate } from '@/lib/color'
import { cn } from '@/lib/utils'
import { ColorMenu, FeaturedColor } from '@/components/editorSidebar/colorMenu'

const defaultCardFeatureColors: FeaturedColor[] = [
    { name: 'Blau', color: ThemeTemplate.blue },
    { name: 'Magenta', color: ThemeTemplate.magenta },
    { name: 'Gelb', color: ThemeTemplate.yellow },
    { name: 'Weiß', color: ThemeTemplate.white },
    { name: 'Schwarz', color: ThemeTemplate.black },
]

const defaultBackgroundFeatureColors: FeaturedColor[] = [
    { name: 'D. Grau', color: ThemeTemplate.background },
    { name: 'Magenta', color: ThemeTemplate.magenta },
]

type EditorMode = 'title' | 'card' | 'background'

interface EditorSidebarProps {
    editorId: string
    editorMode: EditorMode
    text?: string
    onTextChange?: (title: string) => void
    applyOnSimilar?: boolean
    onApplyOnSimilarChange?: (applyOnSimilar: boolean) => void
    textColor?: string
    onTextColorChange?: (color: string) => void
    backgroundColor?: string
    onBackgroundColorChange?: (color: string) => void
    cardFeaturedColors?: FeaturedColor[]
    backgroundFeaturedColors?: FeaturedColor[]
}

const EditorColorPickerAttribute = {
    text: 'Text',
    background: 'Background',
} as const

export function EditorSidebar({
    editorId,
    editorMode,
    text,
    onTextChange,
    applyOnSimilar,
    onApplyOnSimilarChange,
    textColor,
    onTextColorChange,
    backgroundColor,
    onBackgroundColorChange,
    cardFeaturedColors = [],
    backgroundFeaturedColors = [],
}: EditorSidebarProps) {
    const prevEditorIdRef = useRef<string>()
    const [selectedAttribute, setSelectedAttribute] = useState<
        (typeof EditorColorPickerAttribute)[keyof typeof EditorColorPickerAttribute]
    >(EditorColorPickerAttribute.text)

    const showTitle = useMemo(
        () => editorMode === 'title' || editorMode === 'card',
        [editorMode]
    )

    const showApplyOnSimilar = useMemo(
        () => editorMode === 'card',
        [editorMode]
    )

    const showAttributeSwitch = useMemo(
        () => editorMode === 'card' || editorMode === 'title',
        [editorMode]
    )

    const featureColors = useMemo(() => {
        if (editorMode === 'card' || editorMode === 'title') {
            return defaultCardFeatureColors.concat(cardFeaturedColors)
        } else {
            return defaultBackgroundFeatureColors.concat(
                backgroundFeaturedColors
            )
        }
    }, [editorMode, cardFeaturedColors, backgroundFeaturedColors])

    const selectedColor = useMemo(() => {
        if (editorMode === 'background') {
            return backgroundColor
        }
        if (selectedAttribute === EditorColorPickerAttribute.text) {
            return textColor
        } else {
            return backgroundColor
        }
    }, [editorMode, selectedAttribute, backgroundColor, textColor])

    const onColorChange = useCallback(
        (color: string) => {
            if (editorMode === 'background') {
                onBackgroundColorChange?.(color)
                return
            }
            if (selectedAttribute === EditorColorPickerAttribute.text) {
                onTextColorChange?.(color)
            } else {
                onBackgroundColorChange?.(color)
            }
        },
        [
            onTextColorChange,
            onBackgroundColorChange,
            selectedAttribute,
            editorMode,
        ]
    )

    useEffect(() => {
        if (prevEditorIdRef.current !== editorId) {
            setSelectedAttribute(EditorColorPickerAttribute.text)
            prevEditorIdRef.current = editorId
        }
    }, [editorId])

    return (
        <div className='flex h-full w-full flex-col gap-2.5 bg-[#FCFCFC] p-4 pt-16'>
            <h2 className={cn('text-xl font-bold', !showTitle && '-mb-5')}>
                Editor
            </h2>
            {showTitle && (
                <div className='mt-2.5 grid w-full gap-1.5'>
                    <Label htmlFor='text-field'>
                        {editorMode === 'card'
                            ? 'Text in der Kachel'
                            : 'Überschrift'}
                    </Label>
                    <Textarea
                        value={text}
                        onChange={(e) => onTextChange?.(e.target.value)}
                        placeholder='16. April - JuLis & Friends...'
                        id='text-field'
                        className='resize-none border border-slate-300  focus:ring-slate-300'
                    />
                </div>
            )}
            <h3 className='mt-4 text-lg font-semibold text-gray-600'>
                {!showAttributeSwitch ? 'Hintergrundfarbe' : 'Styles'}
            </h3>
            {showApplyOnSimilar && (
                <div className='flex items-center space-x-2'>
                    <Switch
                        id='apply-on-similar'
                        checked={applyOnSimilar}
                        onCheckedChange={onApplyOnSimilarChange}
                    />
                    <Label htmlFor='apply-on-similar'>
                        Auf gleichfarbige anwenden
                    </Label>
                </div>
            )}
            {showAttributeSwitch && (
                <SwitchButton
                    layoutIdExtension={editorId}
                    selected={selectedAttribute}
                    options={Object.values(EditorColorPickerAttribute)}
                    onChange={(selected) =>
                        setSelectedAttribute(
                            selected as typeof selectedAttribute
                        )
                    }
                />
            )}

            <ColorMenu
                selectedColor={selectedColor ?? '#fff'}
                onColorChange={onColorChange}
                featuredColors={featureColors}
            />
        </div>
    )
}

import { useCallback, useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SwitchButton } from '@/components/switchButton'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { isColorLight, ThemeTemplate } from '@/lib/color'
import { cn } from '@/lib/utils'

const featureColors = [
    { name: 'Blau', color: ThemeTemplate.blue },
    { name: 'Magenta', color: ThemeTemplate.magenta },
    { name: 'Gelb', color: ThemeTemplate.yellow },
    { name: 'Weiß', color: ThemeTemplate.white },
]

type EditorMode = 'headline' | 'card' | 'background'

interface EditorSidebarProps {
    editorMode: EditorMode
    title?: string
    onTitleChange?: (title: string) => void
    applyOnSimilar?: boolean
    onApplyOnSimilarChange?: (applyOnSimilar: boolean) => void
    textColor?: string
    onTextColorChange?: (color: string) => void
    backgroundColor?: string
    onBackgroundColorChange?: (color: string) => void
}

const EditorColorPickerAttribute = {
    text: 'Text',
    background: 'Background',
} as const

export function EditorSidebar({
    editorMode,
    title,
    onTitleChange,
    applyOnSimilar,
    onApplyOnSimilarChange,
    textColor,
    onTextColorChange,
    backgroundColor,
    onBackgroundColorChange,
}: EditorSidebarProps) {
    const [selectedAttribute, setSelectedAttribute] = useState<
        (typeof EditorColorPickerAttribute)[keyof typeof EditorColorPickerAttribute]
    >(EditorColorPickerAttribute.text)

    const showTitle = useMemo(
        () => editorMode === 'headline' || editorMode === 'card',
        [editorMode]
    )

    const showApplyOnSimilar = useMemo(
        () => editorMode === 'card',
        [editorMode]
    )

    const showAttributeSwitch = useMemo(
        () => editorMode === 'card' || editorMode === 'headline',
        [editorMode]
    )

    const selectedColor = useMemo(() => {
        if (editorMode === 'background') {
            return backgroundColor
        }
        if (selectedAttribute === EditorColorPickerAttribute.text) {
            return textColor
        } else {
            return backgroundColor
        }
    }, [selectedAttribute, textColor, backgroundColor])

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
        [onTextColorChange, onBackgroundColorChange, selectedAttribute]
    )

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
                        value={title}
                        onChange={(e) => onTitleChange?.(e.target.value)}
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
                    selected={selectedAttribute}
                    options={Object.values(EditorColorPickerAttribute)}
                    onChange={(selected) =>
                        setSelectedAttribute(
                            selected as typeof selectedAttribute
                        )
                    }
                />
            )}

            <div
                className={
                    'color-picker flex flex-col gap-4 rounded-lg border border-slate-200 bg-white pb-2.5'
                }
            >
                <HexColorPicker
                    color={selectedColor}
                    onChange={onColorChange}
                />
                <div
                    className={
                        'flex flex-row items-baseline gap-1.5 px-2.5 text-sm font-medium'
                    }
                >
                    <p>HEX:</p>
                    <HexColorInput
                        color={selectedColor}
                        onChange={onColorChange}
                        className={
                            'w-20 rounded-lg bg-slate-100 px-2.5 py-1 text-sm focus:outline-0'
                        }
                    />
                </div>
                <div className={'flex flex-row gap-1.5 px-2.5'}>
                    {featureColors.map((color) => (
                        <div
                            key={color.name}
                            className={
                                'flex flex-1 cursor-pointer flex-col items-start gap-1'
                            }
                            onClick={() => onColorChange(color.color)}
                        >
                            <div
                                className={`h-11 w-full rounded-lg shadow`}
                                style={{ backgroundColor: color.color }}
                            />
                            <p
                                className={'text-[12px]'}
                                style={{
                                    color: isColorLight(color.color, 0.85)
                                        ? 'black'
                                        : color.color,
                                }}
                            >
                                {color.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

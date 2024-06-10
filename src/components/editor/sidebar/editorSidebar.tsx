import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SwitchButton } from '@/components/ui/switchButton'
import { ThemeTemplate } from '@/lib/color'
import { cn } from '@/lib/utils'
import { ColorMenu, FeaturedColor } from '@/components/editor/sidebar/colorMenu'
import { useEditorContext } from '@/contexts/editorContext'

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

const EditorCPAttribute = {
    text: 'Text',
    background: 'Background',
} as const

export function EditorSidebar() {
    const prevEditorIdRef = useRef<string>()
    const [selectedAttribute, setSelectedAttribute] = useState<
        (typeof EditorCPAttribute)[keyof typeof EditorCPAttribute]
    >(EditorCPAttribute.text)

    const {
        selected,
        selectedText,
        setSelectedText,
        selectedBackgroundColor,
        setSelectedBackgroundColor,
        selectedTextColor,
        setSelectedTextColor,
    } = useEditorContext()

    const editorMode = useMemo(() => selected?.type, [selected])
    const editorId = useMemo(
        () =>
            selected?.type +
            (selected?.type === 'card' ? `-${selected.uuid}` : ''),
        [selected]
    )

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
            return defaultCardFeatureColors
        } else {
            return defaultBackgroundFeatureColors
        }
    }, [editorMode])

    const selectedColor = useMemo(() => {
        if (
            editorMode !== 'background' &&
            selectedAttribute === EditorCPAttribute.text
        ) {
            return selectedTextColor
        }
        return selectedBackgroundColor
    }, [
        editorMode,
        selectedAttribute,
        selectedBackgroundColor,
        selectedTextColor,
    ])

    const onColorChange = useCallback(
        (color: string) => {
            if (
                editorMode !== 'background' &&
                selectedAttribute === EditorCPAttribute.text
            ) {
                setSelectedTextColor(color)
            } else {
                setSelectedBackgroundColor(color)
            }
        },
        [
            setSelectedTextColor,
            setSelectedBackgroundColor,
            selectedAttribute,
            editorMode,
        ]
    )

    useEffect(() => {
        if (prevEditorIdRef.current !== editorId) {
            setSelectedAttribute(EditorCPAttribute.text)
            prevEditorIdRef.current = editorId
        }
    }, [editorId])

    return selected ? (
        <div className='flex h-full w-full flex-col gap-2.5 bg-[#FCFCFC] p-4 pt-16'>
            <h2 className={cn('text-xl font-bold', !showTitle && '-mb-5')}>
                Edit Sidebar
            </h2>
            {showTitle && (
                <div className='mt-2.5 grid w-full gap-1.5'>
                    <Label htmlFor='text-field'>
                        {editorMode === 'card'
                            ? 'Text in der Kachel'
                            : 'Überschrift'}
                    </Label>
                    <Textarea
                        value={selectedText}
                        onChange={(e) => setSelectedText(e.target.value)}
                        placeholder='16. April - JuLis & Friends...'
                        id='text-field'
                        className='resize-none border border-slate-300  focus:ring-slate-300'
                    />
                </div>
            )}
            <h3 className='mt-4 text-lg font-semibold text-gray-600'>
                {!showAttributeSwitch ? 'Hintergrundfarbe' : 'Styles'}
            </h3>
            {/*{showApplyOnSimilar && (*/}
            {/*    <div className='flex items-center space-x-2'>*/}
            {/*        <Switch*/}
            {/*            id='apply-on-similar'*/}
            {/*            checked={applyOnSimilar}*/}
            {/*            onCheckedChange={onApplyOnSimilarChange}*/}
            {/*        />*/}
            {/*        <Label htmlFor='apply-on-similar'>*/}
            {/*            Auf gleichfarbige anwenden*/}
            {/*        </Label>*/}
            {/*    </div>*/}
            {/*)}*/}
            {showAttributeSwitch && (
                <SwitchButton
                    layoutIdExtension={editorId}
                    selected={selectedAttribute}
                    options={Object.values(EditorCPAttribute)}
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
    ) : (
        <div className='flex h-full w-full flex-col gap-2.5 bg-[#FCFCFC] p-4 pt-16'>
            <h2 className={cn('text-xl font-bold', !showTitle && '-mb-5')}>
                Bearbeitungsleiste
            </h2>
            <p className='mt-5 grid w-full gap-1.5 text-xs text-gray-400'>
                Bitte wähle etwas aus um es hier zu bearbeiten.
            </p>
        </div>
    )
}

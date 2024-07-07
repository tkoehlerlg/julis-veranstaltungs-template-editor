import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SwitchButton } from '@/components/ui/switchButton'
import { cn } from '@/lib/utils'
import { ColorMenu, FeaturedColor } from '@/components/editor/sidebar/colorMenu'
import { useTemplateEditorContext } from '@/contexts/templateEditor/templateEditorContext'
import { THEME } from '@/utils/theme'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { Flex } from '@/components/common/Flex'

const defaultCardFeatureColors: FeaturedColor[] = [
    { name: 'Blau', color: THEME.palette.template.blue },
    { name: 'Magenta', color: THEME.palette.template.magenta },
    { name: 'Gelb', color: THEME.palette.template.yellow },
    { name: 'Weiß', color: THEME.palette.white },
    { name: 'Schwarz', color: THEME.palette.black },
]

const defaultBackgroundFeatureColors: FeaturedColor[] = [
    { name: 'D. Grau', color: THEME.palette.background },
    { name: 'Magenta', color: THEME.palette.template.magenta },
]

// EditorColorPickerAttribute
const EditorCPAttribute = {
    text: 'Text',
    background: 'Background',
} as const

export function EditorSidebar() {
    const prevEditorIdRef = useRef<string>()
    const [selectedCPAttribute, setSelectedCPAttribute] = useState<
        (typeof EditorCPAttribute)[keyof typeof EditorCPAttribute]
    >(EditorCPAttribute.text)

    const {
        selected,
        templateBackgroundColor,
        updateTemplateBackgroundColor,
        titleCard,
        updateTitleCard,
        cards,
        updateCard,
        deleteCard,
    } = useTemplateEditorContext()

    const selectedType = useMemo(() => selected?.type, [selected])
    const selectedCard = useMemo(
        () =>
            selected?.type === 'card'
                ? cards.find((card) => card.uuid === selected?.uuid)
                : undefined,
        [selected, cards]
    )

    const editorId = useMemo(
        () =>
            selected?.type +
            (selected?.type === 'card' ? `-${selected.uuid}` : ''),
        [selected]
    )

    const selectedText = useMemo(() => {
        switch (selectedType) {
            case 'title':
                return titleCard.title
            case 'card':
                return selectedCard?.title
        }
    }, [selectedType, titleCard.title, selectedCard?.title])

    const setSelectedText = useCallback(
        (text: string) => {
            if (selected) {
                switch (selected.type) {
                    case 'title':
                        return updateTitleCard({ title: text })
                    case 'card':
                        return updateCard(selected.uuid, { title: text })
                }
            }
        },
        [selected, updateTitleCard, updateCard]
    )

    const selectedColor = useMemo(() => {
        if (
            selectedType !== 'background' &&
            selectedCPAttribute === EditorCPAttribute.text
        ) {
            switch (selectedType) {
                case 'title':
                    return titleCard.textColor
                case 'card':
                    return selectedCard?.textColor
            }
        }
        switch (selectedType) {
            case 'background':
                return templateBackgroundColor
            case 'title':
                return titleCard.backgroundColor
            case 'card':
                return selectedCard?.backgroundColor
        }
    }, [
        selectedType,
        selectedCPAttribute,
        selectedCard?.backgroundColor,
        selectedCard?.textColor,
        templateBackgroundColor,
        titleCard.backgroundColor,
        titleCard.textColor,
    ])

    const onSelectedColorChange = useCallback(
        (color: string) => {
            if (!selected) return
            if (
                selectedType !== 'background' &&
                selectedCPAttribute === EditorCPAttribute.text
            ) {
                switch (selected.type) {
                    case 'title':
                        return updateTitleCard({ textColor: color })
                    case 'card':
                        return updateCard(selected.uuid, { textColor: color })
                }
            }
            switch (selected.type) {
                case 'background':
                    return updateTemplateBackgroundColor(color)
                case 'title':
                    return updateTitleCard({ backgroundColor: color })
                case 'card':
                    return updateCard(selected.uuid, { backgroundColor: color })
            }
        },
        [
            selected,
            selectedType,
            selectedCPAttribute,
            updateTitleCard,
            updateCard,
            updateTemplateBackgroundColor,
        ]
    )

    // Reset selected attribute when switching between selected elements
    useEffect(() => {
        if (prevEditorIdRef.current !== editorId) {
            setSelectedCPAttribute(EditorCPAttribute.text)
            prevEditorIdRef.current = editorId
        }
    }, [editorId])

    return selected ? (
        <div className='flex h-full w-full flex-col gap-2.5 bg-[#FCFCFC] p-4 pt-16'>
            <h2
                className={cn(
                    'text-xl font-bold',
                    selectedType !== 'background' && '-mb-5'
                )}
            >
                Edit Sidebar
            </h2>
            {selectedType !== 'background' && (
                <div className='mt-2.5 grid w-full gap-1.5'>
                    <Label htmlFor='text-field'>
                        {selectedType === 'card'
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
                {selectedType === 'background' ? 'Hintergrundfarbe' : 'Styles'}
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
            {selectedType !== 'background' && (
                <SwitchButton
                    layoutIdExtension={editorId}
                    selected={selectedCPAttribute}
                    options={Object.values(EditorCPAttribute)}
                    onChange={(selected) =>
                        setSelectedCPAttribute(
                            selected as typeof selectedCPAttribute
                        )
                    }
                />
            )}

            <ColorMenu
                selectedColor={selectedColor ?? '#fff'}
                onColorChange={onSelectedColorChange}
                featuredColors={
                    selectedType === 'background'
                        ? defaultBackgroundFeatureColors
                        : defaultCardFeatureColors
                }
            />

            {selected?.type === 'card' && (
                <Fragment>
                    <h3 className='mt-4 text-lg font-semibold text-gray-600'>
                        Aktionen
                    </h3>
                    <button
                        onClick={() => deleteCard(selected.uuid)}
                        className='rounded-md border-2 border-red-500 bg-white px-4 py-2 font-semibold text-red-500'
                    >
                        Delete
                    </button>
                </Fragment>
            )}
        </div>
    ) : (
        <div className='flex h-full w-full flex-col gap-2.5 bg-[#FCFCFC] p-4 pt-16'>
            <h2 className={'text-xl font-bold'}>Bearbeitungsleiste</h2>
            <p className='mt-5 grid w-full gap-1.5 text-xs text-gray-400'>
                Bitte wähle etwas aus um es hier zu bearbeiten.
            </p>
        </div>
    )
}

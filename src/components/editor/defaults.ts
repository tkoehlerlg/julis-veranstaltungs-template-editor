import { THEME } from '@/utils/theme'
import { FeaturedColor } from './types'

export class EditorDefaults {
    static cardFeatureColors: FeaturedColor[] = [
        { name: 'Blau', color: THEME.palette.template.blue },
        { name: 'Magenta', color: THEME.palette.template.magenta },
        { name: 'Gelb', color: THEME.palette.template.yellow },
        { name: 'Weiß', color: THEME.palette.white },
        { name: 'Schwarz', color: THEME.palette.black },
    ]

    static backgroundFeatureColors: FeaturedColor[] = [
        { name: 'D. Grau', color: THEME.palette.template.background },
        { name: 'Magenta', color: THEME.palette.template.magenta },
    ]
}

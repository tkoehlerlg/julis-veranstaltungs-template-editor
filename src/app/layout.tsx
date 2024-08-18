import '@/styles/globals.css'
import 'react-tooltip/dist/react-tooltip.css'

import type { Metadata } from 'next'
import StyledComponentsRegistry from '@/lib/registry'
import { cn } from '@/lib/utils'
import { GlobalThemeWrapper } from '@/contexts/themeContext'
import { THEME } from '@/utils/theme'
import { inter, montserrat } from '@/lib/font'
import { ChildProps } from '@/lib/propTypes'

export const metadata: Metadata = {
    title: 'JuLis - Veranstaltungs-Template-Editor',
    description:
        'Erstelle schenll und einfach Übersichten für deine nächsten Veranstaltungen',
}

export default function RootLayout({ children }: ChildProps) {
    return (
        <html lang='de'>
            <body
                className={cn(
                    'antialiased',
                    inter.variable,
                    montserrat.variable
                )}
                style={{
                    backgroundColor: THEME.palette.white,
                    minHeight: '100vh',
                    fontFamily: THEME.font.inter,
                }}
            >
                <StyledComponentsRegistry>
                    <GlobalThemeWrapper>{children}</GlobalThemeWrapper>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}

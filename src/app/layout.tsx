import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import StyledComponentsRegistry from '@/lib/registry'
import { Inter, Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import { css } from 'styled-components'
import { THEME } from '@/utils/theme'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-monserrat',
})

export const metadata: Metadata = {
    title: 'JuLis - Veranstaltungs-Template-Editor',
    description:
        'Erstelle schenll und einfach Übersichten für deine nächsten Veranstaltungen',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
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
                    fontFamily: THEME.fontFamily.inter,
                }}
            >
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </body>
        </html>
    )
}

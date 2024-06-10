import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

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
    children: React.ReactNode
}>) {
    return (
        <html lang='de'>
            <body
                className={cn(
                    'bg-background min-h-screen font-sans antialiased',
                    inter.variable,
                    montserrat.variable
                )}
            >
                {children}
            </body>
        </html>
    )
}

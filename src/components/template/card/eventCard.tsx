import { CardStyles } from '@/components/template/card/types'

export type EventCard = CardStyles & {
    uuid: string
    title: string
    textColor: string
    backgroundColor: string
}

export function EventCardView() {}

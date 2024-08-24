import { z } from 'zod'

export type Selection =
    | {
          type: 'background'
      }
    | {
          type: 'title'
      }
    | {
          type: 'card'
          uuid: string
      }
    | {
          type: 'category'
          uuid: string
      }

const hexSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color')

export interface ITitleCard extends ICardStyles {
    title: string
}

export const titleCardSchema = z.object({
    title: z.string(),
    textColor: hexSchema,
    backgroundColor: hexSchema,
})

export interface IEventCard extends ICardStyles {
    uuid: string
    categoryId: string | null
    title: string
}

export const eventCardSchema = z.object({
    uuid: z.string().uuid(),
    categoryId: z.string().uuid(),
    title: z.string(),
    textColor: hexSchema,
    backgroundColor: hexSchema,
})

export interface ICategory extends ICardStyles {
    uuid: string
    name: string
}

export const categorySchema = z.object({
    uuid: z.string().uuid(),
    name: z.string(),
    textColor: hexSchema,
    backgroundColor: hexSchema,
})

export interface ICardStyles {
    textColor: string
    backgroundColor: string
}

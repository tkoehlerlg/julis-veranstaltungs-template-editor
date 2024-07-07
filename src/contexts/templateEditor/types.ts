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

export interface ITitleCard extends ICardStyles {
    title: string
}

export interface IEventCard extends ICardStyles {
    uuid: string
    title: string
}

interface ICardStyles {
    textColor: string
    backgroundColor: string
}

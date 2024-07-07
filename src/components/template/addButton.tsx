import { Plus } from 'lucide-react'

export const AddButton = ({
    onClick,
    paddingTop = 0,
    paddingBottom = 0,
}: {
    onClick?: () => void
    paddingTop?: number
    paddingBottom?: number
}) => (
    <div
        className={
            'relative z-50 -my-1 flex h-0 w-full cursor-pointer flex-row items-center px-5 opacity-0 transition-opacity duration-200  hover:opacity-100'
        }
        style={{ paddingTop, paddingBottom }}
        onClick={(e) => {
            e.stopPropagation()
            onClick?.()
        }}
    >
        <div
            className={
                'box-content h-[1.5px] w-full rounded-l-md border-[0.5px] border-r-0 border-black bg-white'
            }
        />
        <div
            className={
                'flex h-3.5 min-w-3.5 items-center justify-center rounded-md border-[0.5px] border-black bg-white'
            }
        >
            <Plus size={10} strokeWidth={2.5} color={'black'} />
        </div>
        <div
            className={
                'box-content h-[1.5px] w-full rounded-r-md border-[0.5px] border-l-0 border-black bg-white'
            }
        />
    </div>
)

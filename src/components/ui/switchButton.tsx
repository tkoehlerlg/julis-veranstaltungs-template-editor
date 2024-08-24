import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SwitchButtonProps<T extends string> {
    layoutIdExtension?: string
    selected: T
    options: T[]
    onChange?: (selected: T) => void
    className?: string
}

export function SwitchButton<T extends string>({
    layoutIdExtension,
    selected,
    options,
    onChange,
    className,
}: SwitchButtonProps<T>) {
    return (
        <div
            className={cn(
                'flex w-fit flex-row space-x-2 rounded-lg border border-slate-200 bg-white px-1.5 py-1.5',
                className
            )}
            role='group'
            aria-label='Switch Button'
        >
            {options.map((option) => (
                <div
                    key={option}
                    className={'relative select-none px-2.5 py-1'}
                    onClick={() => onChange && onChange(option)}
                >
                    {selected === option && (
                        <motion.div
                            layout
                            layoutId={
                                'switch-button-background' + layoutIdExtension
                                    ? `-${layoutIdExtension}`
                                    : ''
                            }
                            className={
                                'absolute inset-0 h-full w-full rounded bg-[#EEEFF2]'
                            }
                        />
                    )}
                    <p className={'relative z-10 text-sm font-medium'}>
                        {option}
                    </p>
                </div>
            ))}
        </div>
    )
}

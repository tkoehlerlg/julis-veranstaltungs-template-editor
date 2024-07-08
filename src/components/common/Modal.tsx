import { ChildProps, StyleProps } from '@/lib/propTypes'
import { css } from 'styled-components'
import { useTheme } from '@/contexts/themeContext'
import { Flex } from '@/components/common/Flex'
import { motion } from 'framer-motion'

interface ModalProps extends ChildProps, StyleProps {
    onClose?: () => void
}

export function Modal({ onClose, children, styles }: ModalProps) {
    const theme = useTheme()
    return (
        <Flex
            align={'center'}
            justify={'center'}
            motionProps={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            }}
            styles={css`
                z-index: ${theme.zIndex.modal};
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            `}
        >
            <motion.div
                onClick={onClose}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                css={css`
                    z-index: -1;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(3px);
                    background-color: ${theme.palette.whiteOpacity[100]};
                `}
            />
            <div css={styles}>{children}</div>
        </Flex>
    )
}

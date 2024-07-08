import { ICategory } from '@/contexts/templateEditor/types'
import { Flex } from '@/components/common/Flex'
import { CategoryCard } from './categoryCard'
import { css } from 'styled-components'

export const CategoriesContainer = ({
    categories,
}: {
    categories: ICategory[]
}) => (
    <Flex
        dir={'row'}
        align={'center'}
        wrap={'wrap'}
        justify={'center'}
        styles={css`
            margin: 0 50px;
            min-width: 100px;
        `}
    >
        {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
        ))}
    </Flex>
)

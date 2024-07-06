import { RuleSet } from 'styled-components'

declare module 'react' {
    interface Attributes {
        css?: RuleSet<any>
    }
}

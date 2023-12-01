import { Container, DotListVariant } from './styles'

interface DotListProps {
    items: string[]
    variant?: DotListVariant
}

const DotList = ({
    items,
    variant = 'default'
}: DotListProps) => {
    return (
        <Container
            $variant={variant}
        >
            {items.map((x, index) => (
                <li key={index}>{x}</li>
            ))}
        </Container>
    )
}

export default DotList
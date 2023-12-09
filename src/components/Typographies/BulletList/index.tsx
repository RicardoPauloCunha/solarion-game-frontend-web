import { BulletListVariant, Container } from './styles'

interface BulletListProps {
    items: string[]
    variant?: BulletListVariant
}

const BulletList = ({
    items,
    variant = 'default'
}: BulletListProps) => {
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

export default BulletList
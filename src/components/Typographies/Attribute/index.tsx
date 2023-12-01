import { Container } from "./styles"

interface AttributeProps {
    field: string
    value: string
}

const Attribute = ({
    field,
    value
}: AttributeProps) => {
    return (
        <Container>
            <strong>{field}</strong>
            {value}
        </Container>
    )
}

export default Attribute
import { Container } from "./styles"

interface DecisionButtonProps {
    text: string
    onClick?: () => void
}

const DecisionButton = ({
    text,
    onClick
}: DecisionButtonProps) => {
    return (
        <Container
            type="button"
            onClick={onClick}
        >
            <span>{text}</span>
        </Container>
    )
}

export default DecisionButton
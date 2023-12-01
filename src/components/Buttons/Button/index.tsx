import LoadingText from "../../Loading/LoadingText"
import { ButtonVariant, Container } from "./styles"

interface ButtonProps {
    text: string
    type?: 'button' | "submit"
    variant?: ButtonVariant
    isLoading?: boolean
    onClick?: () => void
}

const Button = ({
    text,
    type = 'button',
    variant = 'default',
    isLoading,
    onClick
}: ButtonProps) => {
    return (
        <Container
            type={type}
            onClick={onClick}
            disabled={isLoading}
            $variant={variant}
            $isLoading={isLoading}
            className="click-animation"
        >
            <LoadingText
                defaultText={text}
                isLoading={!!isLoading}
            />
        </Container>
    )
}

export default Button
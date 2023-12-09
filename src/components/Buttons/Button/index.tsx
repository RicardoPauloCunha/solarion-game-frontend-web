import LoadingText from "../../Loadings/LoadingText"
import { ButtonVariant, Container } from "./styles"

interface ButtonProps {
    text: string
    type?: 'button' | "submit"
    variant?: ButtonVariant
    isLoading?: boolean
    disabled?: boolean
    onClick?: () => void
}

const Button = ({
    text,
    type = 'button',
    variant = 'default',
    isLoading,
    disabled,
    onClick
}: ButtonProps) => {
    return (
        <Container
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            $variant={variant}
            $isLoading={isLoading}
            $isDisabled={disabled}
            className="click-animation"
        >
            <LoadingText
                isLoading={!!isLoading}
                defaultText={text}
            />
        </Container>
    )
}

export default Button
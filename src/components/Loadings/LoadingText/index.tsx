import { Spinner } from "react-bootstrap"
import { Container } from "./styles"

interface LoadingTextProps {
    isLoading: boolean
    defaultText?: string
    loadingText?: string
}

const LoadingText = ({
    isLoading,
    defaultText,
    loadingText = 'Carregando...',
}: LoadingTextProps) => {
    return (
        <>
            {(defaultText || isLoading) && <Container>
                {isLoading
                    ? <>
                        {loadingText}
                        <Spinner animation="border" />
                    </>
                    : <>
                        {defaultText}
                    </>
                }
            </Container>}
        </>
    )
}

export default LoadingText
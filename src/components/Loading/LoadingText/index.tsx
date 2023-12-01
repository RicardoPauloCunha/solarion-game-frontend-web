import { Spinner } from "react-bootstrap"
import { Container } from "./styles"

interface LoadingTextProps {
    defaultText?: string
    loadingText?: string
    isLoading: boolean
}

const LoadingText = ({
    defaultText,
    loadingText = 'Carregando...',
    isLoading
}: LoadingTextProps) => {
    return (
        <>
            {(defaultText || isLoading) && <Container>{isLoading
                ? <>
                    {loadingText}
                    <Spinner animation="border" />
                </>
                : <>
                    {defaultText}
                </>
            }</Container>}
        </>
    )
}

export default LoadingText
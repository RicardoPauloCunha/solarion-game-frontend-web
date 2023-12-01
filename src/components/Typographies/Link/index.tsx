import { DefaultRoutePathEnum } from '../../../types/enums/routePath'
import { Container } from './styles'

interface LinkProps {
    to: DefaultRoutePathEnum
    text: string
    onClick?: () => void
}

const Link = ({
    to,
    text,
    onClick
}: LinkProps) => {
    return (
        <Container
            to={to}
            onClick={onClick}
            className="click-animation"
        >
            {text}
        </Container>
    )
}

export default Link

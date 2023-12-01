import { DefaultRoutePathEnum } from '../../../types/enums/routePath'
import { Container } from './styles'

const NavLogo = () => {
    return (
        <Container
            to={DefaultRoutePathEnum.Home}
            className="click-animation"
        >
            SolarionGame
        </Container>
    )
}

export default NavLogo
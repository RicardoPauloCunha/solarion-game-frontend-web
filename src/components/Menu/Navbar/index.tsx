import { useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import { useAuthContext } from "../../../hooks/contexts/auth"
import { removeTokenStorage } from "../../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../../types/enums/routePath"
import { UserTypeEnum } from "../../../types/enums/userType"
import NavLogo from "../../Logos/NavLogo"
import Link from "../../Typographies/Link"
import { Container } from "./styles"

export const Navbar = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const {
        loggedUser,
        setLoggedUser
    } = useAuthContext()

    const handleLogout = () => {
        removeTokenStorage()
        setLoggedUser(undefined)
    }

    const handleToggleMenu = () => {
        setMenuIsOpen(!menuIsOpen)
    }

    return (
        <Container
            className="stylized-margin"
            $menuIsOpen={menuIsOpen}
            role='menubar'
        >
            <NavLogo />

            {menuIsOpen
                ? <FaTimes
                    className="animation-click"
                    onClick={handleToggleMenu}
                />
                : <FaBars
                    className="animation-click"
                    onClick={handleToggleMenu}
                />
            }

            <div>
                {loggedUser
                    ? <>
                        {loggedUser.userType === UserTypeEnum.Admin && <>
                            <Link
                                to={DefaultRoutePathEnum.Dashboard}
                                text="Dashboard"
                            />

                            <Link
                                to={DefaultRoutePathEnum.Scores}
                                text="Pontuações"
                            />
                        </>}

                        {loggedUser.userType === UserTypeEnum.Common && <Link
                            to={DefaultRoutePathEnum.MyScores}
                            text="Minhas pontuações"
                        />}

                        <Link
                            to={DefaultRoutePathEnum.Profile}
                            text="Perfil"
                        />

                        <Link
                            to={DefaultRoutePathEnum.Home}
                            text="Sair"
                            onClick={handleLogout}
                        />
                    </>
                    : <>
                        <Link
                            to={DefaultRoutePathEnum.Login}
                            text="Entrar"
                        />
                    </>
                }
            </div>
        </Container>
    )
}

export default Navbar
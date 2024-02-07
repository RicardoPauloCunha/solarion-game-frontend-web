import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Navbar from "."
import { AuthContext, AuthContextData, LoggedUserData } from "../../../hooks/contexts/auth"
import { DefaultRoutePathEnum } from "../../../types/enums/routePath"
import { UserTypeEnum } from "../../../types/enums/userType"

const mockSetLoggedUser = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateLoggedUser = (userType: UserTypeEnum): LoggedUserData => {
    return {
        userId: 1,
        name: 'Ricardo Paulo',
        userType
    }
}

const renderComponent = (userType: UserTypeEnum, options?: {
    hasNoLoggedUser?: boolean
}) => {
    const loggedUser = generateLoggedUser(userType)

    render(<AuthContext.Provider
        value={{
            loggedUser: options?.hasNoLoggedUser ? undefined : loggedUser,
            setLoggedUser: mockSetLoggedUser
        } as unknown as AuthContextData}
    >
        <Navbar />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    return {
        ...loggedUser
    }
}

// TODO: Test open/close menu in mobile

describe('Navbar Comp', () => {
    it('should render a navbar', () => {
        renderComponent(UserTypeEnum.None, { hasNoLoggedUser: true })

        const navbar = screen.getByRole('menubar')

        expect(navbar).toBeInTheDocument()
    })

    describe('when not logged', () => {
        it.each([
            [DefaultRoutePathEnum.Home, 'SolarionGame'],
            [DefaultRoutePathEnum.Login, 'Entrar'],
        ])('should render a link to %p', async (linkPath, linkName) => {
            renderComponent(UserTypeEnum.None, { hasNoLoggedUser: true })

            const link = screen.getByRole('link', { name: linkName })
            await userEvent.click(link)

            expect(link).toBeInTheDocument()
            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
        })

        it('should only render default links', () => {
            renderComponent(UserTypeEnum.None, { hasNoLoggedUser: true })

            const linksText = screen.getAllByRole('link').map(x => x.textContent)
            const linksTextData = [
                'SolarionGame',
                'Entrar'
            ]

            expect(linksText).toEqual(linksTextData)
        })
    })

    describe('when logged', () => {
        it('should not render login link', async () => {
            renderComponent(UserTypeEnum.None)

            const loginLink = screen.queryByRole('link', { name: 'Entrar' })

            expect(loginLink).toBeNull()
        })

        it.each([
            [DefaultRoutePathEnum.Profile, 'Perfil'],
            [DefaultRoutePathEnum.Home, 'Sair'],
        ])('should render a link to %p', async (linkPath, linkName) => {
            renderComponent(UserTypeEnum.None)

            const link = screen.getByRole('link', { name: linkName })
            await userEvent.click(link)

            expect(link).toBeInTheDocument()
            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
        })

        it('should only render logged links', () => {
            renderComponent(UserTypeEnum.None)

            const linksText = screen.getAllByRole('link').map(x => x.textContent)
            const linksTextData = [
                'SolarionGame',
                'Perfil',
                'Sair',
            ]

            expect(linksText).toEqual(linksTextData)
        })

        describe('and when is admin', () => {
            it.each([
                [DefaultRoutePathEnum.Dashboard, 'Dashboard'],
                [DefaultRoutePathEnum.Scores, 'Pontuações'],
            ])('should also render a link to %p', async (linkPath, linkName) => {
                renderComponent(UserTypeEnum.Admin)

                const link = screen.getByRole('link', { name: linkName })
                await userEvent.click(link)

                expect(link).toBeInTheDocument()
                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
            })

            it('should only render admin links', () => {
                renderComponent(UserTypeEnum.Admin)

                const linksText = screen.getAllByRole('link').map(x => x.textContent)
                const linksTextData = [
                    'SolarionGame',
                    'Dashboard',
                    'Pontuações',
                    'Perfil',
                    'Sair',
                ]

                expect(linksText).toEqual(linksTextData)
            })
        })

        describe('and when is common', () => {
            it.each([
                [DefaultRoutePathEnum.MyScores, 'Minhas pontuações'],
            ])('should also render a link to %p', async (linkPath, linkName) => {
                renderComponent(UserTypeEnum.Common)

                const link = screen.getByRole('link', { name: linkName })
                await userEvent.click(link)

                expect(link).toBeInTheDocument()
                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
            })

            it('should only render common links', () => {
                renderComponent(UserTypeEnum.Common)

                const linksText = screen.getAllByRole('link').map(x => x.textContent)
                const linksTextData = [
                    'SolarionGame',
                    'Minhas pontuações',
                    'Perfil',
                    'Sair',
                ]

                expect(linksText).toEqual(linksTextData)
            })
        })
    })
})
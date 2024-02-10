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
        name: 'User name',
        userType
    }
}

const NONE_USER = generateLoggedUser(UserTypeEnum.None)
const ADMIN_USER = generateLoggedUser(UserTypeEnum.Admin)
const COMMON_USER = generateLoggedUser(UserTypeEnum.Common)

const renderComponent = (options?: {
    loggedUser?: LoggedUserData
}) => {
    render(<AuthContext.Provider
        value={{
            loggedUser: options?.loggedUser,
            setLoggedUser: mockSetLoggedUser
        } as unknown as AuthContextData}
    >
        <Navbar />
    </AuthContext.Provider>, { wrapper: BrowserRouter })
}

// TODO: Test open/close menu in mobile

describe('Navbar Comp', () => {
    it('should render a navbar', () => {
        renderComponent()

        const navbar = screen.getByRole('menubar')

        expect(navbar).toBeInTheDocument()
    })

    describe('when not logged', () => {
        it.each([
            [DefaultRoutePathEnum.Home, 'SolarionGame'],
            [DefaultRoutePathEnum.Login, 'Entrar'],
        ])('should render a link to %p', async (linkPath, linkName) => {
            renderComponent()

            const link = screen.getByRole('link', { name: linkName })
            await userEvent.click(link)

            expect(link).toBeInTheDocument()
            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
        })

        it('should only render default links', () => {
            const texts = [
                'SolarionGame',
                'Entrar'
            ]

            renderComponent()

            const linkTexts = screen.getAllByRole('link').map(x => x.textContent)

            expect(linkTexts).toEqual(texts)
        })
    })

    describe('when logged', () => {
        it('should not render login link', async () => {
            renderComponent({
                loggedUser: NONE_USER
            })

            const loginLink = screen.queryByRole('link', { name: 'Entrar' })

            expect(loginLink).toBeNull()
        })

        it.each([
            [DefaultRoutePathEnum.Profile, 'Perfil'],
            [DefaultRoutePathEnum.Home, 'Sair'],
        ])('should render a link to %p', async (linkPath, linkName) => {
            renderComponent({
                loggedUser: NONE_USER
            })

            const link = screen.getByRole('link', { name: linkName })
            await userEvent.click(link)

            expect(link).toBeInTheDocument()
            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
        })

        it('should only render logged links', () => {
            const texts = [
                'SolarionGame',
                'Perfil',
                'Sair',
            ]

            renderComponent({
                loggedUser: NONE_USER
            })

            const linkTexts = screen.getAllByRole('link').map(x => x.textContent)

            expect(linkTexts).toEqual(texts)
        })

        describe('and when is admin', () => {
            it.each([
                [DefaultRoutePathEnum.Dashboard, 'Dashboard'],
                [DefaultRoutePathEnum.Scores, 'Pontuações'],
            ])('should also render a link to %p', async (linkPath, linkName) => {
                renderComponent({
                    loggedUser: ADMIN_USER
                })

                const link = screen.getByRole('link', { name: linkName })
                await userEvent.click(link)

                expect(link).toBeInTheDocument()
                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
            })

            it('should only render admin links', () => {
                const texts = [
                    'SolarionGame',
                    'Dashboard',
                    'Pontuações',
                    'Perfil',
                    'Sair',
                ]

                renderComponent({
                    loggedUser: ADMIN_USER
                })

                const linkTexts = screen.getAllByRole('link').map(x => x.textContent)

                expect(linkTexts).toEqual(texts)
            })
        })

        describe('and when is common', () => {
            it.each([
                [DefaultRoutePathEnum.MyScores, 'Minhas pontuações'],
            ])('should also render a link to %p', async (linkPath, linkName) => {
                renderComponent({
                    loggedUser: COMMON_USER
                })

                const link = screen.getByRole('link', { name: linkName })
                await userEvent.click(link)

                expect(link).toBeInTheDocument()
                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
            })

            it('should only render common links', () => {
                const texts = [
                    'SolarionGame',
                    'Minhas pontuações',
                    'Perfil',
                    'Sair',
                ]

                renderComponent({
                    loggedUser: COMMON_USER
                })

                const linkTexts = screen.getAllByRole('link').map(x => x.textContent)

                expect(linkTexts).toEqual(texts)
            })
        })
    })
})
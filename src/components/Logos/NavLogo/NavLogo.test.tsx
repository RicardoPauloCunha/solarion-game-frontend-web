import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import NavLogo from "."
import { DefaultRoutePathEnum } from "../../../types/enums/routePath"

const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const renderComponent = () => {
    render(<NavLogo />, { wrapper: BrowserRouter })
}

describe('NavLogo Comp', () => {
    it('should render logo name', () => {
        renderComponent()

        const homeLink = screen.getByText('SolarionGame')

        expect(homeLink).toBeInTheDocument()
    })

    it('should navigate to home', async () => {
        renderComponent()

        const homeLink = screen.getByText('SolarionGame')
        await userEvent.click(homeLink)

        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Home, expect.anything())
    })
})
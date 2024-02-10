import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Link from "."
import { DefaultRoutePathEnum } from "../../../types/enums/routePath"

const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const PATH = DefaultRoutePathEnum.Login
const TEXT = "Página de login"
const mockOnClick = jest.fn()

const renderComponent = (options?: {
    hasOnClick?: boolean
}) => {
    render(<Link
        to={PATH}
        text={TEXT}
        onClick={options?.hasOnClick ? mockOnClick : undefined}
    />, { wrapper: BrowserRouter })
}

describe('Link Comp', () => {
    it('should render a link', () => {
        renderComponent()

        const link = screen.getByRole('link', { name: TEXT })

        expect(link).toBeInTheDocument()
    })

    it('should call navigate function to the path', async () => {
        renderComponent()

        const link = screen.getByRole('link', { name: TEXT })
        await userEvent.click(link)

        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith(PATH, expect.anything())
    })

    describe('when have OnClick function', () => {
        describe('and when clicked', () => {
            it('should call onClick function', async () => {
                renderComponent({
                    hasOnClick: true
                })

                const link = screen.getByRole('link', { name: TEXT })
                await userEvent.click(link)

                expect(mockOnClick).toHaveBeenCalledTimes(1)
            })
        })
    })
})
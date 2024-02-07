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

const renderComponent = (options?: {
    hasOnClick?: boolean
}) => {
    const path = DefaultRoutePathEnum.Login
    const text = "Página de login"
    const onClick = jest.fn()

    render(<Link
        to={path}
        text={text}
        onClick={options?.hasOnClick ? onClick : undefined}
    />, { wrapper: BrowserRouter })

    return {
        path,
        text,
        onClick
    }
}

describe('Link Comp', () => {
    it('should render a link', () => {
        const props = renderComponent()

        const link = screen.getByRole('link', { name: props.text })

        expect(link).toBeInTheDocument()
    })

    it('should call navigate function to the path', async () => {
        const props = renderComponent()

        const link = screen.getByRole('link', { name: props.text })
        await userEvent.click(link)

        expect(mockNavigate).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith(props.path, expect.anything())
    })

    describe('when have OnClick function', () => {
        describe('and when clicked', () => {
            it('should call onClick function', async () => {
                const props = renderComponent({
                    hasOnClick: true
                })

                const link = screen.getByRole('link', { name: props.text })
                await userEvent.click(link)

                expect(props.onClick).toHaveBeenCalledTimes(1)
            })
        })
    })
})
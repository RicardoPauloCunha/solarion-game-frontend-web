import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ToggleIcon from "."

const renderComponent = (isOpen: boolean) => {
    const onToggle = jest.fn()

    render(<ToggleIcon
        isOpen={isOpen}
        onToggle={onToggle}
    />)

    return {
        isOpen,
        onToggle
    }
}

describe('ToggleIcon Comp', () => {
    it('should render a closed toggle', () => {
        renderComponent(false)

        const toggle = screen.getByText('Mostrar')

        expect(toggle).toBeInTheDocument()
    })

    it('should render an open toggle', () => {
        renderComponent(true)

        const toggle = screen.getByText('Esconder')

        expect(toggle).toBeInTheDocument()
    })

    describe('when clicked', () => {
        it('should call onToggle function', async () => {
            const props = renderComponent(false)

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            expect(props.onToggle).toHaveBeenCalledTimes(1)
        })
    })
})
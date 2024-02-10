import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ToggleIcon from "."

const mockOnToggle = jest.fn()

const renderComponent = (options?: {
    isOpen?: boolean
}) => {
    render(<ToggleIcon
        isOpen={!!options?.isOpen}
        onToggle={mockOnToggle}
    />)
}

describe('ToggleIcon Comp', () => {
    it('should render a closed toggle', () => {
        renderComponent()

        const toggle = screen.getByText('Mostrar')

        expect(toggle).toBeInTheDocument()
    })

    it('should render an open toggle', () => {
        renderComponent({
            isOpen: true
        })

        const toggle = screen.getByText('Esconder')

        expect(toggle).toBeInTheDocument()
    })

    describe('when clicked', () => {
        it('should call onToggle function', async () => {
            renderComponent()

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            expect(mockOnToggle).toHaveBeenCalledTimes(1)
        })
    })
})
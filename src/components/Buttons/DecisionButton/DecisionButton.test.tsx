import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DecisionButton from "."

const BUTTON_TEXT = 'Button text'
const mockOnClick = jest.fn()

const renderComponent = (options?: {
    hasOnClick?: boolean
}) => {
    render(<DecisionButton
        text={BUTTON_TEXT}
        onClick={options?.hasOnClick ? mockOnClick : undefined}
    />)
}

describe('DecisionButton Comp', () => {
    it('should render an enabled button', () => {
        renderComponent()

        const button = screen.getByRole('button', { name: BUTTON_TEXT })

        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
    })

    describe('when clicked', () => {
        it('should call onClick function', async () => {
            renderComponent({
                hasOnClick: true
            })

            const button = screen.getByRole('button', { name: BUTTON_TEXT })
            await userEvent.click(button)

            expect(mockOnClick).toHaveBeenCalledTimes(1)
        })
    })
})
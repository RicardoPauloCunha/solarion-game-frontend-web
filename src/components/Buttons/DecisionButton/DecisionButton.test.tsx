import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DecisionButton from "."

const renderComponent = (options?: {
    hasOnClick?: boolean
}) => {
    const text = 'Click here!'
    const onClick = jest.fn()

    render(<DecisionButton
        text={text}
        onClick={options?.hasOnClick ? onClick : undefined}
    />)

    return {
        text,
        onClick
    }
}

describe('DecisionButton Comp', () => {
    it('should render a clickable button', () => {
        const props = renderComponent()

        const button = screen.getByRole('button', { name: props.text })

        expect(button).toBeEnabled()
    })

    describe('when clicked', () => {
        it('should call onClick function', async () => {
            const props = renderComponent({ hasOnClick: true })

            const button = screen.getByRole('button', { name: props.text })
            await userEvent.click(button)

            expect(props.onClick).toHaveBeenCalledTimes(1)
        })
    })
})
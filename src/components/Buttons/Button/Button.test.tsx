import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Button from "."

const renderComponent = (options?: {
    hasOnClick?: boolean,
    isDisabled?: boolean,
    isLoading?: boolean
}) => {
    const text = 'Click here!'
    const onClick = jest.fn()

    render(<Button
        text={text}
        onClick={options?.hasOnClick ? onClick : undefined}
        disabled={options?.isDisabled}
        isLoading={options?.isLoading}
    />)

    return {
        text,
        onClick,
    }
}

describe('Button Comp', () => {
    it('should render an enabled button', () => {
        const props = renderComponent()

        const button = screen.getByRole('button', { name: props.text })

        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
    })

    describe('when clicked', () => {
        it('should call onClick function', async () => {
            const props = renderComponent({
                hasOnClick: true
            })

            const button = screen.getByRole('button', { name: props.text })
            await userEvent.click(button)

            expect(props.onClick).toHaveBeenCalledTimes(1)
        })
    })

    describe('when disabled', () => {
        it('should have gray style', () => {
            const props = renderComponent({
                isDisabled: true
            })

            const button = screen.getByRole('button', { name: props.text })

            expect(button).toHaveStyle({ backgroundColor: 'var(--color-light-gray)' })
        })

        describe('and when clicked', () => {
            it('should not call onClick function', async () => {
                const props = renderComponent({
                    isDisabled: true,
                    hasOnClick: true
                })

                const button = screen.getByRole('button', { name: props.text })
                await userEvent.click(button)

                expect(props.onClick).not.toHaveBeenCalled()
            })
        })
    })

    describe('when loading', () => {
        it('should decrease opacity', () => {
            renderComponent({
                isLoading: true
            })

            const button = screen.getByRole('button')

            expect(button).toHaveStyle({ opacity: 0.75 })
        })

        it('should be disabled', () => {
            renderComponent({
                isLoading: true
            })

            const button = screen.getByRole('button')

            expect(button).toBeDisabled()
        })

        it('should show a loading message', () => {
            const props = renderComponent({
                isLoading: true
            })

            const buttonText = screen.queryByText(props.text)
            const loadingMessage = screen.getByText('Carregando...')

            expect(buttonText).toBeNull()
            expect(loadingMessage).toBeInTheDocument()
        })
    })
})
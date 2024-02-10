import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Button from "."

const BUTTON_TEXT = 'Button text'
const mockOnClick = jest.fn()

const renderComponent = (options?: {
    hasOnClick?: boolean,
    isDisabled?: boolean,
    isLoading?: boolean
}) => {
    render(<Button
        text={BUTTON_TEXT}
        onClick={options?.hasOnClick ? mockOnClick : undefined}
        disabled={options?.isDisabled}
        isLoading={options?.isLoading}
    />)
}

describe('Button Comp', () => {
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

    describe('when disabled', () => {
        it('should have gray style', () => {
            renderComponent({
                isDisabled: true
            })

            const button = screen.getByRole('button', { name: BUTTON_TEXT })

            expect(button).toHaveStyle({ backgroundColor: 'var(--color-light-gray)' })
        })

        describe('and when clicked', () => {
            it('should not call onClick function', async () => {
                renderComponent({
                    isDisabled: true,
                    hasOnClick: true
                })

                const button = screen.getByRole('button', { name: BUTTON_TEXT })
                await userEvent.click(button)

                expect(mockOnClick).not.toHaveBeenCalled()
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
            renderComponent({
                isLoading: true
            })

            const buttonText = screen.queryByText(BUTTON_TEXT)
            const loadingMessage = screen.getByText('Carregando...')

            expect(buttonText).toBeNull()
            expect(loadingMessage).toBeInTheDocument()
        })
    })
})
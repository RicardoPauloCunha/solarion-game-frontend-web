import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Textarea from "."

const NAME = 'testTextarea'
const LABEL = 'Textarea label'
const PLACEHOLDER = 'Textarea placeholder'
const VALUE = 'Textarea value'
const mockOnChangeValue = jest.fn()

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    render(<Form
        onSubmit={() => { }}
    >
        <Textarea
            name={NAME}
            label={LABEL}
            placeholder={PLACEHOLDER}
            onChangeValue={options?.hasOnChangeValue ? mockOnChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)
}

describe('Textarea Comp', () => {
    it('should render a textarea', () => {
        renderComponent()

        const label = screen.getByText(LABEL)
        const input = screen.getByPlaceholderText(PLACEHOLDER)

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
    })

    describe('when click on label', () => {
        it('should focus on textarea', async () => {
            renderComponent()

            const label = screen.getByText(LABEL)
            await userEvent.click(label)

            const input = screen.getByPlaceholderText(PLACEHOLDER)

            expect(input).toHaveFocus()
        })
    })

    describe('when type a text', () => {
        it('should change the value of the textarea', async () => {
            renderComponent()

            const input = screen.getByPlaceholderText(PLACEHOLDER)
            await userEvent.type(input, VALUE)

            const inputWithValue = screen.getByDisplayValue(VALUE)

            expect(inputWithValue).toBeInTheDocument()
        })

        it('should call onChangeValue function', async () => {
            renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByPlaceholderText(PLACEHOLDER)
            await userEvent.type(input, VALUE)

            expect(mockOnChangeValue).toHaveBeenCalledTimes(VALUE.length)
            expect(mockOnChangeValue).toHaveBeenLastCalledWith(VALUE)
        })
    })

    describe('when disabled', () => {
        describe('and when type a text', () => {
            it('should not change the value of the textarea', async () => {
                renderComponent({
                    isDisabled: true
                })

                const input = screen.getByPlaceholderText(PLACEHOLDER)
                await userEvent.type(input, VALUE)

                const inputWithValue = screen.queryByDisplayValue(VALUE)

                expect(inputWithValue).toBeNull()
            })

            it('should not call onChangeValue function', async () => {
                renderComponent({
                    hasOnChangeValue: true,
                    isDisabled: true
                })

                const input = screen.getByPlaceholderText(PLACEHOLDER)
                await userEvent.type(input, VALUE)

                expect(mockOnChangeValue).not.toHaveBeenCalled()
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Input from "."

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    const name = 'username'
    const label = 'Nome do usuário'
    const placeholder = 'Coloque o seu nome'
    const onChangeValue = jest.fn()

    render(<Form
        onSubmit={() => { }}
    >
        <Input
            name={name}
            label={label}
            placeholder={placeholder}
            onChangeValue={options?.hasOnChangeValue ? onChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)

    return {
        name,
        label,
        placeholder,
        onChangeValue
    }
}

describe('Input Comp', () => {
    it('should render a input', () => {
        const props = renderComponent()

        const label = screen.getByText(props.label)
        const input = screen.getByPlaceholderText(props.placeholder)

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
    })

    describe('when click on label', () => {
        it('should focus on input', async () => {
            const props = renderComponent()

            const label = screen.getByText(props.label)
            await userEvent.click(label)

            const input = screen.getByPlaceholderText(props.placeholder)

            expect(input).toHaveFocus()
        })
    })

    describe('when type a text', () => {
        it('should change the value of the input', async () => {
            const props = renderComponent()
            const text = 'Ricardo Paulo'

            const input = screen.getByPlaceholderText(props.placeholder)
            await userEvent.type(input, text)

            const inputWithValue = screen.getByDisplayValue(text)

            expect(inputWithValue).toBeInTheDocument()
        })

        it('should call the onChange function', async () => {
            const props = renderComponent({ hasOnChangeValue: true })
            const text = 'Ricardo Paulo'

            const input = screen.getByPlaceholderText(props.placeholder)
            await userEvent.type(input, text)

            expect(props.onChangeValue).toHaveBeenCalledTimes(text.length)
            expect(props.onChangeValue).toHaveBeenLastCalledWith(text)
        })
    })

    describe('when disabled', () => {
        describe('and when type a text', () => {
            it('should not change the value of the input', async () => {
                const props = renderComponent({ isDisabled: true })
                const text = 'Ricardo Paulo'

                const input = screen.getByPlaceholderText(props.placeholder)
                await userEvent.type(input, text)

                const inputWithValue = screen.queryByDisplayValue(text)

                expect(inputWithValue).toBeNull()
            })

            it('should not call the onChange function', async () => {
                const props = renderComponent({ hasOnChangeValue: true, isDisabled: true })
                const text = 'Ricardo Paulo'

                const input = screen.getByPlaceholderText(props.placeholder)
                await userEvent.type(input, text)

                expect(props.onChangeValue).not.toHaveBeenCalled()
            })
        })
    })
})
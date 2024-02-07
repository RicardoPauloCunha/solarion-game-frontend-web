import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Textarea from "."

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    const name = 'description'
    const label = 'Descrição'
    const placeholder = 'Coloque a descrição da tarefa'
    const onChangeValue = jest.fn()

    render(<Form
        onSubmit={() => { }}
    >
        <Textarea
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

describe('Textarea Comp', () => {
    it('should render a textarea', () => {
        const props = renderComponent()

        const label = screen.getByText(props.label)
        const input = screen.getByPlaceholderText(props.placeholder)

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
    })

    describe('when click on label', () => {
        it('should focus on textarea', async () => {
            const props = renderComponent()

            const label = screen.getByText(props.label)
            await userEvent.click(label)

            const input = screen.getByPlaceholderText(props.placeholder)

            expect(input).toHaveFocus()
        })
    })

    describe('when type a text', () => {
        it('should change the value of the textarea', async () => {
            const props = renderComponent()
            const text = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos'

            const input = screen.getByPlaceholderText(props.placeholder)
            await userEvent.type(input, text)

            const inputWithValue = screen.getByDisplayValue(text)

            expect(inputWithValue).toBeInTheDocument()
        })

        it('should call onChangeValue function', async () => {
            const props = renderComponent({
                hasOnChangeValue: true
            })
            const text = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos'

            const input = screen.getByPlaceholderText(props.placeholder)
            await userEvent.type(input, text)

            expect(props.onChangeValue).toHaveBeenCalledTimes(text.length)
            expect(props.onChangeValue).toHaveBeenLastCalledWith(text)
        })
    })

    describe('when disabled', () => {
        describe('and when type a text', () => {
            it('should not change the value of the textarea', async () => {
                const props = renderComponent({
                    isDisabled: true
                })
                const text = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos'

                const input = screen.getByPlaceholderText(props.placeholder)
                await userEvent.type(input, text)

                const inputWithValue = screen.queryByDisplayValue(text)

                expect(inputWithValue).toBeNull()
            })

            it('should not call onChangeValue function', async () => {
                const props = renderComponent({
                    hasOnChangeValue: true,
                    isDisabled: true
                })
                const text = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos'

                const input = screen.getByPlaceholderText(props.placeholder)
                await userEvent.type(input, text)

                expect(props.onChangeValue).not.toHaveBeenCalled()
            })
        })
    })
})
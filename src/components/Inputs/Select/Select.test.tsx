import { render, screen } from "@testing-library/react"
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event"
import { Form } from "@unform/web"
import Select from "."
import { OptionData } from "../Checkbox"

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    const name = 'options'
    const label = 'Opções'
    const placeholder = 'Selecione uma opção'
    const selectOptions: OptionData[] = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
    ]
    const onChangeValue = jest.fn()

    render(<Form
        onSubmit={() => { }}
    >
        <Select
            name={name}
            label={label}
            placeholder={placeholder}
            options={selectOptions}
            onChangeValue={options?.hasOnChangeValue ? onChangeValue : undefined}
            isDisabled={options?.isDisabled}
        />
    </Form>)

    return {
        name,
        label,
        placeholder,
        options: selectOptions,
        onChangeValue
    }
}

describe('Select Comp', () => {
    it('should render a fake input', () => {
        const props = renderComponent()

        const label = screen.getByText(props.label)
        const input = screen.getByText(props.placeholder)
        const options = screen.queryAllByRole('option')

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
        expect(options).toHaveLength(0)
    })

    describe('when click on label', () => {
        it('should focus in the fake input', async () => {
            const props = renderComponent()

            const label = screen.getByText(props.label)
            await userEvent.click(label)

            const input = screen.getByRole('combobox')

            expect(input).toHaveFocus()
        })
    })

    describe('when clicked', () => {
        it('should show the options', async () => {
            const props = renderComponent()

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const optionsText = screen.getAllByRole('option').map(x => x.textContent)
            const optionsTextData = props.options.map(x => x.label)

            expect(optionsText).toEqual(optionsTextData)
        })

        describe('and when click out', () => {
            it('should hide the options', async () => {
                const props = renderComponent()

                const input = screen.getByRole('combobox')
                await userEvent.click(input)

                const label = screen.getByText(props.label)
                await userEvent.click(label)

                const options = screen.queryAllByRole('option')

                expect(options).toHaveLength(0)
            })
        })
    })

    describe('when type a text', () => {
        it('should change the value of the fake input', async () => {
            const props = renderComponent()
            const option = props.options[0]

            const input = screen.getByRole('combobox')
            await userEvent.type(input, option.label)

            const inputWithValue = screen.getByDisplayValue(option.label)

            expect(inputWithValue).toBeInTheDocument()
        })

        it('should filter the options', async () => {
            const props = renderComponent()
            const option = props.options[0]

            const input = screen.getByRole('combobox')
            await userEvent.type(input, option.label)

            const optionsText = screen.getAllByRole('option').map(x => x.textContent)
            const optionsTextData = [option.label]

            expect(optionsText).toHaveLength(1)
            expect(optionsText).toEqual(optionsTextData)
        })

        it('should not call onChangeValue function', async () => {
            const props = renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByRole('combobox')
            await userEvent.type(input, props.options[0].label)

            expect(props.onChangeValue).not.toHaveBeenCalled()
        })
    })

    describe('when select an option', () => {
        it('should change the value of the fake input', async () => {
            const props = renderComponent()
            const option = props.options[0]

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const selectedOption = screen.getByRole('option', { name: option.label })
            await userEvent.click(selectedOption)

            const inputWithValue = screen.getByText(option.label)
            const options = screen.queryAllByRole('option')

            expect(inputWithValue).toBeInTheDocument()
            expect(options).toHaveLength(0)
        })

        it('should call onChangeValue function with the option value', async () => {
            const props = renderComponent({
                hasOnChangeValue: true
            })
            const option = props.options[0]

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const selectedOption = screen.getByText(option.label)
            await userEvent.click(selectedOption)

            expect(props.onChangeValue).toHaveBeenCalledTimes(1)
            expect(props.onChangeValue).toHaveBeenCalledWith(option.value)
        })
    })

    describe('when disabled', () => {
        describe('and when type a text', () => {
            it('should not change the value of the fake input', async () => {
                const props = renderComponent({
                    isDisabled: true
                })
                const option = props.options[0]

                const input = screen.getByLabelText(props.label)
                await userEvent.type(input, option.label)

                const inputWithValue = screen.queryByDisplayValue(option.label)

                expect(inputWithValue).toBeNull()
            })
        })

        describe('and when clicked', () => {
            it('should not show the options', async () => {
                const props = renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(props.label)
                await userEvent.click(input, { pointerEventsCheck: PointerEventsCheckLevel.Never })

                const options = screen.queryAllByRole('option')

                expect(options).toHaveLength(0)
            })
        })
    })
})
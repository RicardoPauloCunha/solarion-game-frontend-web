import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Radio from "."
import { OptionData } from "../Checkbox"

const renderComponent = (options?: {
    hasFirstOptionChecked?: boolean,
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
    hasFirstOptionDisabled?: boolean
}) => {
    const name = 'options'
    const label = 'Opções'
    const radioOptions: OptionData[] = [
        { label: 'Option 1', value: '1', disabled: options?.hasFirstOptionDisabled },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
    ]
    const onChangeValue = jest.fn()
    const initialData = radioOptions[0].value

    render(<Form
        onSubmit={() => { }}
        initialData={{
            [name]: options?.hasFirstOptionChecked ? initialData : undefined
        }}
    >
        <Radio
            name={name}
            label={label}
            options={radioOptions}
            onChangeValue={options?.hasOnChangeValue ? onChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)

    return {
        name,
        label,
        options: radioOptions,
        initialData,
        onChangeValue
    }
}

describe('Radio Comp', () => {
    it('should render a list of unchecked radios', () => {
        const props = renderComponent()

        const label = screen.getByText(props.label)
        const radios = screen.getAllByRole('radio')
        const radiosId = radios.map(x => x.id)
        const radiosIdData = props.options.map(x => `${props.name}-${x.value}`)

        expect(label).toBeInTheDocument()
        expect(radiosId).toEqual(radiosIdData)

        radios.forEach(x => {
            expect(x).not.toBeChecked()
        })
    })

    it('should render with one option checked', () => {
        const props = renderComponent({
            hasFirstOptionChecked: true
        })

        const input = screen.getByLabelText(props.options[0].label)
        const radios = screen.getAllByRole('radio').filter(x => x.id !== input.id)

        expect(input).toBeChecked()

        radios.forEach(x => {
            expect(x).not.toBeChecked()
        })
    })

    describe('when clicked', () => {
        it('should check the option', async () => {
            const props = renderComponent()

            const input = screen.getByLabelText(props.options[0].label)
            await userEvent.click(input)

            expect(input).toBeChecked()
        })

        it('should call onChangeValue function with the option value', async () => {
            const props = renderComponent({
                hasOnChangeValue: true
            })
            const option = props.options[0]

            const input = screen.getByLabelText(option.label)
            await userEvent.click(input)

            expect(props.onChangeValue).toHaveBeenCalledTimes(1)
            expect(props.onChangeValue).toHaveBeenCalledWith(option.value)
        })

        describe('and when clicked again', () => {
            it('should not uncheck the option', async () => {
                const props = renderComponent()

                const input = screen.getByLabelText(props.options[0].label)
                await userEvent.click(input)

                expect(input).toBeChecked()

                await userEvent.click(input)

                expect(input).toBeChecked()
            })
        })

        describe('and when clicked on another option', () => {
            it('should only remain checked the another option', async () => {
                const props = renderComponent()

                const input = screen.getByLabelText(props.options[0].label)
                await userEvent.click(input)

                const anotherInput = screen.getByLabelText(props.options[1].label)
                await userEvent.click(anotherInput)

                expect(input).not.toBeChecked()
                expect(anotherInput).toBeChecked()
            })
        })
    })

    describe('when disabled', () => {
        it('should disable all options', () => {
            renderComponent({
                isDisabled: true
            })

            const radios = screen.getAllByRole('radio')

            radios.forEach(x => {
                expect(x).toBeDisabled()
            })
        })

        it('should not call onChangeValue function', async () => {
            const props = renderComponent({
                hasOnChangeValue: true,
                isDisabled: true
            })

            const input = screen.getByLabelText(props.options[0].label)
            await userEvent.click(input)

            expect(props.onChangeValue).not.toHaveBeenCalled()
        })

        describe('and when clicked', () => {
            it('should not check the option', async () => {
                const props = renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(props.options[0].label)
                await userEvent.click(input)

                expect(input).not.toBeChecked()
            })
        })
    })

    describe('when one option is disabled', () => {
        it('should only disable that option', () => {
            const props = renderComponent({
                hasFirstOptionDisabled: true
            })

            const input = screen.getByLabelText(props.options[0].label)
            const radios = screen.getAllByRole('radio').filter(x => x.id !== input.id)

            expect(input).toBeDisabled()

            radios.forEach(x => {
                expect(x).toBeEnabled()
            })
        })

        describe('and when clicked', () => {
            it('should not check that option', async () => {
                const props = renderComponent({
                    hasFirstOptionDisabled: true
                })

                const input = screen.getByLabelText(props.options[0].label)
                await userEvent.click(input)

                expect(input).not.toBeChecked()
            })

            it('should be able to check another option', async () => {
                const props = renderComponent({
                    hasFirstOptionDisabled: true
                })

                const input = screen.getByLabelText(props.options[1].label)
                await userEvent.click(input)

                expect(input).toBeChecked()
            })
        })
    })
})
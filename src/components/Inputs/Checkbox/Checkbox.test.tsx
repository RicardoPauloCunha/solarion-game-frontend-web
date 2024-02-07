import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Checkbox, { OptionData } from "."

const renderComponent = (options?: {
    hasFirstOptionChecked?: boolean,
    hasOptionListChecked?: boolean,
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
    hasFirstOptionDisabled?: boolean
}) => {
    const name = 'options'
    const label = 'Opções'
    const checkboxOptions: OptionData[] = [
        { label: 'Option 1', value: '1', disabled: options?.hasFirstOptionDisabled },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
    ]
    const onChangeValue = jest.fn()
    let initialData: string[] = []

    if (options?.hasFirstOptionChecked)
        initialData = [checkboxOptions[0].value]
    else if (options?.hasOptionListChecked)
        initialData = checkboxOptions.map(x => x.value)

    render(<Form
        onSubmit={() => { }}
        initialData={{
            [name]: options?.hasFirstOptionChecked || options?.hasOptionListChecked ? initialData : undefined
        }}
    >
        <Checkbox
            name={name}
            label={label}
            options={checkboxOptions}
            onChangeValue={options?.hasOnChangeValue ? onChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)

    return {
        name,
        label,
        options: checkboxOptions,
        initialData,
        onChangeValue
    }
}

describe('Checkbox Comp', () => {
    it('should render a list of unchecked checkboxes', () => {
        const props = renderComponent()

        const label = screen.getByText(props.label)
        const checkboxes = screen.getAllByRole('checkbox')
        const checkboxesId = checkboxes.map(x => x.id)
        const checkboxesIdData = props.options.map(x => `${props.name}-${x.value}`)

        expect(label).toBeInTheDocument()
        expect(checkboxesId).toEqual(checkboxesIdData)

        checkboxes.forEach(x => {
            expect(x).not.toBeChecked()
        })
    })

    it('should render with one option checked', () => {
        const props = renderComponent({
            hasFirstOptionChecked: true
        })

        const checkboxes = screen.getAllByRole('checkbox')

        checkboxes.forEach(x => {
            if (props.initialData.some(y => `${props.name}-${y}` === x.id))
                expect(x).toBeChecked()
            else
                expect(x).not.toBeChecked()
        })
    })

    it('should render a list of checked checkboxes', () => {
        renderComponent({
            hasOptionListChecked: true
        })

        const checkboxes = screen.getAllByRole('checkbox')

        checkboxes.forEach(x => {
            expect(x).toBeChecked()
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
            it('should uncheck the option', async () => {
                const props = renderComponent()

                const input = screen.getByLabelText(props.options[0].label)
                await userEvent.click(input)

                expect(input).toBeChecked()

                await userEvent.click(input)

                expect(input).not.toBeChecked()
            })
        })
    })

    describe('when disabled', () => {
        it('should disable all options', () => {
            renderComponent({
                isDisabled: true
            })

            const checkboxes = screen.getAllByRole('checkbox')

            checkboxes.forEach(x => {
                expect(x).toBeDisabled()
            })
        })

        it('should not call onChangeValue function', async () => {
            const props = renderComponent({
                isDisabled: true,
                hasOnChangeValue: true
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
            const checkboxes = screen.getAllByRole('checkbox').filter(x => x.id !== input.id)

            expect(input).toBeDisabled()

            checkboxes.forEach(x => {
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
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import Radio from "."
import { OptionData } from "../Checkbox"

const NAME = 'testRadio'
const LABEL = 'Radios label'
const OPTIONS: OptionData[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
]
const FIRST_OPTION = OPTIONS[0]
const mockOnChangeValue = jest.fn()

const generateFirstOptionDisabled = () => {
    const options = OPTIONS.map(x => ({
        ...x,
        disabled: x.value === FIRST_OPTION.value
    }))
    const firstOption = options[0]

    return {
        options,
        firstOption
    }
}

const renderComponent = (options?: {
    initialData?: string,
    options?: OptionData[],
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    render(<Form
        onSubmit={() => { }}
        initialData={{
            [NAME]: options?.initialData
        }}
    >
        <Radio
            name={NAME}
            label={LABEL}
            options={options?.options ? options.options : OPTIONS}
            onChangeValue={options?.hasOnChangeValue ? mockOnChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)
}

describe('Radio Comp', () => {
    it('should render a list of unchecked radios', () => {
        const ids = OPTIONS.map(x => `${NAME}-${x.value}`)

        renderComponent()

        const label = screen.getByText(LABEL)
        const radios = screen.getAllByRole('radio')
        const radioIds = radios.map(x => x.id)

        expect(label).toBeInTheDocument()
        expect(radioIds).toEqual(ids)

        radios.forEach(x => {
            expect(x).not.toBeChecked()
        })
    })

    it('should render with one option checked', () => {
        const initialData = FIRST_OPTION.value

        renderComponent({
            initialData
        })

        const radios = screen.getAllByRole('radio')

        radios.forEach(x => {
            if (`${NAME}-${initialData}` === x.id)
                expect(x).toBeChecked()
            else
                expect(x).not.toBeChecked()
        })
    })

    describe('when clicked', () => {
        it('should check the option', async () => {
            renderComponent()

            const input = screen.getByLabelText(FIRST_OPTION.label)
            await userEvent.click(input)

            expect(input).toBeChecked()
        })

        it('should call onChangeValue function with the option value', async () => {
            renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByLabelText(FIRST_OPTION.label)
            await userEvent.click(input)

            expect(mockOnChangeValue).toHaveBeenCalledTimes(1)
            expect(mockOnChangeValue).toHaveBeenCalledWith(FIRST_OPTION.value)
        })

        describe('and when clicked again', () => {
            it('should not uncheck the option', async () => {
                renderComponent()

                const input = screen.getByLabelText(FIRST_OPTION.label)
                await userEvent.click(input)

                expect(input).toBeChecked()

                await userEvent.click(input)

                expect(input).toBeChecked()
            })
        })

        describe('and when clicked on another option', () => {
            it('should only remain checked the another option', async () => {
                const secondOption = OPTIONS[1]

                renderComponent()

                const input = screen.getByLabelText(FIRST_OPTION.label)
                await userEvent.click(input)

                const anotherInput = screen.getByLabelText(secondOption.label)
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

        describe('and when clicked', () => {
            it('should not check the option', async () => {
                renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(FIRST_OPTION.label)
                await userEvent.click(input)

                expect(input).not.toBeChecked()
            })

            it('should not call onChangeValue function', async () => {
                renderComponent({
                    hasOnChangeValue: true,
                    isDisabled: true
                })

                const input = screen.getByLabelText(FIRST_OPTION.label)
                await userEvent.click(input)

                expect(mockOnChangeValue).not.toHaveBeenCalled()
            })
        })
    })

    describe('when one option is disabled', () => {
        it('should only disable that option', () => {
            const data = generateFirstOptionDisabled()

            renderComponent({
                options: data.options
            })

            const input = screen.getByLabelText(data.firstOption.label)
            const radios = screen.getAllByRole('radio').filter(x => x.id !== input.id)

            expect(input).toBeDisabled()

            radios.forEach(x => {
                expect(x).toBeEnabled()
            })
        })

        describe('and when clicked', () => {
            it('should not check that option', async () => {
                const data = generateFirstOptionDisabled()

                renderComponent({
                    options: data.options
                })

                const input = screen.getByLabelText(data.firstOption.label)
                await userEvent.click(input)

                expect(input).not.toBeChecked()
            })

            it('should be able to check another option', async () => {
                const data = generateFirstOptionDisabled()
                const secondOption = data.options[1]

                renderComponent({
                    options: data.options
                })

                const input = screen.getByLabelText(secondOption.label)
                await userEvent.click(input)

                expect(input).toBeChecked()
            })
        })
    })
})
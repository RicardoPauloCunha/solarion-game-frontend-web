import { render, screen } from "@testing-library/react"
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event"
import { Form } from "@unform/web"
import Select from "."
import { OptionData } from "../Checkbox"

const NAME = 'testSelect'
const LABEL = 'Select label'
const PLACEHOLDER = 'Select placeholder'
const OPTIONS: OptionData[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
]
const FIRST_OPTION = OPTIONS[0]
const mockOnChangeValue = jest.fn()

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    render(<Form
        onSubmit={() => { }}
    >
        <Select
            name={NAME}
            label={LABEL}
            placeholder={PLACEHOLDER}
            options={OPTIONS}
            onChangeValue={options?.hasOnChangeValue ? mockOnChangeValue : undefined}
            isDisabled={options?.isDisabled}
        />
    </Form>)
}

describe('Select Comp', () => {
    it('should render a fake input', () => {
        renderComponent()

        const label = screen.getByText(LABEL)
        const input = screen.getByText(PLACEHOLDER)
        const options = screen.queryAllByRole('option')

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
        expect(options).toHaveLength(0)
    })

    describe('when click on label', () => {
        it('should focus in the fake input', async () => {
            renderComponent()

            const label = screen.getByText(LABEL)
            await userEvent.click(label)

            const input = screen.getByRole('combobox')

            expect(input).toHaveFocus()
        })
    })

    describe('when clicked', () => {
        it('should show the options', async () => {
            const texts = OPTIONS.map(x => x.label)

            renderComponent()

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const optionTexts = screen.getAllByRole('option').map(x => x.textContent)

            expect(optionTexts).toEqual(texts)
        })

        describe('and when click out', () => {
            it('should hide the options', async () => {
                renderComponent()

                const input = screen.getByRole('combobox')
                await userEvent.click(input)

                const label = screen.getByText(LABEL)
                await userEvent.click(label)

                const options = screen.queryAllByRole('option')

                expect(options).toHaveLength(0)
            })
        })
    })

    describe('when type a text', () => {
        it('should change the value of the fake input', async () => {
            renderComponent()

            const input = screen.getByRole('combobox')
            await userEvent.type(input, FIRST_OPTION.label)

            const inputWithValue = screen.getByDisplayValue(FIRST_OPTION.label)

            expect(inputWithValue).toBeInTheDocument()
        })

        it('should filter the options', async () => {
            const texts = [FIRST_OPTION.label]

            renderComponent()

            const input = screen.getByRole('combobox')
            await userEvent.type(input, FIRST_OPTION.label)

            const optionTexts = screen.getAllByRole('option').map(x => x.textContent)

            expect(optionTexts).toHaveLength(1)
            expect(optionTexts).toEqual(texts)
        })

        it('should not call onChangeValue function', async () => {
            renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByRole('combobox')
            await userEvent.type(input, FIRST_OPTION.label)

            expect(mockOnChangeValue).not.toHaveBeenCalled()
        })
    })

    describe('when select an option', () => {
        it('should change the value of the fake input', async () => {
            renderComponent()

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const selectedOption = screen.getByRole('option', { name: FIRST_OPTION.label })
            await userEvent.click(selectedOption)

            const inputWithValue = screen.getByText(FIRST_OPTION.label)
            const options = screen.queryAllByRole('option')

            expect(inputWithValue).toBeInTheDocument()
            expect(options).toHaveLength(0)
        })

        it('should call onChangeValue function with the option value', async () => {
            renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByRole('combobox')
            await userEvent.click(input)

            const selectedOption = screen.getByText(FIRST_OPTION.label)
            await userEvent.click(selectedOption)

            expect(mockOnChangeValue).toHaveBeenCalledTimes(1)
            expect(mockOnChangeValue).toHaveBeenCalledWith(FIRST_OPTION.value)
        })
    })

    describe('when disabled', () => {
        describe('and when type a text', () => {
            it('should not change the value of the fake input', async () => {
                renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(LABEL)
                await userEvent.type(input, FIRST_OPTION.label)

                const inputWithValue = screen.queryByDisplayValue(FIRST_OPTION.label)

                expect(inputWithValue).toBeNull()
            })
        })

        describe('and when clicked', () => {
            it('should not show the options', async () => {
                renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(LABEL)
                await userEvent.click(input, { pointerEventsCheck: PointerEventsCheckLevel.Never })

                const options = screen.queryAllByRole('option')

                expect(options).toHaveLength(0)
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import FileUpload from "."

const generateFile = (name: string = 'hello') => {
    return new File([name], name + '.png', { type: 'image/png' })
}

const NAME = 'testFileUpload'
const LABEL = 'File input label'
const PLACEHOLDER = 'File input placeholder'
const FILE = generateFile()
const mockOnChangeValue = jest.fn()

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    render(<Form
        onSubmit={() => { }}
    >
        <FileUpload
            name={NAME}
            label={LABEL}
            placeholder={PLACEHOLDER}
            onChangeValue={options?.hasOnChangeValue ? mockOnChangeValue : undefined}
            disabled={options?.isDisabled}
        />
    </Form>)
}

describe('FileUpload Comp', () => {
    it('should render a fake input', () => {
        renderComponent()

        const fakeLabel = screen.getByText(LABEL)
        const fakeInput = screen.getByText(PLACEHOLDER)
        const input = screen.getByPlaceholderText(PLACEHOLDER)

        expect(fakeLabel).toBeInTheDocument()
        expect(fakeInput).toBeInTheDocument()
        expect(input).toHaveStyle({ display: 'none' })
    })

    describe('when upload a file', () => {
        it('should replace the fake input placeholder for the file name', async () => {
            renderComponent()

            const input = screen.getByLabelText(PLACEHOLDER)
            await userEvent.upload(input, FILE)

            const fakeInputPlaceholder = screen.queryByText(PLACEHOLDER)
            const fileName = screen.getByText(FILE.name)

            expect(fakeInputPlaceholder).toBeNull()
            expect(fileName).toBeInTheDocument()
        })

        it('should call onChangeValue function', async () => {
            renderComponent({
                hasOnChangeValue: true
            })

            const input = screen.getByLabelText(PLACEHOLDER)
            await userEvent.upload(input, FILE)

            expect(mockOnChangeValue).toHaveBeenCalledTimes(1)
            expect(mockOnChangeValue).toHaveBeenCalledWith(expect.objectContaining({ name: FILE.name }))
        })

        describe('and when upload a file again', () => {
            it('should replace the file name for the new file name', async () => {
                const newFile = generateFile('bye')

                renderComponent()

                const input = screen.getByLabelText(PLACEHOLDER)
                await userEvent.upload(input, FILE)
                await userEvent.upload(input, newFile)

                const fileName = screen.queryByText(FILE.name)
                const newFileName = screen.getByText(newFile.name)

                expect(fileName).toBeNull()
                expect(newFileName).toBeInTheDocument()
            })
        })
    })

    describe('when disabled', () => {
        describe('and when upload a file', () => {
            it('should not replace the fake input placeholder for the file name', async () => {
                renderComponent({
                    isDisabled: true
                })

                const input = screen.getByLabelText(PLACEHOLDER)
                await userEvent.upload(input, FILE)

                const fakeInputPlaceholder = screen.getByText(PLACEHOLDER)
                const fileName = screen.queryByText(FILE.name)

                expect(fakeInputPlaceholder).toBeInTheDocument()
                expect(fileName).toBeNull()
            })

            it('should not call onChangeValue function', async () => {
                renderComponent({
                    hasOnChangeValue: true,
                    isDisabled: true
                })

                const input = screen.getByLabelText(PLACEHOLDER)
                await userEvent.upload(input, FILE)

                expect(mockOnChangeValue).not.toHaveBeenCalled()
            })
        })
    })
})
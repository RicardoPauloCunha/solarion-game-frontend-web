import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "@unform/web"
import FileUpload from "."

const generateFile = () => {
    return new File(['hello'], 'hello.png', { type: 'image/png' })
}

const renderComponent = (options?: {
    hasOnChangeValue?: boolean,
    isDisabled?: boolean,
}) => {
    const name = 'fileupload'
    const label = 'Upload do arquivo'
    const placeholder = 'Selecione o arquivo para upload'
    const onChangeValue = jest.fn()

    render(<Form
        onSubmit={() => { }}
    >
        <FileUpload
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

describe('FileUpload Comp', () => {
    it('should render a fake input', () => {
        const props = renderComponent()

        const fakeLabel = screen.getByText(props.label)
        const fakeInput = screen.getByText(props.placeholder)
        const input = screen.getByPlaceholderText(props.placeholder)

        expect(fakeLabel).toBeInTheDocument()
        expect(fakeInput).toBeInTheDocument()
        expect(input).toHaveStyle({ display: 'none' })
    })

    describe('when upload a file', () => {
        it('should replace the fake input placeholder for file name', async () => {
            const props = renderComponent()
            const file = generateFile()

            const input = screen.getByLabelText(props.placeholder)
            await userEvent.upload(input, file)

            const fakeInputPlaceholder = screen.queryByText(props.placeholder)
            const fileName = screen.getByText(file.name)

            expect(fakeInputPlaceholder).toBeNull()
            expect(fileName).toBeInTheDocument()
        })

        it('should call the onChange function', async () => {
            const props = renderComponent({ hasOnChangeValue: true })
            const file = generateFile()

            const input = screen.getByLabelText(props.placeholder)
            await userEvent.upload(input, file)

            expect(props.onChangeValue).toHaveBeenCalledTimes(1)
            expect(props.onChangeValue).toHaveBeenCalledWith(expect.objectContaining({ name: file.name }))
        })

        describe('and when upload a file again', () => {
            it('should replace the file name for the new file name', async () => {
                const props = renderComponent()
                const file = generateFile()
                const newFile = new File(['bye'], 'bye.png', { type: 'image/png' })

                const input = screen.getByLabelText(props.placeholder)
                await userEvent.upload(input, file)
                await userEvent.upload(input, newFile)

                const fileName = screen.queryByText(file.name)
                const newFileName = screen.getByText(newFile.name)

                expect(fileName).toBeNull()
                expect(newFileName).toBeInTheDocument()
            })
        })
    })

    describe('when disabled', () => {
        describe('and when upload a file', () => {
            it('should not replace the fake input placeholder for file name', async () => {
                const props = renderComponent({ isDisabled: true })
                const file = generateFile()

                const input = screen.getByLabelText(props.placeholder)
                await userEvent.upload(input, file)

                const fakeInputPlaceholder = screen.getByText(props.placeholder)
                const fileName = screen.queryByText(file.name)

                expect(fakeInputPlaceholder).toBeInTheDocument()
                expect(fileName).toBeNull()
            })

            it('should not call the onChange function', async () => {
                const props = renderComponent({ hasOnChangeValue: true, isDisabled: true })
                const file = generateFile()

                const input = screen.getByLabelText(props.placeholder)
                await userEvent.upload(input, file)

                expect(props.onChangeValue).not.toHaveBeenCalled()
            })
        })
    })
})
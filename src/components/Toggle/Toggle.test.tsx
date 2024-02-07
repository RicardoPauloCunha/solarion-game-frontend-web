import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Toggle from "."

const renderComponent = (options?: {
    isOpenDefault?: boolean,
    hasPreview?: boolean,
    hasOnOpen?: boolean
}) => {
    const text = 'Detalhes'
    const textContent = 'Detalhes mais detalhados sobre os detalhes.'
    const previewTextContent = 'Pré-visualização dos detalhes.'
    const onOpen = jest.fn()

    render(<Toggle
        text={text}
        isOpenDefault={options?.isOpenDefault}
        preview={options?.hasPreview ? <p>{previewTextContent}</p> : undefined}
        onOpen={options?.hasOnOpen ? onOpen : undefined}
    >
        <p>{textContent}</p>
    </Toggle>)

    return ({
        text,
        textContent,
        previewTextContent,
        onOpen
    })
}

describe('Toggle', () => {
    it('should render a closed toggle', () => {
        const props = renderComponent()

        const field = screen.getByText(props.text)
        const toggle = screen.getByRole('switch')
        const content = screen.queryByText(props.textContent)

        expect(field).toBeInTheDocument()
        expect(toggle).toBeInTheDocument()
        expect(content).toBeNull()
    })

    it('should render an open toggle', () => {
        const props = renderComponent({
            isOpenDefault: true
        })

        const fieldName = screen.getByText(props.text)
        const toggle = screen.getByRole('switch')
        const content = screen.getByText(props.textContent)

        expect(fieldName).toBeInTheDocument()
        expect(toggle).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })

    describe('when have a preview', () => {
        describe('and when is closed', () => {
            it('should show the preview', () => {
                const props = renderComponent({
                    hasPreview: true
                })

                const preview = screen.getByText(props.previewTextContent)

                expect(preview).toBeInTheDocument()
            })

            describe('and when clicked', () => {
                it('should hide the preview', async () => {
                    const props = renderComponent({
                        hasPreview: true
                    })

                    const previewOn = screen.getByText(props.previewTextContent)

                    expect(previewOn).toBeInTheDocument()

                    const button = screen.getByRole('switch')
                    await userEvent.click(button)

                    const previewOff = screen.queryByText(props.previewTextContent)

                    expect(previewOff).toBeNull()
                })
            })
        })

        describe('and when is open', () => {
            it('should not render the preview', () => {
                const props = renderComponent({
                    isOpenDefault: true,
                    hasPreview: true
                })

                const preview = screen.queryByText(props.previewTextContent)

                expect(preview).toBeNull()
            })

            describe('and when clicked', () => {
                it('should show the preview', async () => {
                    const props = renderComponent({
                        isOpenDefault: true,
                        hasPreview: true
                    })

                    const previewOff = screen.queryByText(props.previewTextContent)

                    expect(previewOff).toBeNull()

                    const button = screen.getByRole('switch')
                    await userEvent.click(button)

                    const previewOn = screen.getByText(props.previewTextContent)

                    expect(previewOn).toBeInTheDocument()
                })
            })
        })
    })

    describe('when is clicked', () => {
        it('should show the content', async () => {
            const props = renderComponent()

            const contentOff = screen.queryByText(props.textContent)

            expect(contentOff).toBeNull()

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            const contentOn = screen.getByText(props.textContent)

            expect(contentOn).toBeInTheDocument()
        })

        it('should call onOpen function', async () => {
            const props = renderComponent({
                hasOnOpen: true
            })

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            expect(props.onOpen).toHaveBeenCalledTimes(1)
        })

        describe('and when clicked again', () => {
            it('should hide the content', async () => {
                const toggleProps = renderComponent()

                const button = screen.getByRole('switch')
                await userEvent.click(button)

                const contentOn = screen.getByText(toggleProps.textContent)

                expect(contentOn).toBeInTheDocument()

                await userEvent.click(button)

                const contentOff = screen.queryByText(toggleProps.textContent)

                expect(contentOff).toBeNull()
            })

            it('should call onOpen function only when opening', async () => {
                const toggleProps = renderComponent({
                    hasOnOpen: true
                })

                const button = screen.getByRole('switch')
                await userEvent.click(button)
                await userEvent.click(button)

                expect(toggleProps.onOpen).toHaveBeenCalledTimes(1)
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Toggle from "."

const TEXT = 'Field'
const TEXT_CONTENT = 'Text content'
const TEXT_CONTENT_PREVIEW = 'Text content preview.'
const mockOnOpen = jest.fn()

const renderComponent = (options?: {
    isOpenDefault?: boolean,
    hasPreview?: boolean,
    hasOnOpen?: boolean
}) => {
    render(<Toggle
        text={TEXT}
        isOpenDefault={options?.isOpenDefault}
        preview={options?.hasPreview ? <p>{TEXT_CONTENT_PREVIEW}</p> : undefined}
        onOpen={options?.hasOnOpen ? mockOnOpen : undefined}
    >
        <p>{TEXT_CONTENT}</p>
    </Toggle>)
}

describe('Toggle', () => {
    it('should render a closed toggle', () => {
        renderComponent()

        const field = screen.getByText(TEXT)
        const toggle = screen.getByRole('switch')
        const content = screen.queryByText(TEXT_CONTENT)

        expect(field).toBeInTheDocument()
        expect(toggle).toBeInTheDocument()
        expect(content).toBeNull()
    })

    it('should render an open toggle', () => {
        renderComponent({
            isOpenDefault: true
        })

        const fieldName = screen.getByText(TEXT)
        const toggle = screen.getByRole('switch')
        const content = screen.getByText(TEXT_CONTENT)

        expect(fieldName).toBeInTheDocument()
        expect(toggle).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })

    describe('when have a preview', () => {
        describe('and when is closed', () => {
            it('should show the preview', () => {
                renderComponent({
                    hasPreview: true
                })

                const preview = screen.getByText(TEXT_CONTENT_PREVIEW)

                expect(preview).toBeInTheDocument()
            })

            describe('and when clicked', () => {
                it('should hide the preview', async () => {
                    renderComponent({
                        hasPreview: true
                    })

                    const previewOn = screen.getByText(TEXT_CONTENT_PREVIEW)

                    expect(previewOn).toBeInTheDocument()

                    const button = screen.getByRole('switch')
                    await userEvent.click(button)

                    const previewOff = screen.queryByText(TEXT_CONTENT_PREVIEW)

                    expect(previewOff).toBeNull()
                })
            })
        })

        describe('and when is open', () => {
            it('should not render the preview', () => {
                renderComponent({
                    isOpenDefault: true,
                    hasPreview: true
                })

                const preview = screen.queryByText(TEXT_CONTENT_PREVIEW)

                expect(preview).toBeNull()
            })

            describe('and when clicked', () => {
                it('should show the preview', async () => {
                    renderComponent({
                        isOpenDefault: true,
                        hasPreview: true
                    })

                    const previewOff = screen.queryByText(TEXT_CONTENT_PREVIEW)

                    expect(previewOff).toBeNull()

                    const button = screen.getByRole('switch')
                    await userEvent.click(button)

                    const previewOn = screen.getByText(TEXT_CONTENT_PREVIEW)

                    expect(previewOn).toBeInTheDocument()
                })
            })
        })
    })

    describe('when is clicked', () => {
        it('should show the content', async () => {
            renderComponent()

            const contentOff = screen.queryByText(TEXT_CONTENT)

            expect(contentOff).toBeNull()

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            const contentOn = screen.getByText(TEXT_CONTENT)

            expect(contentOn).toBeInTheDocument()
        })

        it('should call onOpen function', async () => {
            renderComponent({
                hasOnOpen: true
            })

            const button = screen.getByRole('switch')
            await userEvent.click(button)

            expect(mockOnOpen).toHaveBeenCalledTimes(1)
        })

        describe('and when clicked again', () => {
            it('should hide the content', async () => {
                renderComponent()

                const button = screen.getByRole('switch')
                await userEvent.click(button)

                const contentOn = screen.getByText(TEXT_CONTENT)

                expect(contentOn).toBeInTheDocument()

                await userEvent.click(button)

                const contentOff = screen.queryByText(TEXT_CONTENT)

                expect(contentOff).toBeNull()
            })

            it('should call onOpen function only when opening', async () => {
                renderComponent({
                    hasOnOpen: true
                })

                const button = screen.getByRole('switch')
                await userEvent.click(button)
                await userEvent.click(button)

                expect(mockOnOpen).toHaveBeenCalledTimes(1)
            })
        })
    })
})
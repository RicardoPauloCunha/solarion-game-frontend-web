import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Modal from "."

const TITLE = 'Modal title'
const TEXT_CONTENT = 'Modal text content'
const mockOnClose = jest.fn()

const renderComponent = (options?: {
    isOpen?: boolean
}) => {
    render(<Modal
        title={TITLE}
        isOpen={!!options?.isOpen}
        onClose={mockOnClose}
    >
        <p>{TEXT_CONTENT}</p>
    </Modal>)
}

describe('Modal Comp', () => {
    it('should render an open modal', () => {
        renderComponent({
            isOpen: true
        })

        const title = screen.getByRole('heading', { name: TITLE })
        const content = screen.getByText(TEXT_CONTENT)

        expect(title).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })

    it('should render a closed modal', () => {
        renderComponent()

        const title = screen.queryByRole('heading', { name: TITLE })
        const content = screen.queryByText(TEXT_CONTENT)

        expect(title).toBeNull()
        expect(content).toBeNull()
    })

    describe('when click in icon to close', () => {
        it('should call onClose function', async () => {
            renderComponent({
                isOpen: true
            })

            const closeIcon = screen.getByRole('switch', { name: 'Fechar modal' })
            await userEvent.click(closeIcon)

            expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
    })
})
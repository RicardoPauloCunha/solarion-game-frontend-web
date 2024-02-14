import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SuccessModal from "."

const TITLE = 'Modal title'
const MESSAGES = [
    'Message 01',
    'Message 02',
    'Message 03',
]
const mockOnClose = jest.fn()

const renderComponent = () => {
    render(<SuccessModal
        title={TITLE}
        messages={MESSAGES}
        isOpen={true}
        onClose={mockOnClose}
    />)
}

describe('SuccessModal Comp', () => {
    it('should render a modal', () => {
        renderComponent()

        const messageTexts = screen.getAllByRole('paragraph').map(x => x.textContent)
        const confirmButton = screen.getByRole('button', { name: 'Entendi' })

        expect(messageTexts).toEqual(MESSAGES)
        expect(confirmButton).toBeInTheDocument()
    })

    describe('when click on modal button', () => {
        it('should call onClose function', async () => {
            renderComponent()

            const modalButton = screen.getByRole('button', { name: 'Entendi' })
            await userEvent.click(modalButton)

            expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
    })
})
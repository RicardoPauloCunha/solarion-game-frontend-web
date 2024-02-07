import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SuccessModal from "."

const renderComponent = () => {
    const title = 'Título do modal'
    const messages = [
        'Mensagem 01',
        'Mensagem 02',
        'Mensagem 03',
    ]
    const onClose = jest.fn()

    render(<SuccessModal
        title={title}
        messages={messages}
        isOpen={true}
        onClose={onClose}
    />)

    return {
        title,
        messages,
        onClose
    }
}

describe('SuccessModal Comp', () => {
    it('should render a modal', () => {
        const props = renderComponent()

        const messagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
        const confirmButton = screen.getByRole('button', { name: 'Entendi' })

        expect(messagesText).toEqual(props.messages)
        expect(confirmButton).toBeInTheDocument()
    })

    describe('when click in modal button', () => {
        it('should call onClose function', async () => {
            const props = renderComponent()

            const modalButton = screen.getByRole('button', { name: 'Entendi' })
            await userEvent.click(modalButton)

            expect(props.onClose).toHaveBeenCalledTimes(1)
        })
    })
})
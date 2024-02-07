import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Modal from "."

const renderComponent = (isOpen: boolean = true) => {
    const textContent = 'Modal content'
    const title = 'Título do modal'
    const onClose = jest.fn()

    render(<Modal
        title={title}
        isOpen={isOpen}
        onClose={onClose}
    >
        <p>{textContent}</p>
    </Modal>)

    return {
        textContent,
        title,
        onClose
    }
}

describe('Modal Comp', () => {
    it('should render an open modal', () => {
        const props = renderComponent()

        const title = screen.getByRole('heading', { name: props.title })
        const content = screen.getByText(props.textContent)

        expect(title).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })

    it('should render a closed modal', () => {
        const props = renderComponent(false)

        const title = screen.queryByRole('heading', { name: props.title })
        const content = screen.queryByText(props.textContent)

        expect(title).toBeNull()
        expect(content).toBeNull()
    })

    describe('when click in icon to close', () => {
        it('should call onClose function', async () => {
            const props = renderComponent()

            const closeIcon = screen.getByRole('switch', { name: 'Fechar modal' })
            await userEvent.click(closeIcon)

            expect(props.onClose).toHaveBeenCalledTimes(1)
        })
    })
})
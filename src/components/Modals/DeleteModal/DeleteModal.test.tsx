import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DeleteModal from "."
import { WarningData } from "../../Cards/WarningCard"

const generateWarning = (): WarningData => {
    return {
        title: 'Algo deu errado',
        message: 'Oh não, parece que ocorreu algum erro na operação.'
    }
}

const renderComponent = (options?: {
    hasWarning?: boolean
}) => {
    const title = 'Título do modal'
    const messages = [
        'Mensagem 01',
        'Mensagem 02',
        'Mensagem 03',
    ]
    const values = [
        'Valor 01',
        'Valor 02',
    ]
    const onClose = jest.fn()
    const onConfirm = jest.fn()
    const warning = generateWarning()

    render(<DeleteModal
        title={title}
        messages={messages}
        isOpen={true}
        onClose={onClose}
        values={values}
        warning={options?.hasWarning ? warning : undefined}
        isLoading={false}
        onConfirm={onConfirm}
    />)

    return {
        title,
        messages,
        values,
        warning,
        onClose,
        onConfirm
    }
}

describe('SuccessModal Comp', () => {
    it('should render a modal', () => {
        const props = renderComponent()

        const messagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
        const valuesText = screen.getAllByRole('listitem').map(x => x.textContent)
        const valuesTextData = props.values.map(x => `\u2022 ${x}`)
        const warning = screen.queryByRole('alert')
        const removeButton = screen.getByRole('button', { name: 'Remover' })

        expect(messagesText).toEqual(props.messages)
        expect(valuesText).toEqual(valuesTextData)
        expect(warning).toBeNull()
        expect(removeButton).toBeInTheDocument()
    })

    describe('when click in modal button', () => {
        it('should call onConfirm function', async () => {
            const props = renderComponent()

            const modalButton = screen.getByRole('button', { name: 'Remover' })
            await userEvent.click(modalButton)

            expect(props.onConfirm).toHaveBeenCalledTimes(1)
        })
    })

    describe('when has error', () => {
        it('should show a warning', async () => {
            renderComponent({
                hasWarning: true
            })

            const warning = screen.getByRole('alert')

            expect(warning).toBeInTheDocument()
        })
    })
})
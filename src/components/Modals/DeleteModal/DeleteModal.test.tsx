import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DeleteModal from "."
import { WarningData } from "../../Cards/WarningCard"

const generateWarning = (): WarningData => {
    return {
        title: 'Warning title',
        message: 'Warning message.'
    }
}

const TITLE = 'Modal title'
const MESSAGES = [
    'Message 01',
    'Message 02',
    'Message 03',
]
const VALUES = [
    'Value 01',
    'Value 02',
]
const WARNING = generateWarning()
const mockOnClose = jest.fn()
const mockOnConfirm = jest.fn()

const renderComponent = (options?: {
    hasWarning?: boolean
}) => {
    render(<DeleteModal
        title={TITLE}
        messages={MESSAGES}
        isOpen={true}
        onClose={mockOnClose}
        values={VALUES}
        warning={options?.hasWarning ? WARNING : undefined}
        isLoading={false}
        onConfirm={mockOnConfirm}
    />)
}

describe('SuccessModal Comp', () => {
    it('should render a modal', () => {
        const texts = VALUES.map(x => `\u2022 ${x}`)

        renderComponent()

        const messageTexts = screen.getAllByRole('alertdialog').map(x => x.textContent)
        const valueTexts = screen.getAllByRole('listitem').map(x => x.textContent)
        const warning = screen.queryByRole('alert')
        const removeButton = screen.getByRole('button', { name: 'Remover' })

        expect(messageTexts).toEqual(MESSAGES)
        expect(valueTexts).toEqual(texts)
        expect(warning).toBeNull()
        expect(removeButton).toBeInTheDocument()
    })

    describe('when click in modal button', () => {
        it('should call onConfirm function', async () => {
            renderComponent()

            const modalButton = screen.getByRole('button', { name: 'Remover' })
            await userEvent.click(modalButton)

            expect(mockOnConfirm).toHaveBeenCalledTimes(1)
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
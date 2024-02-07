import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import WarningCard from "."

const renderComponent = (options?: {
    hasSubmessages?: boolean
}) => {
    const title = 'Algo deu errado'
    const message = 'Oh não, parece que ocorreu algum erro na operação.'
    const submessages = [
        'Ocorreu um erro no módulo X',
        'Ocorreu um erro no módulo Y',
        'Ocorreu um erro no módulo Z',
    ]

    render(<WarningCard
        title={title}
        message={message}
        submessages={options?.hasSubmessages ? submessages : undefined}
    />)

    return {
        title,
        message,
        submessages
    }
}

describe('WarningCard Comp', () => {
    it('should render a default card', () => {
        const props = renderComponent()

        const title = screen.getByText(props.title)
        const message = screen.getByText(props.message)
        const detailsTitle = screen.queryByText('Detalhes')
        const submessagesList = screen.queryByRole('list')

        expect(title).toBeInTheDocument()
        expect(message).toBeInTheDocument()
        expect(detailsTitle).toBeNull()
        expect(submessagesList).toBeNull()
    })

    describe('when have submessages', () => {
        it('should render a card with details', async () => {
            const props = renderComponent({
                hasSubmessages: true
            })

            const detailsTitle = screen.getByText('Detalhes')
            const submessagesList = screen.queryByRole('list')

            expect(detailsTitle).toBeInTheDocument()
            expect(submessagesList).toBeNull()

            const toggle = screen.getByRole('switch')
            await userEvent.click(toggle)

            const submessagesText = screen.getAllByRole('listitem').map(x => x.textContent)
            const submessagesTextData = props.submessages?.map(x => `\u2022 ${x}`)

            expect(submessagesText).toEqual(submessagesTextData)
        })
    })
})
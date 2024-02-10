import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import WarningCard from "."

const TITLE = 'Warning title'
const MESSAGE = 'Warning message.'
const SUBMESSAGES = [
    'Warning submessage 01',
    'Warning submessage 02',
    'Warning submessage 03',
]

const renderComponent = (options?: {
    submessages?: string[]
}) => {
    render(<WarningCard
        title={TITLE}
        message={MESSAGE}
        submessages={options?.submessages ? options?.submessages : undefined}
    />)
}

describe('WarningCard Comp', () => {
    it('should render a default card', () => {
        renderComponent()

        const title = screen.getByText(TITLE)
        const message = screen.getByText(MESSAGE)
        const detailsTitle = screen.queryByText('Detalhes')
        const submessagesList = screen.queryByRole('list')

        expect(title).toBeInTheDocument()
        expect(message).toBeInTheDocument()
        expect(detailsTitle).toBeNull()
        expect(submessagesList).toBeNull()
    })

    describe('when have submessages', () => {
        it('should render a card with details', async () => {
            const texts = SUBMESSAGES?.map(x => `\u2022 ${x}`)

            renderComponent({
                submessages: SUBMESSAGES
            })

            const detailsTitle = screen.getByText('Detalhes')
            const submessagesList = screen.queryByRole('list')

            expect(detailsTitle).toBeInTheDocument()
            expect(submessagesList).toBeNull()

            const toggle = screen.getByRole('switch')
            await userEvent.click(toggle)

            const submessageTexts = screen.getAllByRole('listitem').map(x => x.textContent)

            expect(submessageTexts).toEqual(texts)
        })
    })
})
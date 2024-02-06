import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import PageContainer from "."

const renderComponent = () => {
    let textContext = 'Conteúdo da página'

    render(<PageContainer>
        <p>{textContext}</p>
    </PageContainer>, { wrapper: BrowserRouter })

    return {
        textContext
    }
}

describe('PageContainer Comp', () => {
    it('should render a page container', () => {
        const props = renderComponent()

        const navbar = screen.getByRole('menubar')
        const content = screen.getByText(props.textContext)

        expect(navbar).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })
})
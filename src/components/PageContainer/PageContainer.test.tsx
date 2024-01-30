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

        const homeLink = screen.getByRole('link', { name: 'SolarionGame' })
        const content = screen.getByText(props.textContext)

        expect(homeLink).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })
})
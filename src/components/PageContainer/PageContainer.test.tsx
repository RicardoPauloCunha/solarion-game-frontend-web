import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import PageContainer from "."

const TEXT_CONTENT = 'Text content'

const renderComponent = () => {
    render(<PageContainer>
        <p>{TEXT_CONTENT}</p>
    </PageContainer>, { wrapper: BrowserRouter })
}

describe('PageContainer Comp', () => {
    it('should render a page container', () => {
        renderComponent()

        const navbar = screen.getByRole('menubar')
        const content = screen.getByText(TEXT_CONTENT)

        expect(navbar).toBeInTheDocument()
        expect(content).toBeInTheDocument()
    })
})
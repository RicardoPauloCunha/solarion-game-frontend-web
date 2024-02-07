import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import NotFound from "."
import NotFoundImg from '../../assets/images/not-found.png'

const renderPage = () => {
    render(<NotFound />, { wrapper: BrowserRouter })
}

describe('NotFound Page', () => {
    it('should render the not found page', () => {
        renderPage()

        const image = screen.getByAltText("Reação da Raeliana ao receber a informação (The Reason Why Raeliana Ended Up at the Duke's Mansion).")
        const title = screen.getByRole('heading', { name: '...' })
        const text = screen.getByText('Parece que a página não foi encontrada.')

        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', NotFoundImg)
        expect(title).toBeInTheDocument()
        expect(text).toBeInTheDocument()
    })
})
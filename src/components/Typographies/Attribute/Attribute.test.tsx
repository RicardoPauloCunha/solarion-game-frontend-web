import { render, screen } from "@testing-library/react"
import Attribute from "."

const FIELD = "Field"
const VALUE = "Value"

const renderComponent = () => {
    render(<Attribute
        field={FIELD}
        value={VALUE}
    />)
}

describe('Attribute Comp', () => {
    it('should render a field-value', () => {
        renderComponent()

        const field = screen.getByText(FIELD)
        const value = screen.getByText(VALUE)

        expect(field).toBeInTheDocument()
        expect(value).toBeInTheDocument()
    })
})
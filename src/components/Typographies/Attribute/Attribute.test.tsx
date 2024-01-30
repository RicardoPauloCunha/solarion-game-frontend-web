import { render, screen } from "@testing-library/react"
import Attribute from "."

const renderComponent = () => {
    const field = "Campo"
    const value = "Valor"

    render(<Attribute
        field={field}
        value={value}
    />)

    return {
        field,
        value
    }
}

describe('Attribute Comp', () => {
    it('should render a field-value', () => {
        const props = renderComponent()

        const field = screen.getByText(props.field)
        const value = screen.getByText(props.value)

        expect(field).toBeInTheDocument()
        expect(value).toBeInTheDocument()
    })
})
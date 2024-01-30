import { render, screen } from "@testing-library/react"
import VerticalGroup from "."

const renderComponent = () => {
    render(<VerticalGroup>
        <div></div>
        <div></div>
        <div></div>
    </VerticalGroup>)
}

describe('VerticalGroup Comp', () => {
    it('should render with a group of elements', () => {
        renderComponent()

        const group = screen.getByRole('group')

        expect(group.children).toHaveLength(3)
    })
})
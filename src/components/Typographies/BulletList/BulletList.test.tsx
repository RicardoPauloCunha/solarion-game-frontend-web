import { render, screen } from "@testing-library/react"
import BulletList from "."

const renderComponent = () => {
    const itens = [
        'Item 01',
        'Item 02',
        'Item 03',
    ]

    render(<BulletList
        items={itens}
    />)

    return {
        itens
    }
}

describe('BulletList Comp', () => {
    it('should render a string list', () => {
        const props = renderComponent()

        const list = screen.getByRole('list')
        const items = screen.getAllByRole('listitem').map(x => x.textContent)
        const itemsData = props.itens.map(x => `\u2022 ${x}`)

        expect(list).toBeInTheDocument()
        expect(items).toEqual(itemsData)
    })
})
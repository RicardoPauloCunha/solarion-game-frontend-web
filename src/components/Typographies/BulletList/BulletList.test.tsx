import { render, screen } from "@testing-library/react"
import BulletList from "."

const ITEMS = [
    'Item 01',
    'Item 02',
    'Item 03',
]

const renderComponent = () => {
    render(<BulletList
        items={ITEMS}
    />)
}

describe('BulletList Comp', () => {
    it('should render a string list', () => {
        const texts = ITEMS.map(x => `\u2022 ${x}`)

        renderComponent()

        const list = screen.getByRole('list')
        const itemTexts = screen.getAllByRole('listitem').map(x => x.textContent)

        expect(list).toBeInTheDocument()
        expect(itemTexts).toEqual(texts)
    })
})
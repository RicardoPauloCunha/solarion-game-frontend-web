import { render, screen } from "@testing-library/react"
import LoadingText from "."

const renderComponent = (isLoading: boolean, options?: {
    hasDefaultText?: boolean,
}) => {
    const loadingText = "Carregando processo..."
    const defaultText = "Processo XXX"

    render(<LoadingText
        isLoading={isLoading}
        loadingText={loadingText}
        defaultText={options?.hasDefaultText ? defaultText : undefined}
    />)

    return {
        loadingText,
        defaultText
    }
}

describe('LoadingText Comp', () => {
    describe('when loading', () => {
        it('should render a loading text', () => {
            const props = renderComponent(true)

            const loadingText = screen.getByText(props.loadingText)

            expect(loadingText).toBeInTheDocument()
        })

        it('should replace default text for loading text', () => {
            const props = renderComponent(true, { hasDefaultText: true })

            const defaultText = screen.queryByText(props.defaultText)
            const loadingText = screen.getByText(props.loadingText)

            expect(defaultText).toBeNull()
            expect(loadingText).toBeInTheDocument()
        })
    })

    describe('when not loading', () => {
        it('should not render a loading text', () => {
            const props = renderComponent(false)

            const loadingText = screen.queryByText(props.loadingText)

            expect(loadingText).toBeNull()
        })

        describe('and when have default text', () => {
            it('should render the default text', () => {
                const props = renderComponent(false, { hasDefaultText: true })

                const defaultText = screen.getByText(props.defaultText)

                expect(defaultText).toBeInTheDocument()
            })
        })

        describe('and when no default text', () => {
            it('should not render', () => {
                const props = renderComponent(false)

                const defaultText = screen.queryByText(props.defaultText)
                const loadingText = screen.queryByText(props.loadingText)

                expect(defaultText).toBeNull()
                expect(loadingText).toBeNull()
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import LoadingText from "."

const LOADING_TEXT = "Loading text..."
const DEFAULT_TEXT = "Default text"

const renderComponent = (options?: {
    isLoading?: boolean
    hasDefaultText?: boolean,
}) => {
    render(<LoadingText
        isLoading={!!options?.isLoading}
        loadingText={LOADING_TEXT}
        defaultText={options?.hasDefaultText ? DEFAULT_TEXT : undefined}
    />)
}

describe('LoadingText Comp', () => {
    describe('when loading', () => {
        it('should render a loading text', () => {
            renderComponent({
                isLoading: true
            })

            const loadingText = screen.getByText(LOADING_TEXT)

            expect(loadingText).toBeInTheDocument()
        })

        it('should replace default text for loading text', () => {
            renderComponent({
                isLoading: true,
                hasDefaultText: true
            })

            const defaultText = screen.queryByText(DEFAULT_TEXT)
            const loadingText = screen.getByText(LOADING_TEXT)

            expect(defaultText).toBeNull()
            expect(loadingText).toBeInTheDocument()
        })
    })

    describe('when not loading', () => {
        it('should not render a loading text', () => {
            renderComponent()

            const loadingText = screen.queryByText(LOADING_TEXT)

            expect(loadingText).toBeNull()
        })

        describe('and when have default text', () => {
            it('should render the default text', () => {
                renderComponent({
                    hasDefaultText: true
                })

                const defaultText = screen.getByText(DEFAULT_TEXT)

                expect(defaultText).toBeInTheDocument()
            })
        })

        describe('and when no default text', () => {
            it('should not render', () => {
                renderComponent()

                const defaultText = screen.queryByText(DEFAULT_TEXT)
                const loadingText = screen.queryByText(LOADING_TEXT)

                expect(defaultText).toBeNull()
                expect(loadingText).toBeNull()
            })
        })
    })
})
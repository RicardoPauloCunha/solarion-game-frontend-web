import styled, { css } from 'styled-components'

export type WarningVariant = 'info' | 'error'

interface ContainerProps {
    $variant?: WarningVariant
}

export const Container = styled.div<ContainerProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 0.25rem solid var(--color-white);
    background-color: var(--color-white);

    >p {
        font-size: 1rem;
    }

    >strong:first-of-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
    }

    ${({ $variant }) => $variant === 'info' && css`
        border-color: var(--color-gray);

        >strong:first-of-type>svg {
            color: var(--color-gray);
        }
    `}

    ${({ $variant }) => $variant === 'error' && css`
        border-color: var(--color-red);

        >strong:first-of-type>svg {
            color: var(--color-red);
        }
    `}
`
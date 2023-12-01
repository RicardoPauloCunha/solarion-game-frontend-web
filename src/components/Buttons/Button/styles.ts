import styled, { css } from "styled-components";

export type ButtonVariant = 'default' | 'outline'

interface ContainerProps {
    $variant?: ButtonVariant
    $isLoading?: boolean
}

export const Container = styled.button<ContainerProps>`
    width: 100%;
    height: auto;
    padding: 0.5rem;
    border-radius: 1rem;
    border-width: 0.25rem;
    border-style: solid;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    ${({ $variant }) => $variant === 'default' && css`
        background-color: var(--color-wine);
        border-color: var(--color-wine);
        color: var(--color-white);
    `}

    ${({ $variant }) => $variant === 'outline' && css`
        background-color: transparent;
        border-color: var(--color-wine);
        color: var(--color-dark-gray);
    `}

    ${({ $isLoading }) => $isLoading && css`
        opacity: 0.75;
    `}
`

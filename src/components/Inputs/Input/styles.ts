import styled, { css } from "styled-components";

export interface InputContainerProps {
    $hasError: boolean
    $isFilled?: boolean
    $isFocused?: boolean
    $isDisabled?: boolean
}

export const Container = styled.fieldset<InputContainerProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &:hover {
        >label {
            font-weight: 600;
        }
    }

    >label {
        margin-bottom: 0;
    }

    >input {
        background-color: var(--color-white);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 0.15rem solid var(--color-wine);
        color: var(--color-dark-gray);
        font-size: 1rem;
    }

    >strong {
        color: var(--color-red);
    }

    ${({ $isFocused }) => $isFocused && css`
        >input {
            outline-style: solid;
            outline-color: var(--color-wine);
        }
    `}

    ${({ $hasError }) => $hasError && css`
        >label, >strong {
            font-weight: 600;
        }
    `}

    ${({ $isDisabled }) => $isDisabled && css`
        input {
            background-color: var(--color-light-gray);
        }
    `}
`

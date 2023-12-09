import styled, { css } from "styled-components"
import { InputContainerProps } from "../Input/styles"

interface ContainerProps extends InputContainerProps {
    $hasValue: boolean
}

export const Container = styled.fieldset<ContainerProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    >label {
        margin-bottom: 0;
        background-color: var(--color-white);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 0.15rem solid var(--color-wine);
        color: var(--color-gray);
        font-size: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;
        cursor: pointer;

        svg {
            width: 1.5rem;
            height: 1.5rem;
            margin: auto 0;
            color: var(--color-gray)
        }

        &:active {
            outline-width: 1px;
            outline-style: solid;
            outline-color: var(--color-wine);
        }

        ${({ $hasValue }) => $hasValue && css`
            &, svg {
                color: var(--color-dark-gray);
            }
        `}
    }

    >input {
        display: none;
    }

    >strong {
        color: var(--color-red);
    }

    &:hover {
        >span {
            font-weight: 600;
        }
    }

    ${({ $hasError }) => $hasError && css`
        >span, >strong {
            font-weight: 600;
        }
    `}

    ${({ $isDisabled }) => $isDisabled && css`
        >span {
            background-color: var(--color-light-gray);
        }
    `}
`
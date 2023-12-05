import styled, { css } from "styled-components";
import { InputContainerProps } from "../Input/styles";

interface ContainerProps extends InputContainerProps {

}

export const Container = styled.fieldset<ContainerProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    >label {
        margin-bottom: 0;
    }

    >textarea {
        background-color: var(--color-white);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 0.15rem solid var(--color-wine);
        color: var(--color-dark-gray);
        font-size: 1rem;
        resize: none;
        overflow: hidden;

        &:focus {
            outline-style: solid;
            outline-color: var(--color-wine);
        }
    }

    >strong {
        color: var(--color-red);
    }

    &:hover {
        >label {
            font-weight: 600;
        }
    }

    ${({ $hasError }) => $hasError && css`
        >label, >strong {
            font-weight: 600;
        }
    `}

    ${({ $isDisabled }) => $isDisabled && css`
        >textarea {
            background-color: var(--color-light-gray);
        }
    `}
`

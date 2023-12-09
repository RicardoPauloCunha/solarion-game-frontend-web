import styled, { css } from 'styled-components'
import { InputContainerProps } from '../Input/styles'

interface ContainerProps extends InputContainerProps {

}

export const Container = styled.fieldset<ContainerProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    >label {
        width: 100%;
        margin-bottom: 0;
        padding-left: 2rem;
        position: relative;
        cursor: pointer;

        >input {
            cursor: pointer;
            opacity: 0;
            position: absolute;
            height: 0;
            width: 0;
        }

        >span {
            height: 1.5rem;
            width: 1.5rem;
            background-color: var(--color-white);
            border: 0.15rem solid var(--color-wine);
            border-radius: 0.25rem;
            transition-duration: 300ms;
            position: absolute;
            top: 0;
            left: 0;

            &:after {
                content: "";
                position: absolute;
                display: none;
                left: 0.45rem;
                top: 0.15rem;
                width: 0.45rem;
                height: 0.75rem;
                border: solid var(--color-white);
                border-width: 0 3px 3px 0;
                transform: rotate(45deg);
            }
        }

        >input:checked ~ span {
            background-color: var(--color-wine);
        }

        >input:disabled ~ span {
            background-color: var(--color-light-gray);
        }

        >input:checked ~ span:after {
            display: block;
        }

        &:hover input ~ span {
            background-color: var(--color-wine);

            >input:disabled ~ span {
                background-color: var(--color-gray);
            }
        }
    }

    >strong {
        color: var(--color-red);
    }

    ${({ $hasError }) => $hasError && css`
        >span, >strong {
            font-weight: 600;
        }
    `}

    ${({ $isDisabled }) => $isDisabled && css`
        >label>span {
            background-color: var(--color-light-gray);
        }
    `}
`
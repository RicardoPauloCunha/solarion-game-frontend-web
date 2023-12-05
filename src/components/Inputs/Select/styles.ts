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
        margin-bottom: 0;
    }

    >strong {
        color: var(--color-red);
    }

    ${({ $hasError }) => $hasError && css`
        >label, >strong {
            font-weight: 600;
        }
    `}

    ${({ $isDisabled }) => $isDisabled && css`
        >input {
            background-color: var(--color-light-gray);
        }
    `}
`

export const selectStyles = {
    container: (provided: any) => ({
        ...provided,
        color: 'var(--color-dark-gray)',
        padding: '0',
        borderRadius: '0',
        border: 'none',
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isDisabled ? 'var(--color-light-gray)' : 'var(--color-white)',
        padding: '0.15rem 0 0.15rem 0.9rem',
        borderRadius: '1rem',
        border: 'solid 0.15rem var(--color-wine)',
        boxShadow: 'none',
        color: 'var(--color-dark-gray)',
        fontSize: '1rem',
        outlineColor: 'var(--color-wine)',
        outlineStyle: state.isFocused ? 'solid' : 'none',
        "&:hover": {
            borderColor: 'var(--color-wine)',
        }
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0'
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        color: state.isFocused || state.isSelected ? 'var(--color-white)' : 'var(--color-dark-gray)',
        backgroundColor: state.isFocused || state.isSelected ? 'var(--color-wine)' : 'var(--color-white)',
        transitionDuration: '300ms',
        "&:hover": {
            backgroundColor: 'var(--color-wine)',
        }
    })
}
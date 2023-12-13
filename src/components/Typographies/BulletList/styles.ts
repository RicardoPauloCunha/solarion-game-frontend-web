import styled, { css } from "styled-components"

export type BulletListVariant = 'default' | 'bold'

interface ContainerProps {
    $variant: BulletListVariant
}

export const Container = styled.ul<ContainerProps>`
    width: 100%;
    padding-left: 1rem;
    margin-bottom: 0;
    list-style: none;

    ${({ $variant }) => $variant === 'bold' && css`
        font-weight: 600;
    `}
`
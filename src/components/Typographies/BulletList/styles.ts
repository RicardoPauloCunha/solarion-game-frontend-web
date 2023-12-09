import styled, { css } from "styled-components"

export type BulletListVariant = 'default' | 'bold'

interface ContainerProps {
    $variant: BulletListVariant
}

export const Container = styled.ul<ContainerProps>`
    width: 100%;
    margin-bottom: 0;

    ${({ $variant }) => $variant === 'bold' && css`
        font-weight: 600;
    `}
`
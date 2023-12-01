import styled, { css } from "styled-components";

export type DotListVariant = 'default' | 'bold'

interface ContainerProps {
    $variant: DotListVariant
}

export const Container = styled.ul<ContainerProps>`
    width: 100%;
    margin-bottom: 0;

    ${({ $variant }) => $variant === 'bold' && css`
        font-weight: 600;
    `}
` 
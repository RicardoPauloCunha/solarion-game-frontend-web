import styled, { css } from "styled-components";

interface ContainerProps {
    $menuIsOpen: boolean
}

export const Container = styled.nav<ContainerProps>`
    width: 100%;
    height: auto;
    background-color: var(--color-light-orange);
    padding: 0.75rem 1.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    >div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }

    >svg {
        display: none;
    }

    @media(max-width: 768px) {
        flex-wrap: wrap;

        >svg {
            display: flex;
        }

        >div {
            width: 100%;
            display: none;
            flex-wrap: wrap;
            justify-content: space-around;
            transition-duration: 300ms;

            ${({ $menuIsOpen }) => $menuIsOpen && css`
                display: flex;
            `}
        }
    }
`
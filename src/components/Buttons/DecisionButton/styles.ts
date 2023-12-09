import styled from "styled-components"

export const Container = styled.button`
    width: 100%;
    border: none;
    box-shadow: none;
    background-color: var(--color-light-orange);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0;
    font-weight: 600;
    text-align: left;
    transition-duration: 500ms;

    &:hover, &:active {
        color: var(--color-white);
        background-color: var(--color-wine);
    }

    &:hover {
        opacity: 1;
    }

    &:active {
        transform: scale(0.975);
    }
`
import styled, { keyframes } from "styled-components"

const TextInAnimation = keyframes`
    0%, 80% {
        display: none;
        transform: scale(0.3);
    }

    100% {
        display: flex;
        transform: scale(1);
    }
`

export const Section = styled.section`
    animation: ${TextInAnimation} 2500ms normal 1 forwards ease-in;
`
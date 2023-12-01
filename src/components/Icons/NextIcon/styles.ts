import { FaForward } from 'react-icons/fa';
import styled, { keyframes } from "styled-components";

const movement = keyframes`
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(1rem);
    }
`;


export const Icon = styled(FaForward)`
    font-size: 2rem;
    color: var(--color-wine);
    position: relative;
    left: calc(95% - 1.5rem);
    top: -1rem; 
    margin-bottom: -1rem;
    animation: ${movement} 1s alternate-reverse infinite;
`
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    >div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;

        >strong {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;

            >svg:nth-of-type(1) {
                color: var(--color-wine);
                transition-duration: 1s;
            }
        }
    }
`
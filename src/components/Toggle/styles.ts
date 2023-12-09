import styled from "styled-components"

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    >div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;
    }
`
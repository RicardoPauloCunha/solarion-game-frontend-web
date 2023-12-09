import styled from "styled-components"

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    gap: 2rem;

    >ul {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        >li {
            display: grid;
            grid-template-columns: 1.5rem 1fr 1fr;
            grid-template-rows: auto;
            gap: 1rem;

            >span {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
            }

            >strong {
                text-align: right;
            }
        }
    }
`
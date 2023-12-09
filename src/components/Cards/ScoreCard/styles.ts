import styled from "styled-components"

export const Container = styled.div`
    width: 100%;
    padding: 1.5rem;
    background-color: var(--color-light-orange);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    >div {
        width: 100%;
        display: grid;
        row-gap: 0.5rem;
        column-gap: 1rem;
        grid-template-columns: 11rem 1fr 1fr 1.25rem;
        grid-template-rows: 1.5rem auto;
        grid-template-areas:
            'rate clas date icon'
            'rate deci deci deci';

        >div:nth-of-type(1) {
            grid-area: rate;
        }

        >small:nth-of-type(1) {
            grid-area: clas;
        }

        >small:nth-of-type(2) {
            grid-area: date;
        }

        >svg:nth-of-type(1) {
            grid-area: icon;
            font-size: 1.25rem;
            color: var(--color-red)
        }

        >div:nth-of-type(2) {
            grid-area: deci;
        }
    }

    @media(max-width: 768px) {
        >div {
            row-gap: 1rem;
            grid-template-columns: 1fr 1.25rem;
            grid-template-rows: repeat(4, auto);
            grid-template-areas:
                'rate rate'
                'clas icon'
                'date date'
                'deci deci';
        }
    }
`
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
    padding-bottom: 0.1rem;
    color: var(--color-wine);
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        color: var(--color-wine);
    }
`;
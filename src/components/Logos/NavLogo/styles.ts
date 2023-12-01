import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
    color: var(--color-wine);
    font-weight: 600;
    font-size: 1.25rem;
    text-decoration: none;

    &:hover {
        text-decoration: none;
        color: var(--color-wine);
    }
`;
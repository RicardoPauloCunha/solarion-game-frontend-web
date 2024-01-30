import React from "react"
import { Container } from "./styles"

interface VerticalGroupProps {
    children: React.ReactNode
}

const VerticalGroup = ({
    children
}: VerticalGroupProps) => {
    return (
        <Container
            role="group"
        >
            {children}
        </Container>
    )
}

export default VerticalGroup
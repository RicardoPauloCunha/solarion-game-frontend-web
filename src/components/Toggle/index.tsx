import React, { useState } from 'react'
import ToggleIcon from '../Icons/ToggleIcon'
import { Container } from './styles'

interface ToggleProps {
    text: string
    isOpenDefault?: boolean
    onOpen?: () => void
    preview?: React.ReactNode
    children: React.ReactNode
}

const Toggle = ({
    text,
    isOpenDefault = false,
    onOpen,
    preview,
    children,
}: ToggleProps) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault)

    const handleToggle = () => {
        let open = !isOpen

        setIsOpen(open)

        if (open && onOpen)
            onOpen()
    }

    return (
        <Container>
            <div>
                <strong>{text}</strong>

                <ToggleIcon
                    isOpen={isOpen}
                    onToggle={handleToggle}
                />
            </div>

            {preview && !isOpen && preview}

            {isOpen && children}
        </Container>
    )
}

export default Toggle
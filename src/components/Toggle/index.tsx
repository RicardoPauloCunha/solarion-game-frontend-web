import React, { useEffect, useState } from 'react'
import ToggleIcon from '../Icons/ToggleIcon'
import { Container } from './styles'

interface ToggleProps {
    text: string
    isOpenDefault?: boolean
    closeOnChange?: boolean
    preview?: React.ReactNode
    children: React.ReactNode
}

const Toggle = ({
    text,
    isOpenDefault = false,
    closeOnChange,
    preview,
    children,
}: ToggleProps) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault)

    useEffect(() => {
        if (closeOnChange)
            setIsOpen(false)
    }, [closeOnChange])

    const handleToggle = () => {
        setIsOpen(!isOpen)
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
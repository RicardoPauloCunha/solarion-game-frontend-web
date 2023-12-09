import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Container } from './styles'

interface ToggleIconProps {
    isOpen: boolean
    onToggle: () => void
}

const ToggleIcon = ({
    isOpen,
    onToggle,
}: ToggleIconProps) => {
    return (
        <Container
            onClick={onToggle}
            className="click-animation"
        >
            {isOpen
                ? <>
                    <FaEyeSlash />
                    Esconder
                </> : <>
                    <FaEye />
                    Mostrar
                </>
            }
        </Container>
    )
}

export default ToggleIcon
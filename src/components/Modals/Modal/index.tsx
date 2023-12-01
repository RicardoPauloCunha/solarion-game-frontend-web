import { Modal as BaseModal } from "react-bootstrap"
import { FaTimes } from "react-icons/fa"
import { ModalHeader } from "./styles"

interface DataProps {
    size?: "sm" | "lg" | "xl"
    title: string
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal = ({
    size,
    title,
    isOpen,
    onClose,
    children
}: DataProps) => {
    return (
        <BaseModal
            show={isOpen}
            centered={true}
            size={size}
            onHide={() => onClose()}
        >
            <ModalHeader>
                <h2>{title}</h2>

                <FaTimes
                    onClick={() => onClose()}
                    className="click-animation"
                />
            </ModalHeader>

            {children}
        </BaseModal>
    )
}

export default Modal
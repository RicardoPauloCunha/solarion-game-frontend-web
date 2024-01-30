import Button from "../../Buttons/Button"
import VerticalGroup from "../../Groups/VerticalGroup"
import Modal from "../Modal"
import { Icon } from "./styles"

export interface SuccessModalProps {
    title: string
    messages: string[]
    isOpen: boolean
    onClose: () => void
}

const SuccessModal = ({
    title,
    messages,
    isOpen,
    onClose
}: SuccessModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <Icon />

            <VerticalGroup>
                {messages.map((x, index) => (
                    <p
                        key={index}
                        role="alertdialog"
                    >{x}</p>
                ))}
            </VerticalGroup>

            <Button
                text="Entendi"
                onClick={onClose}
            />
        </Modal>
    )
}

export default SuccessModal
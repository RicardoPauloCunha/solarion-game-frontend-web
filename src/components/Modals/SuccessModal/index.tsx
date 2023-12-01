import { GroupInColumn } from "../../../styles/components"
import Button from "../../Buttons/Button"
import SuccessIcon from "../../Icons/SuccessIcon"
import Modal from "../Modal"

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
            <SuccessIcon />

            <GroupInColumn>
                {messages.map((x, index) => (
                    <p key={index}>{x}</p>
                ))}
            </GroupInColumn>

            <Button
                text="Entendi"
                onClick={onClose}
            />
        </Modal>
    )
}

export default SuccessModal
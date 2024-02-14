import Button from "../../Buttons/Button"
import WarningCard, { WarningData } from "../../Cards/WarningCard"
import VerticalGroup from "../../Groups/VerticalGroup"
import BulletList from "../../Typographies/BulletList"
import Modal from "../Modal"
import { SuccessModalProps } from "../SuccessModal"

interface DeleteModalProps extends SuccessModalProps {
    values: string[]
    warning: WarningData | undefined
    isLoading: boolean
    onConfirm: () => void
}

const DeleteModal = ({
    title,
    messages,
    isOpen,
    onClose,
    values,
    warning,
    isLoading,
    onConfirm
}: DeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <VerticalGroup>
                {messages.map((x, index) => (
                    <p
                        key={index}
                        role="paragraph"
                    >{x}</p>
                ))}
            </VerticalGroup>

            <BulletList
                items={values}
                variant="bold"
            />

            {warning && <WarningCard {...warning} />}

            <Button
                text="Remover"
                onClick={onConfirm}
                isLoading={isLoading}
            />
        </Modal>
    )
}

export default DeleteModal
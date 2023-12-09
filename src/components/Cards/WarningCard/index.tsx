import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa'
import Toggle from "../../Toggle"
import BulletList from "../../Typographies/BulletList"
import { Container, WarningVariant } from "./styles"

export interface WarningData {
    title: string
    message: string
    variant?: WarningVariant
    submessages?: string[]
}

interface WarningCardProps extends WarningData {

}

const WarningCard = ({
    title,
    message,
    submessages,
    variant = 'error',
}: WarningCardProps) => {
    return (
        <Container
            $variant={variant}
        >
            <strong>
                {variant === 'info' && <FaInfoCircle />}
                {variant === 'error' && <FaTimesCircle />}
                {title}
            </strong>

            <p>{message}</p>

            {submessages && submessages.length !== 0 && <Toggle
                text='Detalhes'
            >
                <BulletList
                    items={submessages}
                />
            </Toggle>}
        </Container>
    )
}

export default WarningCard
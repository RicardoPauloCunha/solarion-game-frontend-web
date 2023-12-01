import { FaRegTimesCircle } from "react-icons/fa"
import { ScoreViewModel } from "../../../hooks/api/score"
import Button from "../../Buttons/Button"
import RatingResult from "../../RatingResult"
import Toggle from "../../Toggle"
import Attribute from "../../Typographies/Attribute"
import DotList from "../../Typographies/DotList"
import { Container } from "./styles"

interface ScoreCardProps {
    data: ScoreViewModel,
    isLoading?: boolean,
    onDelete?: () => void
    onSave?: () => void
}

const ScoreCard = ({
    data,
    isLoading,
    onDelete,
    onSave
}: ScoreCardProps) => {
    return (
        <Container
            className="stylized-margin"
        >
            {onSave && <h2>Pontuação da última aventura</h2>}
            {data.userName && <h3>{data.userName}</h3>}

            <div>
                <RatingResult
                    size="small"
                    ratingType={data.ratingType}
                />

                <Attribute
                    field="Classe: "
                    value={data.heroTypeValue}
                />

                <Attribute
                    field="Data: "
                    value={data.creationDate}
                />

                {onDelete && <FaRegTimesCircle
                    onClick={onDelete}
                    className="click-animation"
                />}

                <Toggle
                    text="Decisões:"
                    preview={data.decisions[0]
                        ? (<DotList
                            items={[data.decisions[0].decisionTypeValue + '..']}
                        />)
                        : undefined
                    }
                >
                    <DotList
                        items={data.decisions.map(x => x.decisionTypeValue)}
                    />
                </Toggle>
            </div>

            {onSave && <Button
                text="Salvar"
                onClick={onSave}
                isLoading={isLoading}
            />}
        </Container>
    )
}

export default ScoreCard
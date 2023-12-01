import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Buttons/Button"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import SuccessModal from "../../components/Modals/SuccessModal"
import PageContainer from "../../components/PageContainer"
import RatingResult from "../../components/RatingResult"
import { getAxiosError } from "../../config/axios/error"
import { createScoreApi } from "../../hooks/api/score"
import { ScenarioData, getScenarioStorage, removeScenarioStorage, setScenarioStorage } from "../../hooks/storage/scenario"
import { GroupInColumn } from "../../styles/components"
import { getHeroTypeByDecision } from "../../types/enums/heroType"
import { RatingTypeEnum, getRatingTypeByDecisions, getRatingTypeEnumValue } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { useAuthContext } from "../../hooks/contexts/auth"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"

const DecisionsRating = () => {
    const navigate = useNavigate()

    const {
        loggedUser
    } = useAuthContext()

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)
    const [scenario, setScenario] = useState<ScenarioData | undefined>(undefined)
    const [ratingType, setRatingType] = useState(RatingTypeEnum.None)
    const [ratingTypeValue, setRatingTypeValue] = useState('FFF')

    useEffect(() => {
        getLastScenario()
    }, [])

    const getLastScenario = () => {
        let last = getScenarioStorage()

        if (!last || last.scenarioType !== ScenarioTypeEnum.Finished)
            return


        let rate = getRatingTypeByDecisions(last.decisions)

        setScenario(last)
        setRatingType(rate)
        setRatingTypeValue(getRatingTypeEnumValue(rate))
    }

    const saveScore = async () => {
        if (!loggedUser)
            navigate(DefaultRoutePathEnum.Login)

        if (!scenario)
            return

        setIsLoading(true)
        setWarning(undefined)

        let hero = getHeroTypeByDecision(scenario.decisions[0])

        await createScoreApi({
            ratingType: ratingType,
            heroType: hero,
            decisionTypes: scenario.decisions
        }).then(() => {
            removeScenarioStorage()
            setShowModal(true)
        }).catch(baseError => {
            setWarning(getAxiosError(baseError))
        }).finally(() => setIsLoading(false))
    }

    const handleBackHome = () => {
        navigate(DefaultRoutePathEnum.Home)
    }

    return (
        <PageContainer>
            {ratingType !== RatingTypeEnum.None && <RatingResult
                size="large"
                ratingType={ratingType}
            />}

            <section>
                <p>Você terminou o Cenário com nota '{ratingTypeValue}'.</p>

                {ratingType === RatingTypeEnum.None && <GroupInColumn>
                    <p>...</p>
                    <p>Você ainda não terminou o cenário.</p>
                </GroupInColumn>}

                {warning && <WarningCard {...warning} />}

                <GroupInColumn>
                    {ratingType !== RatingTypeEnum.None && <Button
                        text="Salvar pontuação"
                        onClick={saveScore}
                        isLoading={isLoading}
                    />}

                    <Button
                        text="Voltar ao início"
                        variant="outline"
                        onClick={handleBackHome}
                    />
                </GroupInColumn>
            </section>

            <SuccessModal
                isOpen={showModal}
                onClose={handleBackHome}
                title="Pontuação salva"
                messages={[
                    'A pontuação dessa aventura foi salva com sucesso.',
                    `Acesse 'Minhas pontuações' para visualizar suas aventuras anteriores ou inicie outra aventura.`,
                    'Até a próxima!!'
                ]}
            />
        </PageContainer>
    )
}

export default DecisionsRating
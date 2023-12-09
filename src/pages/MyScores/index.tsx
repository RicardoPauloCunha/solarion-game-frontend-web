import { useEffect, useState } from "react"
import ScoreCard from "../../components/Cards/ScoreCard"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import LoadingText from "../../components/Loadings/LoadingText"
import DeleteModal from "../../components/Modals/DeleteModal"
import PageContainer from "../../components/PageContainer"
import Link from "../../components/Typographies/Link"
import { getAxiosError } from "../../config/axios/error"
import { DecisionViewModel, ScoreViewModel, createScoreApi, deleteScoreApi, listMyScoresApi } from "../../hooks/api/score"
import { getScenarioStorage, removeScenarioStorage } from "../../hooks/storage/scenario"
import { getDecisionTypeEnumValue } from "../../types/enums/decisionType"
import { getHeroTypeByDecision, getHeroTypeEnumValue } from "../../types/enums/heroType"
import { getRatingTypeByDecisions, getRatingTypeEnumValue } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"
import { formatDateToView } from "../../utils/date"

enum LoadingEnum {
    None = 0,
    Get = 1,
    Save = 2,
    Delete = 3
}

const MyScores = () => {
    const [isLoading, setIsLoading] = useState(LoadingEnum.None)
    const [showModal, setShowModal] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)
    const [hasMore, setHasMore] = useState(false)
    const [scoreIndex, setScoreIndex] = useState(-1)
    const [scores, setScores] = useState<ScoreViewModel[]>([])
    const [lastScore, setLastScore] = useState<ScoreViewModel | undefined>(undefined)

    useEffect(() => {
        getScoresData()
        getLastScoreDate()
    }, [])

    const getLastScoreDate = () => {
        let last = getScenarioStorage()

        if (!last || last.scenarioType !== ScenarioTypeEnum.Finished)
            return

        let hero = getHeroTypeByDecision(last.decisions[0])
        let rating = getRatingTypeByDecisions(last.decisions)
        let decisions: DecisionViewModel[] = last.decisions.map(x => ({
            decisionType: x,
            decisionTypeValue: getDecisionTypeEnumValue(x)
        }))

        let score: ScoreViewModel = {
            scoreId: 0,
            creationDate: formatDateToView(last.creationDate),
            heroType: hero,
            heroTypeValue: getHeroTypeEnumValue(hero),
            ratingType: rating,
            ratingTypeValue: getRatingTypeEnumValue(rating),
            decisions,
            userName: ''
        }

        setLastScore(score)
    }

    const getScoresData = async () => {
        setIsLoading(LoadingEnum.Get)

        let page = scores[scores.length - 1]?.scoreId

        await listMyScoresApi({
            page
        }).then(response => {
            setScores([...scores, ...response])

            let more = response.length !== 0 && response.length % 10 === 0

            setHasMore(more)
            setIsLoading(LoadingEnum.None)
        }).catch(() => { })
    }

    const saveScore = async () => {
        if (!lastScore)
            return

        setIsLoading(LoadingEnum.Save)
        setWarning(undefined)

        await createScoreApi({
            ratingType: lastScore.ratingType,
            heroType: lastScore.heroType,
            decisionTypes: lastScore.decisions.map(x => x.decisionType)
        }).then(response => {
            let score = response.result

            handleRemoveLastScore()

            setScores([score, ...scores])
        }).catch(baseError => {
            setWarning(getAxiosError(baseError))
        }).finally(() => setIsLoading(LoadingEnum.None))
    }

    const handleRemoveLastScore = () => {
        removeScenarioStorage()

        setLastScore(undefined)
    }

    const handleSolicitRemoveScore = (index: number) => {
        setScoreIndex(index)
        setWarning(undefined)
        setShowModal(true)
    }

    const handleConfirmRemoveScore = async () => {
        if (scores[scoreIndex]) {
            setIsLoading(LoadingEnum.Delete)
            setWarning(undefined)

            let index = scoreIndex

            await deleteScoreApi(scores[scoreIndex].scoreId).then(() => {
                scores.splice(index, 1)

                setScores([...scores])
                handleCloseModal()
            }).catch(baseError => {
                setWarning(getAxiosError(baseError))
            }).finally(() => setIsLoading(LoadingEnum.None))

        }
        else if (scoreIndex === -1 && lastScore) {
            handleRemoveLastScore()
            handleCloseModal()
        }
    }

    const handleCloseModal = () => {
        setScoreIndex(-1)
        setWarning(undefined)
        setShowModal(false)
    }

    return (
        <PageContainer>
            {lastScore && <article className="list-cards">
                <ScoreCard
                    data={lastScore}
                    onDelete={() => handleSolicitRemoveScore(-1)}
                    onSave={saveScore}
                    isLoading={isLoading === LoadingEnum.Save}
                />

                {warning && !showModal && <WarningCard {...warning} />}
            </article>}

            <section>
                <h1>Minhas pontuações</h1>

                <LoadingText
                    isLoading={isLoading === LoadingEnum.Get}
                    loadingText="Carregando lista de pontuações..."
                />
            </section>

            <article className="list-cards">
                {scores.map((x, index) => (
                    <ScoreCard
                        key={x.scoreId}
                        data={x}
                        onDelete={() => handleSolicitRemoveScore(index)}
                    />
                ))}

                {scores.length === 0 && isLoading !== LoadingEnum.Get && <WarningCard
                    title="Nenhuma pontuação encontrada"
                    message="Nenhuma pontuação das suas aventuras foram encontradas."
                    variant="info"
                />}
            </article>

            {hasMore && <section>
                <LoadingText
                    isLoading={isLoading === LoadingEnum.Get}
                    loadingText="Carregando mais pontuações..."
                />

                {isLoading !== LoadingEnum.Get && <Link
                    text="Exibir mais"
                    to={DefaultRoutePathEnum.MyScores}
                    onClick={getScoresData}
                />}
            </section>}

            <DeleteModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmRemoveScore}
                title="Remover pontuação"
                messages={[
                    'Tem certeza que deseja remover a pontuação?'
                ]}
                values={scores[scoreIndex]
                    ? [
                        scores[scoreIndex].ratingTypeValue,
                        scores[scoreIndex].heroTypeValue,
                        scores[scoreIndex].creationDate,
                    ]
                    : scoreIndex === -1 && lastScore
                        ? [
                            lastScore.ratingTypeValue,
                            lastScore.heroTypeValue,
                            lastScore.creationDate,
                        ]
                        : []
                }
                warning={showModal ? warning : undefined}
                isLoading={isLoading === LoadingEnum.Delete}
            />
        </PageContainer>
    )
}

export default MyScores
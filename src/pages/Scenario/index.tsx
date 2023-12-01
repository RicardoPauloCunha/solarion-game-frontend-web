import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DecisionButton from "../../components/Buttons/DecisionButton"
import NextIcon from "../../components/Icons/NextIcon"
import PageContainer from "../../components/PageContainer"
import { DecisionViewModel } from "../../hooks/api/score"
import { getScenarioStorage, setScenarioStorage } from "../../hooks/storage/scenario"
import { DecisionTypeEnum, listDecisionByScenario } from "../../types/enums/decisionType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum, getNextScenarioType, getScenarioTypeEnumValue, getScenarioTypeImage } from "../../types/enums/scenarioType"

const Scenario = () => {
    const navigate = useNavigate()

    const [scenarioType, setScenarioType] = useState(ScenarioTypeEnum.None)
    const [img, setImg] = useState('')
    const [text, setText] = useState('...')
    const [hasDecisions, setHasDecisions] = useState(true)
    const [decisions, setDecisions] = useState<DecisionViewModel[]>([])
    const [selectedDecisionTypes, setSelectedDecisionTypes] = useState<DecisionTypeEnum[]>([])

    useEffect(() => {
        getLastScenario()
    }, [])

    useEffect(() => {
        setHasDecisions(decisions.length !== 0)
    }, [decisions])

    useEffect(() => {
        if (scenarioType !== ScenarioTypeEnum.None)
            saveScenario(scenarioType)
    }, [scenarioType])

    const getLastScenario = () => {
        let last = getScenarioStorage()

        if (last?.scenarioType === ScenarioTypeEnum.Finished) {
            navigate(DefaultRoutePathEnum.DecisionsRating)
        }
        if (last) {
            defineScene(last.scenarioType)
            setSelectedDecisionTypes(last.decisions)
        }
        else {
            handleInitScene()
        }
    }

    const defineScene = (scenarioType: ScenarioTypeEnum) => {
        setScenarioType(scenarioType)
        setImg(getScenarioTypeImage(scenarioType))
        setText(getScenarioTypeEnumValue(scenarioType))
        setDecisions(listDecisionByScenario(scenarioType))
    }

    const saveScenario = (type: ScenarioTypeEnum) => {
        setScenarioStorage({
            scenarioType: type,
            decisions: selectedDecisionTypes,
            creationDate: new Date()
        })
    }

    const handleInitScene = () => {
        let type = ScenarioTypeEnum.CH1_ACT2_DEC

        defineScene(type)
    }

    const handleNextScene = (decisionType?: DecisionTypeEnum) => {
        if (scenarioType === ScenarioTypeEnum.CH8_AC3)
            decisionType = selectedDecisionTypes[0]

        let nextType = getNextScenarioType(scenarioType, decisionType)

        if (nextType === ScenarioTypeEnum.Finished) {
            saveScenario(nextType)

            navigate(DefaultRoutePathEnum.DecisionsRating)
        }
        else {
            defineScene(nextType)
    		window.scrollTo(0, 0)
        }
    }

    const handleSelectDecision = (decisionType: DecisionTypeEnum) => {
        setSelectedDecisionTypes([...selectedDecisionTypes, decisionType])

        handleNextScene(decisionType)
    }

    return (
        <PageContainer>
            <img
                className="stylized-margin"
                src={img}
                alt="Imagem do cenário do capítulo atual."
            />

            <section
                onClick={hasDecisions ? undefined : () => handleNextScene()}
                className={hasDecisions ? '' : 'select-cursor-pointer'}
            >
                <p>{text}</p>

                {hasDecisions
                    ? <div>
                        {decisions.map(x => (
                            <DecisionButton
                                key={x.decisionType}
                                text={x.decisionTypeValue}
                                onClick={() => handleSelectDecision(x.decisionType)}
                            />
                        ))}
                    </div>
                    : <NextIcon />
                }
            </section>
        </PageContainer>
    )
}

export default Scenario
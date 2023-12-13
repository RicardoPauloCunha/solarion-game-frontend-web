import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CH1TableImg from '../../assets/images/ch1-table.png'
import DecisionButton from "../../components/Buttons/DecisionButton"
import NextIcon from "../../components/Icons/NextIcon"
import PageContainer from "../../components/PageContainer"
import { DecisionViewModel } from "../../hooks/api/score"
import { getScenarioStorage, setScenarioStorage } from "../../hooks/storage/scenario"
import { DecisionTypeEnum } from "../../types/enums/decisionType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum, getNextScenarioType, getScenarioTypeEnumValue, getScenarioTypeImage, listDecisionByScenario } from "../../types/enums/scenarioType"
import { delay } from "../../utils/timer"
import { Image, ImageAnimationEnum, Section, TextAnimationEnum } from './styles'

const Scenario = () => {
    const navigate = useNavigate()

    const [scenarioType, setScenarioType] = useState(ScenarioTypeEnum.None)
    const [selectedDecisionTypes, setSelectedDecisionTypes] = useState<DecisionTypeEnum[]>([])
    const [img, setImg] = useState(CH1TableImg)
    const [text, setText] = useState('')
    const [decisions, setDecisions] = useState<DecisionViewModel[]>([])
    const [hasDecisions, setHasDecisions] = useState(true)
    const [imageAnimation, setImageAnimation] = useState(ImageAnimationEnum.None)
    const [textAnimation, setTextAnimation] = useState(TextAnimationEnum.None)

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
            setSelectedDecisionTypes(last.decisions)
            defineScene(last.scenarioType)
        }
        else {
            handleInitScene()
        }
    }

    const defineScene = async (scenarioType: ScenarioTypeEnum) => {
        setTextAnimation(TextAnimationEnum.Out)

        setScenarioType(scenarioType)

        let nextImg = getScenarioTypeImage(scenarioType)

        if (nextImg !== img) {
            await delay(500)
            setImageAnimation(ImageAnimationEnum.OutToIn)
            await delay(1000)

            setImg(nextImg)

            await delay(500)
        }

        await delay(500)
        setTextAnimation(TextAnimationEnum.In)

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

    const handleNextScene = async (decisionType?: DecisionTypeEnum) => {
        if (scenarioType === ScenarioTypeEnum.CH8_AC3)
            decisionType = selectedDecisionTypes[0]

        let nextType = getNextScenarioType(scenarioType, decisionType)

        if (nextType === ScenarioTypeEnum.Finished) {
            setTextAnimation(TextAnimationEnum.Out)

            await delay(500)
            setImageAnimation(ImageAnimationEnum.Out)
            await delay(1000)

            saveScenario(nextType)

            navigate(DefaultRoutePathEnum.DecisionsRating)
        }
        else {
            window.scrollTo(0, 0)
            defineScene(nextType)
        }
    }

    const handleSelectDecision = (decisionType: DecisionTypeEnum) => {
        setSelectedDecisionTypes([...selectedDecisionTypes, decisionType])

        handleNextScene(decisionType)
    }

    const handleImageAnimationEnd = () => {
        if (imageAnimation === ImageAnimationEnum.Out)
            return

        setImageAnimation(ImageAnimationEnum.None)
    }

    const handleTextAnimationEnd = () => {
        if (textAnimation === TextAnimationEnum.Out)
            return

        setTextAnimation(TextAnimationEnum.None)
    }

    return (
        <PageContainer>
            <Image
                src={img}
                className="stylized-margin"
                alt="Cenários do jogo 'Solarion Chronicles: The Game' no evento do Sebastian (Stardew Valley)."
                $imageAnimation={imageAnimation}
                onAnimationEnd={handleImageAnimationEnd}
            />

            {text && <Section
                onClick={hasDecisions ? undefined : () => handleNextScene()}
                className={hasDecisions ? '' : 'select-cursor-pointer'}
                $textAnimation={textAnimation}
                onAnimationEnd={handleTextAnimationEnd}
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
            </Section>}
        </PageContainer>
    )
}

export default Scenario
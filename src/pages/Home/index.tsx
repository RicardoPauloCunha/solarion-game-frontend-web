import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CH1TableImg from '../../assets/images/ch1-table.png'
import Button from "../../components/Buttons/Button"
import VerticalGroup from "../../components/Groups/VerticalGroup"
import Modal from "../../components/Modals/Modal"
import PageContainer from "../../components/PageContainer"
import Toggle from "../../components/Toggle"
import Attribute from "../../components/Typographies/Attribute"
import BulletList from "../../components/Typographies/BulletList"
import { ScenarioData, getScenarioStorage, removeScenarioStorage } from "../../hooks/storage/scenario"
import { getDecisionTypeEnumValue } from "../../types/enums/decisionType"
import { getHeroTypeByDecision, getHeroTypeEnumValue } from "../../types/enums/heroType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"
import { formatDateToView } from "../../utils/date"

const Home = () => {
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
    const [scenario, setScenario] = useState<ScenarioData | undefined>(undefined)
    const [heroTypeValue, setHeroTypeValue] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [decisionTypesValue, setDecisionTypesValue] = useState<string[]>([])

    useEffect(() => {
        getLastScenario()
    }, [])

    const getLastScenario = () => {
        let last = getScenarioStorage()

        if (!last || last.scenarioType === ScenarioTypeEnum.Finished)
            return

        let hero = getHeroTypeEnumValue(getHeroTypeByDecision(last.decisions[0]))
        let date = formatDateToView(last.creationDate)
        let values = last.decisions.map(x => getDecisionTypeEnumValue(x))

        setScenario(last)
        setHeroTypeValue(hero)
        setCreationDate(date)
        setDecisionTypesValue(values)
    }

    const handlePlay = () => {
        handleRemoveContinuation()

        navigate(DefaultRoutePathEnum.Scenario)
    }

    const handleContinue = () => {
        setShowModal(true)
    }

    const handleConfirmContinue = () => {
        navigate(DefaultRoutePathEnum.Scenario)
    }

    const handleRemoveContinuation = () => {
        removeScenarioStorage()

        setScenario(undefined)
        setHeroTypeValue('')
        setCreationDate('')
        setDecisionTypesValue([])
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <PageContainer>
            <img
                className="stylized-margin"
                src={CH1TableImg}
                alt="Mesa com jogo 'Solarion Chronicles: The Game' no quarto do Sebastian (Stardew Valley)."
            />

            <section>
                <h1>Solarion Chronicles: The Game</h1>

                <p>Huum... Parece que a missão de hoje nos levará à Torre do Necromante... para tentar recuperar o Cajado de Solarion das garras de Xarth, o Senhor do Terror.</p>

                <VerticalGroup>
                    <Button
                        text='Novo jogo'
                        onClick={handlePlay}
                    />

                    <Button
                        text='Continuar jogando'
                        variant='outline'
                        onClick={handleContinue}
                    />
                </VerticalGroup>
            </section>

            <Modal
                title="Continuar jogando"
                isOpen={showModal}
                onClose={handleCloseModal}
            >
                {scenario
                    ? <>
                        <p>O progresso da sua última aventura foi salvo.</p>

                        <VerticalGroup>
                            <Attribute
                                field="Classe:"
                                value={heroTypeValue}
                            />

                            <Attribute
                                field="Data:"
                                value={creationDate}
                            />

                            {decisionTypesValue.length !== 0 && <Toggle
                                text="Decisões:"
                                preview={<BulletList
                                    items={[decisionTypesValue[0] + '..']}
                                />}
                            >
                                <BulletList
                                    items={decisionTypesValue}
                                />
                            </Toggle>}
                        </VerticalGroup>

                        <VerticalGroup>
                            <Button
                                text="Continuar"
                                onClick={handleConfirmContinue}
                            />

                            <Button
                                text="Remover"
                                variant="outline"
                                onClick={handleRemoveContinuation}
                            />
                        </VerticalGroup>
                    </>
                    : <>
                        <p>Nenhum registro da sua última aventura foi encontrado.</p>

                        <Button
                            text='Nova aventura'
                            onClick={handlePlay}
                        />
                    </>}
            </Modal>
        </PageContainer>
    )
}

export default Home
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Home from "."
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { DecisionTypeEnum, getDecisionTypeEnumValue } from "../../types/enums/decisionType"
import { getHeroTypeByDecision, getHeroTypeEnumValue } from "../../types/enums/heroType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"
import { formatDateToView } from "../../utils/date"

const mockGetScenarioStorage = jest.spyOn(scenarioStorageFile, "getScenarioStorage")
const mockRemoveScenarioStorage = jest.spyOn(scenarioStorageFile, "removeScenarioStorage")
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateScenario = (options?: {
    hasNoDecisions?: boolean
}) => {
    return {
        scenarioType: ScenarioTypeEnum.CH2_ACT1,
        decisions: options?.hasNoDecisions ? [] : [DecisionTypeEnum.CH1_ACT2_DEC_Warrior],
        creationDate: new Date()
    }
}

const renderPage = async (options?: {
    hasLastScenario?: boolean,
    hasNoDecisions?: boolean,
    openModal?: boolean,
}) => {
    const scenario = generateScenario({ hasNoDecisions: options?.hasNoDecisions })

    if (options?.hasLastScenario)
        mockGetScenarioStorage.mockReturnValue(scenario)

    render(<Home />, { wrapper: BrowserRouter })

    if (options?.openModal) {
        const continuePlayingButton = screen.getByRole('button', { name: 'Continuar jogando' })
        await userEvent.click(continuePlayingButton)
    }

    return {
        scenario
    }
}

describe('Home Page', () => {
    it('should render the home page', async () => {
        await renderPage()

        const navbar = screen.getByRole('menubar')
        const image = screen.getByAltText("Mesa com jogo 'Solarion Chronicles: The Game' no quarto do Sebastian (Stardew Valley).")
        const header = screen.getByRole('heading', { name: 'Solarion Chronicles: The Game' })
        const text = screen.getByText('Huum... Parece que a missão de hoje nos levará à Torre do Necromante... para tentar recuperar o Cajado de Solarion das garras de Xarth, o Senhor do Terror.')
        const newGameButton = screen.getByRole('button', { name: 'Novo jogo' })
        const continuePlayingButton = screen.getByRole('button', { name: 'Continuar jogando' })
        const modalTitle = screen.queryByRole('heading', { name: 'Continuar jogando' })

        expect(navbar).toBeInTheDocument()
        expect(image).toBeInTheDocument()
        expect(header).toBeInTheDocument()
        expect(text).toBeInTheDocument()
        expect(newGameButton).toBeInTheDocument()
        expect(continuePlayingButton).toBeInTheDocument()
        expect(modalTitle).toBeNull()
    })

    describe('when click in new game button', () => {
        it('should call removeScenarioStorage function', async () => {
            await renderPage()

            const newGameButton = screen.getByRole('button', { name: 'Novo jogo' })
            await userEvent.click(newGameButton)

            expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
        })

        it('should call navigate function to scenario page', async () => {
            await renderPage()

            const newGameButton = screen.getByRole('button', { name: 'Novo jogo' })
            await userEvent.click(newGameButton)

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scenario)
        })
    })

    describe('when click in continue button', () => {
        it('should open the modal', async () => {
            await renderPage({
                openModal: true
            })

            const modalTitle = screen.getByRole('heading', { name: 'Continuar jogando' })

            expect(modalTitle).toBeInTheDocument()
        })
    })

    describe('when open the modal', () => {
        describe('and when no last scenario', () => {
            it('should open a empty modal', async () => {
                await renderPage({
                    openModal: true
                })

                const text = screen.getByText('Nenhum registro da sua última aventura foi encontrado.')
                const newAdventureButton = screen.getByRole('button', { name: 'Nova aventura' })

                expect(text).toBeInTheDocument()
                expect(newAdventureButton).toBeInTheDocument()
            })

            describe('and when click in new adventure button', () => {
                it('should call removeScenarioStorage function', async () => {
                    await renderPage({
                        openModal: true
                    })

                    const newAdventureButton = screen.getByRole('button', { name: 'Nova aventura' })
                    await userEvent.click(newAdventureButton)

                    expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                })

                it('should call navigate function to scenario page', async () => {
                    await renderPage({
                        openModal: true
                    })

                    const newAdventureButton = screen.getByRole('button', { name: 'Nova aventura' })
                    await userEvent.click(newAdventureButton)

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scenario)
                })
            })
        })

        describe('and when have last scenario', () => {
            it('should show the last scenario', async () => {
                const { scenario } = await renderPage({
                    hasLastScenario: true,
                    openModal: true
                })

                const text = screen.getByText('O progresso da sua última aventura foi salvo.')
                const hero = screen.getByText(getHeroTypeEnumValue(getHeroTypeByDecision(scenario.decisions[0])))
                const date = screen.getByText(formatDateToView(scenario.creationDate))
                const decisionsPreview = screen.getByText(`\u2022 ${getDecisionTypeEnumValue(scenario.decisions[0])}..`)
                const continueButton = screen.getByRole('button', { name: 'Continuar' })
                const removeButton = screen.getByRole('button', { name: 'Remover' })

                expect(text).toBeInTheDocument()
                expect(hero).toBeInTheDocument()
                expect(date).toBeInTheDocument()
                expect(decisionsPreview).toBeInTheDocument()
                expect(continueButton).toBeInTheDocument()
                expect(removeButton).toBeInTheDocument()
            })

            describe('and when no decisions', () => {
                it('should not show the decisions field', async () => {
                    await renderPage({
                        hasLastScenario: true,
                        hasNoDecisions: true,
                        openModal: true
                    })

                    const field = screen.queryByText('Decisões:')
                    const preview = screen.queryByRole('list')

                    expect(field).toBeNull()
                    expect(preview).toBeNull()
                })
            })

            describe('and when click in continue button', () => {
                it('should call navigate function to scenario page', async () => {
                    await renderPage({
                        hasLastScenario: true,
                        openModal: true
                    })

                    const continueButton = screen.getByRole('button', { name: 'Continuar' })
                    await userEvent.click(continueButton)

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scenario)
                })
            })

            describe('and when click in remove button', () => {
                it('should empty the modal', async () => {
                    await renderPage({
                        hasLastScenario: true,
                        openModal: true
                    })

                    const removeButton = screen.getByRole('button', { name: 'Remover' })
                    await userEvent.click(removeButton)

                    const textOff = screen.queryByText('O progresso da sua última aventura foi salvo.')
                    const continueButtonOff = screen.queryByRole('button', { name: 'Continuar' })

                    expect(textOff).toBeNull()
                    expect(continueButtonOff).toBeNull()

                    const textOn = screen.getByText('Nenhum registro da sua última aventura foi encontrado.')
                    const newAdventureButtonOn = screen.getByRole('button', { name: 'Nova aventura' })

                    expect(textOn).toBeInTheDocument()
                    expect(newAdventureButtonOn).toBeInTheDocument()
                })

                it('should call removeScenarioStorage function', async () => {
                    await renderPage({
                        hasLastScenario: true,
                        openModal: true
                    })

                    const removeButton = screen.getByRole('button', { name: 'Remover' })
                    await userEvent.click(removeButton)

                    expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                })
            })
        })
    })
})
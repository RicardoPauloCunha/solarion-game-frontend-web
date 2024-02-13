import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Home from "."
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { ScenarioData } from "../../hooks/storage/scenario"
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

const generateLastScenario = (options?: {
    hasNoDecisions?: boolean
}): ScenarioData => {
    return {
        scenarioType: ScenarioTypeEnum.CH2_ACT1,
        decisions: options?.hasNoDecisions ? [] : [DecisionTypeEnum.CH1_ACT2_DEC_Warrior],
        creationDate: new Date()
    }
}

const LAST_SCENARIO = generateLastScenario()

const renderPage = async (options?: {
    lastScenario?: ScenarioData,
    openContinuePlayingModal?: boolean,
}) => {
    if (options?.lastScenario)
        mockGetScenarioStorage.mockReturnValue(options?.lastScenario)

    render(<Home />, { wrapper: BrowserRouter })

    if (options?.openContinuePlayingModal) {
        const continuePlayingButton = screen.getByRole('button', { name: 'Continuar jogando' })
        await userEvent.click(continuePlayingButton)
    }
}

// TODO: Test with scenario finished

describe('Home Page', () => {
    it('should render the home page', async () => {
        await renderPage()

        const navbar = screen.getByRole('menubar')
        const image = screen.getByAltText("Mesa com jogo 'Solarion Chronicles: The Game' no quarto do Sebastian (Stardew Valley).")
        const header = screen.getByRole('heading', { name: 'Solarion Chronicles: The Game' })
        const text = screen.getByText('Huum... Parece que a missão de hoje nos levará à Torre do Necromante... para tentar recuperar o Cajado de Solarion das garras de Xarth, o Senhor do Terror.')
        const newGameButton = screen.getByRole('button', { name: 'Novo jogo' })
        const continuePlayingButton = screen.getByRole('button', { name: 'Continuar jogando' })
        const modal = screen.queryByRole('dialog')

        expect(navbar).toBeInTheDocument()
        expect(image).toBeInTheDocument()
        expect(header).toBeInTheDocument()
        expect(text).toBeInTheDocument()
        expect(newGameButton).toBeInTheDocument()
        expect(continuePlayingButton).toBeInTheDocument()
        expect(modal).toBeNull()
    })

    describe('when click on new game button', () => {
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

    describe('when click on continue button', () => {
        it('should open the modal', async () => {
            await renderPage({
                openContinuePlayingModal: true
            })

            const modal = screen.getByRole('dialog')
            const modalTitle = within(modal).getByRole('heading', { name: 'Continuar jogando' })

            expect(modal).toBeInTheDocument()
            expect(modalTitle).toBeInTheDocument()
        })
    })

    describe('when modal is open', () => {
        describe('and when no last scenario', () => {
            it('should render a empty warning', async () => {
                await renderPage({
                    openContinuePlayingModal: true
                })

                const modal = screen.getByRole('dialog')
                const text = within(modal).getByText('Nenhum registro da sua última aventura foi encontrado.')
                const newAdventureButton = within(modal).getByRole('button', { name: 'Nova aventura' })

                expect(text).toBeInTheDocument()
                expect(newAdventureButton).toBeInTheDocument()
            })

            describe('and when click on new adventure button', () => {
                it('should call removeScenarioStorage function', async () => {
                    await renderPage({
                        openContinuePlayingModal: true
                    })

                    const modal = screen.getByRole('dialog')
                    const newAdventureButton = within(modal).getByRole('button', { name: 'Nova aventura' })
                    await userEvent.click(newAdventureButton)

                    expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                })

                it('should call navigate function to scenario page', async () => {
                    await renderPage({
                        openContinuePlayingModal: true
                    })

                    const modal = screen.getByRole('dialog')
                    const newAdventureButton = within(modal).getByRole('button', { name: 'Nova aventura' })
                    await userEvent.click(newAdventureButton)

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scenario)
                })
            })
        })

        describe('and when have last scenario', () => {
            it('should show the last scenario', async () => {
                await renderPage({
                    lastScenario: LAST_SCENARIO,
                    openContinuePlayingModal: true,
                })

                const modal = screen.getByRole('dialog')
                const text = within(modal).getByText('O progresso da sua última aventura foi salvo.')
                const hero = within(modal).getByText(getHeroTypeEnumValue(getHeroTypeByDecision(LAST_SCENARIO.decisions[0])))
                const date = within(modal).getByText(formatDateToView(LAST_SCENARIO.creationDate))
                const decisionsPreview = within(modal).getByText(`\u2022 ${getDecisionTypeEnumValue(LAST_SCENARIO.decisions[0])}..`)
                const continueButton = within(modal).getByRole('button', { name: 'Continuar' })
                const removeButton = within(modal).getByRole('button', { name: 'Remover' })

                expect(text).toBeInTheDocument()
                expect(hero).toBeInTheDocument()
                expect(date).toBeInTheDocument()
                expect(decisionsPreview).toBeInTheDocument()
                expect(continueButton).toBeInTheDocument()
                expect(removeButton).toBeInTheDocument()
            })

            describe('and when no decisions', () => {
                it('should not show the decisions field', async () => {
                    const lastScenario = generateLastScenario({ hasNoDecisions: true })

                    await renderPage({
                        openContinuePlayingModal: true,
                        lastScenario,
                    })

                    const modal = screen.getByRole('dialog')
                    const field = within(modal).queryByText('Decisões:')
                    const preview = within(modal).queryByRole('list')

                    expect(field).toBeNull()
                    expect(preview).toBeNull()
                })
            })

            describe('and when click on continue button', () => {
                it('should call navigate function to scenario page', async () => {
                    await renderPage({
                        lastScenario: LAST_SCENARIO,
                        openContinuePlayingModal: true,
                    })

                    const modal = screen.getByRole('dialog')
                    const continueButton = within(modal).getByRole('button', { name: 'Continuar' })
                    await userEvent.click(continueButton)

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scenario)
                })
            })

            describe('and when click on remove button', () => {
                it('should empty the modal', async () => {
                    await renderPage({
                        lastScenario: LAST_SCENARIO,
                        openContinuePlayingModal: true,
                    })

                    const modal = screen.getByRole('dialog')
                    const removeButton = within(modal).getByRole('button', { name: 'Remover' })
                    await userEvent.click(removeButton)

                    const textOff = within(modal).queryByText('O progresso da sua última aventura foi salvo.')
                    const continueButtonOff = within(modal).queryByRole('button', { name: 'Continuar' })

                    expect(textOff).toBeNull()
                    expect(continueButtonOff).toBeNull()

                    const textOn = within(modal).getByText('Nenhum registro da sua última aventura foi encontrado.')
                    const newAdventureButtonOn = within(modal).getByRole('button', { name: 'Nova aventura' })

                    expect(textOn).toBeInTheDocument()
                    expect(newAdventureButtonOn).toBeInTheDocument()
                })

                it('should call removeScenarioStorage function', async () => {
                    await renderPage({
                        lastScenario: LAST_SCENARIO,
                        openContinuePlayingModal: true,
                    })

                    const modal = screen.getByRole('dialog')
                    const removeButton = within(modal).getByRole('button', { name: 'Remover' })
                    await userEvent.click(removeButton)

                    expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                })
            })
        })
    })
})
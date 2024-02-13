import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import DecisionsRating from "."
import { createAxiosError } from "../../config/axios/error"
import * as scoreApiFile from "../../hooks/api/score"
import { ScoreViewModel } from "../../hooks/api/score"
import { AuthContext, AuthContextData, LoggedUserData } from "../../hooks/contexts/auth"
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { ScenarioData } from "../../hooks/storage/scenario"
import { getHeroTypeByDecision } from "../../types/enums/heroType"
import { getRatingTypeByDecisions } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"
import { UserTypeEnum } from "../../types/enums/userType"
import * as timerUtilsFile from "../../utils/timer"

const mockTimer = jest.spyOn(timerUtilsFile, 'delay')
const mockGetScenarioStorage = jest.spyOn(scenarioStorageFile, 'getScenarioStorage')
const mockRemoveScenarioStorage = jest.spyOn(scenarioStorageFile, "removeScenarioStorage")
const mockCreateScoreApi = jest.spyOn(scoreApiFile, 'createScoreApi')
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateLoggedUser = (userType: UserTypeEnum): LoggedUserData => {
    return {
        userId: 1,
        name: 'User name',
        userType
    }
}

const generateLastScenario = (options?: {
    finished?: boolean
}): ScenarioData => {
    return options?.finished
        ? {
            scenarioType: ScenarioTypeEnum.Finished,
            decisions: [2, 5, 11, 16],
            creationDate: new Date()
        } : {
            scenarioType: ScenarioTypeEnum.CH2_ACT3,
            decisions: [1],
            creationDate: new Date()
        }
}

const generateRatingMessage = (ratingTypeValue: string) => `Você terminou o Cenário com nota '${ratingTypeValue}'.`

const IMAGE_ALT_TEXT = 'Reação do gato ao ver sua pontuação.'
const LAST_SCENARIO_FINISHED = generateLastScenario({ finished: true })
const COMMON_USER = generateLoggedUser(UserTypeEnum.Common)
const ERROR_MESSAGE = 'Error message.'

const renderPage = async (options?: {
    loggedUser?: LoggedUserData,
    lastScenario?: ScenarioData,
    saveLastScenario?: boolean
    mockFailCreateScoreApi?: boolean,
}) => {
    mockTimer.mockResolvedValue(new Promise(res => setTimeout(res, 0)))

    if (options?.mockFailCreateScoreApi) {
        mockCreateScoreApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockCreateScoreApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: {} as unknown as ScoreViewModel
        })
    }

    if (options?.lastScenario)
        mockGetScenarioStorage.mockReturnValue(options.lastScenario)

    render(<AuthContext.Provider
        value={{
            loggedUser: options?.loggedUser,
        } as unknown as AuthContextData}
    >
        <DecisionsRating />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    if (options?.saveLastScenario) {
        const startAgainButton = screen.getByRole('button', { name: 'Salvar pontuação' })
        await userEvent.click(startAgainButton)
    }
}

// TODO: Test when is admin

describe('DecisionsRating Page', () => {
    describe('when no last scenario', () => {
        it('should not render the content', async () => {
            await renderPage({
                lastScenario: undefined
            })

            const image = screen.queryByAltText(IMAGE_ALT_TEXT)
            const text = screen.queryByText(generateRatingMessage(''))
            const buttons = screen.queryAllByRole('button')

            expect(image).toBeNull()
            expect(text).toBeNull()
            expect(buttons).toHaveLength(0)
        })
    })

    describe('when have last scenario', () => {
        describe('and when not finished', () => {
            it('should not render the content', async () => {
                const lastScenario = generateLastScenario()

                await renderPage({
                    lastScenario
                })

                const image = screen.queryByAltText(IMAGE_ALT_TEXT)
                const text = screen.queryByText(generateRatingMessage(''))
                const buttons = screen.queryAllByRole('button')

                expect(image).toBeNull()
                expect(text).toBeNull()
                expect(buttons).toHaveLength(0)
            })
        })

        describe('and when finished', () => {
            it('should render the decisions rating page', async () => {
                await renderPage({
                    lastScenario: LAST_SCENARIO_FINISHED
                })

                const image = screen.getByAltText(IMAGE_ALT_TEXT)
                const text = screen.getByText(generateRatingMessage('D'))
                const saveScoreButton = screen.getByRole('button', { name: 'Salvar pontuação' })
                const startAgainButton = screen.getByRole('button', { name: 'Voltar ao início' })
                const warning = screen.queryByRole('alert')
                const modal = screen.queryByRole('dialog')

                expect(image).toBeInTheDocument()
                expect(text).toBeInTheDocument()
                expect(saveScoreButton).toBeInTheDocument()
                expect(startAgainButton).toBeInTheDocument()
                expect(warning).toBeNull()
                expect(modal).toBeNull()
            })

            describe('and when click on start again', () => {
                it('should call navigate function to home page', async () => {
                    await renderPage({
                        lastScenario: LAST_SCENARIO_FINISHED
                    })

                    const startAgainButton = screen.getByRole('button', { name: 'Voltar ao início' })
                    await userEvent.click(startAgainButton)

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Home)
                })
            })

            describe('and when click on save score', () => {
                describe('and when no logged user', () => {
                    it('should call navigate function to login page', async () => {
                        await renderPage({
                            loggedUser: undefined,
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        expect(mockNavigate).toHaveBeenCalledTimes(1)
                        expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login)
                    })

                    it('should not call createScoreApi request', async () => {
                        await renderPage({
                            loggedUser: undefined,
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        expect(mockCreateScoreApi).not.toHaveBeenCalled()
                    })
                })

                describe('and when logged user', () => {
                    it('should call createScoreApi request', async () => {
                        await renderPage({
                            loggedUser: COMMON_USER,
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        const ratingType = getRatingTypeByDecisions(LAST_SCENARIO_FINISHED.decisions)
                        const heroType = getHeroTypeByDecision(LAST_SCENARIO_FINISHED.decisions[0])

                        expect(mockCreateScoreApi).toHaveBeenCalledTimes(1)
                        expect(mockCreateScoreApi).toHaveBeenCalledWith({
                            ratingType,
                            heroType,
                            decisionTypes: LAST_SCENARIO_FINISHED.decisions
                        })
                    })

                    describe('and when createScoreApi request succeeds', () => {
                        it('should call removeScenarioStorage function', async () => {
                            await renderPage({
                                loggedUser: COMMON_USER,
                                lastScenario: LAST_SCENARIO_FINISHED,
                                saveLastScenario: true,
                            })

                            expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                        })

                        it('should open success modal', async () => {
                            const texts = [
                                'A pontuação dessa aventura foi salva com sucesso.',
                                `Acesse 'Minhas pontuações' para visualizar suas aventuras anteriores ou inicie outra aventura.`,
                                'Até a próxima!!'
                            ]

                            await renderPage({
                                loggedUser: COMMON_USER,
                                lastScenario: LAST_SCENARIO_FINISHED,
                                saveLastScenario: true,
                            })

                            const modal = screen.getByRole('dialog')
                            const modalTitle = within(modal).getByRole('heading', { name: 'Pontuação salva' })
                            const modalMessageTexts = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
                            const modalButton = within(modal).getByRole('button', { name: 'Entendi' })

                            expect(modal).toBeInTheDocument()
                            expect(modalTitle).toBeInTheDocument()
                            expect(modalMessageTexts).toEqual(texts)
                            expect(modalButton).toBeInTheDocument()
                        })
                    })

                    describe('and when createScoreApi request fails', () => {
                        it('should show a warning with the error', async () => {
                            await renderPage({
                                loggedUser: COMMON_USER,
                                lastScenario: LAST_SCENARIO_FINISHED,
                                saveLastScenario: true,
                                mockFailCreateScoreApi: true
                            })

                            const warning = screen.getByRole('alert')
                            const warningMessage = screen.getByText(ERROR_MESSAGE)

                            expect(warning).toBeInTheDocument()
                            expect(warningMessage).toBeInTheDocument()
                        })
                    })
                })
            })
        })
    })

    describe('when success modal is open', () => {
        describe('and when click on modal button', () => {
            it('should call navigate function to home page', async () => {
                await renderPage({
                    loggedUser: COMMON_USER,
                    lastScenario: LAST_SCENARIO_FINISHED,
                    saveLastScenario: true,
                })

                const modal = screen.getByRole('dialog')
                const modalButton = within(modal).getByRole('button', { name: 'Entendi' })
                await userEvent.click(modalButton)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Home)
            })
        })

        describe('and when click to close the modal', () => {
            it('should call navigate function to home page', async () => {
                await renderPage({
                    loggedUser: COMMON_USER,
                    lastScenario: LAST_SCENARIO_FINISHED,
                    saveLastScenario: true,
                })

                const modal = screen.getByRole('dialog')
                const closeIcon = within(modal).getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeIcon)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Home)
            })
        })
    })
})
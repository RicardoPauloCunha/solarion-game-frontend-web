import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import MyScores from "."
import { createAxiosError } from "../../config/axios/error"
import { defineValidatorErrorDictionary } from "../../config/validator/dictionary"
import * as scoreApiFile from "../../hooks/api/score"
import { ScoreViewModel } from "../../hooks/api/score"
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { getDecisionTypeEnumValue } from "../../types/enums/decisionType"
import { HeroTypeEnum, getHeroTypeByDecision, getHeroTypeEnumValue } from "../../types/enums/heroType"
import { RatingTypeEnum, getRatingTypeByDecisions, getRatingTypeEnumValue } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"
import { formatDateToView } from "../../utils/date"

const mockListMyScoresApi = jest.spyOn(scoreApiFile, 'listMyScoresApi')
const mockDeleteScoreApi = jest.spyOn(scoreApiFile, 'deleteScoreApi')
const mockCreateScoreApi = jest.spyOn(scoreApiFile, 'createScoreApi')
const mockGetScenarioStorage = jest.spyOn(scenarioStorageFile, "getScenarioStorage")
const mockRemoveScenarioStorage = jest.spyOn(scenarioStorageFile, "removeScenarioStorage")
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateScores = (options?: {
    getMore1?: boolean,
    newScore?: boolean
}): ScoreViewModel[] => {
    let list = [
        {
            scoreId: 11,
            creationDate: "10:46 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14]
        },
        {
            scoreId: 10,
            creationDate: "10:38 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.C,
            decisions: [3, 5, 11, 19]
        },
        {
            scoreId: 9,
            creationDate: "10:36 13/12/2023",
            heroType: HeroTypeEnum.Healer,
            ratingType: RatingTypeEnum.C,
            decisions: [2, 5, 11, 17]
        },
        {
            scoreId: 8,
            creationDate: "10:33 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14]
        },
        {
            scoreId: 7,
            creationDate: "10:26 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.C,
            decisions: [1, 5, 11, 15]
        },
        {
            scoreId: 6,
            creationDate: "09:00 13/12/2023",
            heroType: HeroTypeEnum.Healer,
            ratingType: RatingTypeEnum.D,
            decisions: [2, 5, 11, 16]
        },
        {
            scoreId: 5,
            creationDate: "08:57 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.C,
            decisions: [3, 5, 11, 19]
        },
        {
            scoreId: 4,
            creationDate: "08:56 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14]
        },
        {
            scoreId: 3,
            creationDate: "08:55 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.C,
            decisions: [1, 5, 11, 15]
        },
        {
            scoreId: 2,
            creationDate: "08:50 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.A,
            decisions: [3, 4, 6, 9, 10, 13, 19]
        }
    ]

    if (options?.getMore1) {
        list = [{
            scoreId: 1,
            creationDate: "08:45 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.A,
            decisions: [3, 4, 6, 9, 10, 13, 19]
        }]
    }
    else if (options?.newScore) {
        list = [{
            scoreId: 12,
            creationDate: "11:46 13/12/2023",
            heroType: HeroTypeEnum.Healer,
            ratingType: RatingTypeEnum.D,
            decisions: [2, 5, 11, 16]
        }]
    }

    return list.map(x => ({
        scoreId: x.scoreId,
        creationDate: x.creationDate,
        heroType: x.heroType,
        heroTypeValue: getHeroTypeEnumValue(x.heroType),
        ratingType: x.ratingType,
        ratingTypeValue: getRatingTypeEnumValue(x.ratingType),
        decisions: x.decisions.map(y => ({
            decisionType: y,
            decisionTypeValue: getDecisionTypeEnumValue(y)
        })),
        userName: ""
    }))
}

const generateScenario = (options?: {
    finished?: boolean
}) => {
    return {
        scenarioType: options?.finished ? ScenarioTypeEnum.Finished : ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2,
        decisions: options?.finished ? [2, 5, 11, 16] : [2, 5, 11],
        creationDate: new Date()
    }
}

const scores = generateScores()
const moreScores = generateScores({ getMore1: true })
const newScore = generateScores({ newScore: true })[0]
const scenario = generateScenario({ finished: true })

const renderPage = async (options?: {
    mockSuccessfulListMyScoresApi?: boolean,
    mockFailListMyScoresApi?: boolean,
    hasEmptyListScoreCards?: boolean,
    waitInitialLoadingFinish?: boolean,
    getMoreScoreCards?: boolean,
    mockSuccessfulListMyScoresApiWhenGetMore?: boolean,
    mockFailListMyScoresApiWhenGetMore?: boolean,
    hasEmptyListScoreCardsWhenGetMore?: boolean,
    openDeleteModalToScoreCardIndex?: number,
    confirmScoreDeletion?: boolean,
    mockSuccessfulDeleteScoreApi?: boolean,
    mockFailDeleteScoreApi?: boolean,
    hasFinishedScenario?: boolean,
    openDeleteModalToFinishedScenario?: boolean,
    confirmFinishedScenarioDeletion?: boolean,
    saveFinishedScenario?: boolean
    mockSuccessfulCreateScoreApi?: boolean,
    mockFailCreateScoreApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulListMyScoresApi)
        mockListMyScoresApi.mockResolvedValueOnce(options?.hasEmptyListScoreCards ? [] : scores)
    else if (options?.mockFailListMyScoresApi)
        mockListMyScoresApi.mockRejectedValueOnce(createAxiosError(400, errorMessage))

    if (options?.mockSuccessfulListMyScoresApiWhenGetMore)
        mockListMyScoresApi.mockResolvedValue(options?.hasEmptyListScoreCardsWhenGetMore ? [] : moreScores)
    else if (options?.mockFailListMyScoresApiWhenGetMore)
        mockListMyScoresApi.mockRejectedValue(createAxiosError(400, errorMessage))

    if (options?.mockSuccessfulDeleteScoreApi) {
        mockDeleteScoreApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    } else if (options?.mockFailDeleteScoreApi) {
        mockDeleteScoreApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    if (options?.mockSuccessfulCreateScoreApi) {
        mockCreateScoreApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: newScore
        })
    } else if (options?.mockFailCreateScoreApi) {
        mockCreateScoreApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    if (options?.hasFinishedScenario)
        mockGetScenarioStorage.mockReturnValue(scenario)

    waitFor(() => {
        render(<MyScores />, { wrapper: BrowserRouter })
    })

    if (options?.waitInitialLoadingFinish) {
        await waitFor(() => {
            const loadingText = screen.queryByText('Carregando lista de pontuações...')

            expect(loadingText).toBeNull()
        })
    }

    if (options?.getMoreScoreCards) {
        const getMoreLink = screen.getByRole('link', { name: 'Exibir mais' })
        await userEvent.click(getMoreLink)
    }

    if (options?.openDeleteModalToScoreCardIndex !== undefined) {
        const scoreCard = screen.getAllByLabelText('Cartão da pontuação')[options.openDeleteModalToScoreCardIndex]

        const removeScoreIcon = within(scoreCard).getByRole('deletion')
        await userEvent.click(removeScoreIcon)
    }

    if (options?.openDeleteModalToFinishedScenario) {
        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
        const saveCardTitle = within(saveCard).getByRole('heading', { name: 'Pontuação da última aventura' })

        expect(saveCardTitle).toBeInTheDocument()

        const removeScoreIcon = within(saveCard).getByRole('deletion')
        await userEvent.click(removeScoreIcon)
    }

    if (options?.confirmScoreDeletion || options?.confirmFinishedScenarioDeletion) {
        const modal = screen.getByRole('dialog')
        const button = within(modal).getByRole('button', { name: 'Remover' })
        await userEvent.click(button)
    }

    if (options?.saveFinishedScenario) {
        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
        const saveCardTitle = within(saveCard).getByRole('heading', { name: 'Pontuação da última aventura' })

        expect(saveCardTitle).toBeInTheDocument()

        const saveButton = within(saveCard).getByRole('button', { name: 'Salvar' })
        await userEvent.click(saveButton)
    }

    return {
        errorMessage
    }
}

// TODO: Test loading when click to get more scores

describe('MyScores Page', () => {
    it('should render my scores page', async () => {
        await renderPage({
            mockSuccessfulListMyScoresApi: true
        })

        const saveCardTitle = screen.queryByRole('heading', { name: 'Pontuação da última aventura' })
        const warning = screen.queryByRole('alert')
        const title = screen.getByRole('heading', { name: 'Minhas pontuações' })
        const loadingText = screen.getByText('Carregando lista de pontuações...')
        const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')
        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })
        const modal = screen.queryByRole('dialog')

        expect(saveCardTitle).toBeNull()
        expect(warning).toBeNull()
        expect(title).toBeInTheDocument()
        expect(loadingText).toBeInTheDocument()
        expect(scoreCards).toHaveLength(0)
        expect(getMoreLink).toBeNull()
        expect(modal).toBeNull()
    })

    describe('when listMyScoresApi request succeeds', () => {
        it('should not render the loading message', async () => {
            await renderPage({
                mockSuccessfulListMyScoresApi: true
            })

            await waitFor(() => {
                const loadingText = screen.queryByText('Carregando lista de pontuações...')

                expect(loadingText).toBeNull()
            })
        })

        describe('and when have scores', () => {
            it(`should render a list with 10 score cards`, async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true
                })

                const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                expect(scoreCards).toHaveLength(scores.length)
            })

            it(`should not render an empty list warning`, async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true
                })

                const warning = screen.queryByRole('alert')
                const emptyListMessage = screen.queryByText('Nenhuma pontuação das suas aventuras foram encontradas.')

                expect(warning).toBeNull()
                expect(emptyListMessage).toBeNull()
            })

            it('should render a get more link', async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true
                })

                const getMoreLink = screen.getByRole('link', { name: 'Exibir mais' })

                expect(getMoreLink).toBeInTheDocument()
            })
        })

        describe('and when no scores', () => {
            it(`should not render a list of score cards`, async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    hasEmptyListScoreCards: true,
                    waitInitialLoadingFinish: true,
                })

                const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')

                expect(scoreCards).toHaveLength(0)
            })

            it(`should render an empty list warning`, async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    hasEmptyListScoreCards: true,
                    waitInitialLoadingFinish: true
                })

                const warning = screen.getByRole('alert')
                const emptyListMessage = within(warning).getByText('Nenhuma pontuação das suas aventuras foram encontradas.')

                expect(warning).toBeInTheDocument()
                expect(emptyListMessage).toBeInTheDocument()
            })

            it('should not render a get more link', async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    hasEmptyListScoreCards: true,
                    waitInitialLoadingFinish: true
                })

                const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                expect(getMoreLink).toBeNull()
            })
        })
    })

    describe('when listMyScoresApi request fails', () => {
        it('should render the loading message', async () => {
            await renderPage({
                mockFailListMyScoresApi: true
            })

            const loadingText = screen.getByText('Carregando lista de pontuações...')

            expect(loadingText).toBeInTheDocument()
        })
    })

    describe('when click to get more score cards', () => {
        it('should call navigate function to my scores page', async () => {
            await renderPage({
                mockSuccessfulListMyScoresApi: true,
                waitInitialLoadingFinish: true,
                getMoreScoreCards: true,
                mockSuccessfulListMyScoresApiWhenGetMore: true
            })

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores, expect.anything())
        })

        it('should call listMyScoresApi request again', async () => {
            const page = scores[scores.length - 1]?.scoreId

            await renderPage({
                mockSuccessfulListMyScoresApi: true,
                waitInitialLoadingFinish: true,
                getMoreScoreCards: true,
                mockSuccessfulListMyScoresApiWhenGetMore: true
            })

            expect(mockListMyScoresApi).toHaveBeenCalledTimes(2)
            expect(mockListMyScoresApi).toHaveBeenLastCalledWith({
                page
            })
        })

        describe('and when listMyScoresApi re request succeeds', () => {
            it('should not render the loading messages', async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true,
                    getMoreScoreCards: true,
                    mockSuccessfulListMyScoresApiWhenGetMore: true
                })

                await waitFor(() => {
                    const loadingText = screen.queryByText('Carregando lista de pontuações...')
                    const getMoreLoadingText = screen.queryByText('Carregando mais pontuações...')

                    expect(loadingText).toBeNull()
                    expect(getMoreLoadingText).toBeNull()
                })
            })

            describe('and when have scores', () => {
                it(`should render a list with 11 score cards`, async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        getMoreScoreCards: true,
                        mockSuccessfulListMyScoresApiWhenGetMore: true
                    })

                    await waitFor(() => {
                        const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                        expect(scoreCards).toHaveLength(scores.length + 1)
                    })
                })

                describe('and when the total of new score cards is less than 10', () => {
                    it('should not render a get more link', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            getMoreScoreCards: true,
                            mockSuccessfulListMyScoresApiWhenGetMore: true
                        })

                        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                        expect(getMoreLink).toBeNull()
                    })
                })
            })

            describe('and when no scores', () => {
                it(`should render a list with 10 score cards`, async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        getMoreScoreCards: true,
                        mockSuccessfulListMyScoresApiWhenGetMore: true,
                        hasEmptyListScoreCardsWhenGetMore: true
                    })

                    await waitFor(() => {
                        const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                        expect(scoreCards).toHaveLength(scores.length)
                    })
                })

                it('should not render a get more link', async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        getMoreScoreCards: true,
                        mockSuccessfulListMyScoresApiWhenGetMore: true,
                        hasEmptyListScoreCardsWhenGetMore: true
                    })

                    const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                    expect(getMoreLink).toBeNull()
                })
            })
        })

        describe('and when listMyScoresApi re request fails', () => {
            it('should render the loading messages', async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true,
                    getMoreScoreCards: true,
                    mockFailListMyScoresApiWhenGetMore: true
                })

                const loadingText = screen.getByText('Carregando lista de pontuações...')
                const getMoreLoadingText = screen.getByText('Carregando mais pontuações...')

                expect(loadingText).toBeInTheDocument()
                expect(getMoreLoadingText).toBeInTheDocument()
            })
        })
    })

    describe('when click to remove a score card', () => {
        it('should open the delete modal', async () => {
            const scoreCardIndex = 0

            await renderPage({
                mockSuccessfulListMyScoresApi: true,
                waitInitialLoadingFinish: true,
                openDeleteModalToScoreCardIndex: scoreCardIndex
            })

            const modal = screen.getByRole('dialog')
            const modalTitle = within(modal).getByRole('heading', { name: 'Remover pontuação' })
            const messageGroup = within(modal).getByRole('group')
            const messagesText = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
            const messagesTextData = [
                'Tem certeza que deseja remover a pontuação?'
            ]
            const valueList = within(modal).getByRole('list')
            const button = within(modal).getByRole('button', { name: 'Remover' })

            expect(modal).toBeInTheDocument()
            expect(modalTitle).toBeInTheDocument()
            expect(messageGroup).toBeInTheDocument()
            expect(messagesText).toEqual(messagesTextData)
            expect(valueList).toBeInTheDocument()
            expect(button).toBeInTheDocument()
        })
    })

    describe('when delete modal is open', () => {
        it.each([
            0,
            4,
            9
        ])('should render the main values of the score with index %p', async (scoreCardIndex) => {
            await renderPage({
                mockSuccessfulListMyScoresApi: true,
                waitInitialLoadingFinish: true,
                openDeleteModalToScoreCardIndex: scoreCardIndex
            })

            const modal = screen.getByRole('dialog')
            const valuesText = within(modal).getAllByRole('listitem').map(x => x.textContent)
            const valuesTextData = ([
                scores[scoreCardIndex].ratingTypeValue,
                scores[scoreCardIndex].heroTypeValue,
                scores[scoreCardIndex].creationDate,
            ]).map(x => `\u2022 ${x}`)

            expect(valuesText).toEqual(valuesTextData)
        })

        describe('and when click in the main button', () => {
            it('should call deleteScoreApi request', async () => {
                const scoreCardIndex = 0

                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true,
                    openDeleteModalToScoreCardIndex: scoreCardIndex,
                    confirmScoreDeletion: true,
                    mockSuccessfulDeleteScoreApi: true
                })

                expect(mockDeleteScoreApi).toHaveBeenCalledTimes(1)
                expect(mockDeleteScoreApi).toHaveBeenCalledWith(scores[scoreCardIndex].scoreId)
            })

            describe('and when deleteScoreApi request succeeds', () => {
                it.each([
                    0,
                    4,
                    9
                ])('should remove the score from the list', async (scoreCardIndex) => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                        mockSuccessfulDeleteScoreApi: true
                    })

                    const scoreCards = screen.getAllByLabelText('Cartão da pontuação')
                    const removedScoreDate = screen.queryByText(scores[scoreCardIndex].creationDate)

                    expect(scoreCards).toHaveLength(scores.length - 1)
                    expect(removedScoreDate).toBeNull()
                })

                it('should close the modal', async () => {
                    const scoreCardIndex = 0

                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                        mockSuccessfulDeleteScoreApi: true
                    })

                    const modal = screen.queryByRole('dialog')

                    expect(modal).toBeNull()
                })
            })

            describe('and when deleteScoreApi request fails', () => {
                it('should show a warning with the error', async () => {
                    const scoreCardIndex = 0

                    const props = await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                        mockFailDeleteScoreApi: true
                    })

                    const modal = screen.getByRole('dialog')
                    const modalWarning = within(modal).getByRole('alert')
                    const modalWarningMessage = within(modal).getByText(props.errorMessage)

                    expect(modalWarning).toBeInTheDocument()
                    expect(modalWarningMessage).toBeInTheDocument()
                })
            })
        })

        describe('and when click to close the modal', () => {
            it('should close the modal', async () => {
                const scoreCardIndex = 0

                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true,
                    openDeleteModalToScoreCardIndex: scoreCardIndex
                })

                const modalOn = screen.getByRole('dialog')
                const closeIcon = within(modalOn).getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeIcon)

                const modalOff = screen.queryByRole('dialog')

                expect(modalOff).toBeNull()
            })
        })
    })

    describe('when have last scenario', () => {
        describe('and when not finished', () => {
            it('should not render the save card', async () => {
                const scenarioNotFinished = generateScenario({ finished: false })

                mockGetScenarioStorage.mockReturnValue(scenarioNotFinished)

                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true
                })

                const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                expect(saveCardTitle).toBeNull()
            })
        })

        describe('and when finished', () => {
            it('should render the save card', async () => {
                await renderPage({
                    mockSuccessfulListMyScoresApi: true,
                    waitInitialLoadingFinish: true,
                    hasFinishedScenario: true,
                })

                const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                const saveCardTitle = within(saveCard).getByRole('heading', { name: 'Pontuação da última aventura' })
                const saveCardButton = within(saveCard).getByRole('button', { name: 'Salvar' })

                expect(saveCardTitle).toBeInTheDocument()
                expect(saveCardButton).toBeInTheDocument()
            })

            describe('and when click to remove', () => {
                it('should open the delete modal', async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        hasFinishedScenario: true,
                        openDeleteModalToFinishedScenario: true
                    })

                    const modal = screen.getByRole('dialog')

                    expect(modal).toBeInTheDocument()
                })
            })

            describe('and when delete modal is open', () => {
                it('should render the main values of the save card', async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        hasFinishedScenario: true,
                        openDeleteModalToFinishedScenario: true
                    })

                    const modal = screen.getByRole('dialog')
                    const valuesText = within(modal).getAllByRole('listitem').map(x => x.textContent)

                    const ratingType = getRatingTypeEnumValue(getRatingTypeByDecisions(scenario.decisions))
                    const heroType = getHeroTypeEnumValue(getHeroTypeByDecision(scenario.decisions[0]))
                    const creationDate = formatDateToView(scenario.creationDate)
                    const valuesTextData = ([
                        ratingType,
                        heroType,
                        creationDate,
                    ]).map(x => `\u2022 ${x}`)

                    expect(valuesText).toEqual(valuesTextData)
                })

                describe('and when click in the main button', () => {
                    it('should call removeScenarioStorage function', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            openDeleteModalToFinishedScenario: true,
                            confirmFinishedScenarioDeletion: true
                        })

                        expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                    })

                    it('should hide the save card', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            openDeleteModalToFinishedScenario: true,
                            confirmFinishedScenarioDeletion: true
                        })

                        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                        const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                        expect(saveCardTitle).toBeNull()
                    })

                    it('should close the modal', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            openDeleteModalToFinishedScenario: true,
                            confirmFinishedScenarioDeletion: true
                        })

                        const modal = screen.queryByRole('dialog')

                        expect(modal).toBeNull()
                    })
                })
            })

            describe('and when click to save', () => {
                it('should call createScoreApi request', async () => {
                    await renderPage({
                        mockSuccessfulListMyScoresApi: true,
                        waitInitialLoadingFinish: true,
                        hasFinishedScenario: true,
                        saveFinishedScenario: true,
                        mockSuccessfulCreateScoreApi: true
                    })

                    const ratingType = getRatingTypeByDecisions(scenario.decisions)
                    const heroType = getHeroTypeByDecision(scenario.decisions[0])

                    expect(mockCreateScoreApi).toHaveBeenCalledTimes(1)
                    expect(mockCreateScoreApi).toHaveBeenCalledWith({
                        ratingType,
                        heroType,
                        decisionTypes: scenario.decisions
                    })
                })

                describe('and when createScoreApi request succeeds', () => {
                    it('should call removeScenarioStorage function', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            saveFinishedScenario: true,
                            mockSuccessfulCreateScoreApi: true
                        })

                        expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                    })

                    it('should hide the save card', async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            saveFinishedScenario: true,
                            mockSuccessfulCreateScoreApi: true
                        })

                        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                        const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                        expect(saveCardTitle).toBeNull()
                    })

                    it(`should render a list with 11 score cards`, async () => {
                        await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            saveFinishedScenario: true,
                            mockSuccessfulCreateScoreApi: true
                        })

                        await waitFor(() => {
                            const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                            expect(scoreCards).toHaveLength(scores.length + 1)
                        })
                    })
                })

                describe('and when createScoreApi request fails', () => {
                    it('should show a warning with the error', async () => {
                        const props = await renderPage({
                            mockSuccessfulListMyScoresApi: true,
                            waitInitialLoadingFinish: true,
                            hasFinishedScenario: true,
                            saveFinishedScenario: true,
                            mockFailCreateScoreApi: true
                        })

                        const warning = screen.getByRole('alert')
                        const warningMessage = screen.getByText(props.errorMessage)

                        expect(warning).toBeInTheDocument()
                        expect(warningMessage).toBeInTheDocument()
                    })
                })
            })
        })
    })
})
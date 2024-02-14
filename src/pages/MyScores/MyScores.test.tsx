import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import MyScores from "."
import { createAxiosError } from "../../config/axios/error"
import { defineValidatorErrorDictionary } from "../../config/validator/dictionary"
import * as scoreApiFile from "../../hooks/api/score"
import { ScoreViewModel } from "../../hooks/api/score"
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { ScenarioData } from "../../hooks/storage/scenario"
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

const generateLastScenario = (options?: {
    finished?: boolean
}): ScenarioData => {
    return options?.finished
        ? {
            scenarioType: ScenarioTypeEnum.Finished,
            decisions: [2, 5, 11, 16],
            creationDate: new Date()
        } : {
            scenarioType: ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2,
            decisions: [2, 5, 11],
            creationDate: new Date()
        }
}

const SCORES = generateScores()
const MORE_SCORES = generateScores({ getMore1: true })
const NEW_SCORE = generateScores({ newScore: true })[0]
const LAST_SCENARIO_FINISHED = generateLastScenario({ finished: true })
const ERROR_MESSAGE = 'Error message.'

const renderPage = async (options?: {
    scores?: ScoreViewModel[],
    moreScores?: ScoreViewModel[],
    lastScenario?: ScenarioData,
    mockFailListMyScoresApi?: boolean,
    skipInitialLoading?: boolean,
    getMoreScoreCards?: boolean,
    mockFailListMyScoresApiWhenGetMore?: boolean,
    openDeleteModalToScoreCardIndex?: number,
    confirmScoreDeletion?: boolean,
    mockFailDeleteScoreApi?: boolean,
    openDeleteModalToLastScenario?: boolean,
    confirmLastScenarioDeletion?: boolean,
    saveLastScenario?: boolean
    mockFailCreateScoreApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    if (options?.mockFailListMyScoresApi)
        mockListMyScoresApi.mockRejectedValueOnce(createAxiosError(400, ERROR_MESSAGE))
    else
        mockListMyScoresApi.mockResolvedValueOnce(options?.scores ? options?.scores : SCORES)

    if (options?.mockFailListMyScoresApiWhenGetMore)
        mockListMyScoresApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    else
        mockListMyScoresApi.mockResolvedValue(options?.moreScores ? options?.moreScores : MORE_SCORES)

    if (options?.mockFailDeleteScoreApi) {
        mockDeleteScoreApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockDeleteScoreApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }

    if (options?.mockFailCreateScoreApi) {
        mockCreateScoreApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockCreateScoreApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: NEW_SCORE
        })
    }

    if (options?.lastScenario)
        mockGetScenarioStorage.mockReturnValue(options?.lastScenario)

    waitFor(() => {
        render(<MyScores />, { wrapper: BrowserRouter })
    })

    if (!options?.skipInitialLoading) {
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

    if (options?.saveLastScenario || options?.openDeleteModalToLastScenario) {
        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
        const saveCardTitle = within(saveCard).getByRole('heading', { name: 'Pontuação da última aventura' })

        expect(saveCardTitle).toBeInTheDocument()

        if (options?.saveLastScenario) {
            const saveButton = within(saveCard).getByRole('button', { name: 'Salvar' })
            await userEvent.click(saveButton)
        }

        if (options?.openDeleteModalToLastScenario) {
            const removeScoreIcon = within(saveCard).getByRole('deletion')
            await userEvent.click(removeScoreIcon)
        }
    }

    if (options?.confirmScoreDeletion || options?.confirmLastScenarioDeletion) {
        const modal = screen.getByRole('dialog')
        const button = within(modal).getByRole('button', { name: 'Remover' })
        await userEvent.click(button)
    }
}

// TODO: Test loading when click to get more scores
// TODO: Test if the scenario show correct values

describe('MyScores Page', () => {
    it('should render my scores page', async () => {
        await renderPage({
            skipInitialLoading: true
        })

        const title = screen.getByRole('heading', { name: 'Minhas pontuações' })
        const loadingText = screen.getByText('Carregando lista de pontuações...')
        const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')
        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })
        const saveCardTitle = screen.queryByRole('heading', { name: 'Pontuação da última aventura' })
        const warning = screen.queryByRole('alert')
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
                skipInitialLoading: true
            })

            await waitFor(() => {
                const loadingText = screen.queryByText('Carregando lista de pontuações...')

                expect(loadingText).toBeNull()
            })
        })

        describe('and when have scores', () => {
            it(`should render a list with 10 score cards`, async () => {
                await renderPage()

                const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                expect(scoreCards).toHaveLength(SCORES.length)
            })

            it(`should not render an empty list warning`, async () => {
                await renderPage()

                const warning = screen.queryByRole('alert')
                const emptyListMessage = screen.queryByText('Nenhuma pontuação das suas aventuras foram encontradas.')

                expect(warning).toBeNull()
                expect(emptyListMessage).toBeNull()
            })

            it('should render a get more link', async () => {
                await renderPage()

                const getMoreLink = screen.getByRole('link', { name: 'Exibir mais' })

                expect(getMoreLink).toBeInTheDocument()
            })
        })

        describe('and when no scores', () => {
            it(`should not render a list of score cards`, async () => {
                await renderPage({
                    scores: [],
                })

                const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')

                expect(scoreCards).toHaveLength(0)
            })

            it(`should render an empty list warning`, async () => {
                await renderPage({
                    scores: [],
                })

                const warning = screen.getByRole('alert')
                const emptyListMessage = within(warning).getByText('Nenhuma pontuação das suas aventuras foram encontradas.')

                expect(warning).toBeInTheDocument()
                expect(emptyListMessage).toBeInTheDocument()
            })

            it('should not render a get more link', async () => {
                await renderPage({
                    scores: [],
                })

                const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                expect(getMoreLink).toBeNull()
            })
        })
    })

    describe('when listMyScoresApi request fails', () => {
        it('should render the loading message', async () => {
            await renderPage({
                skipInitialLoading: true,
                mockFailListMyScoresApi: true,
            })

            const loadingText = screen.getByText('Carregando lista de pontuações...')

            expect(loadingText).toBeInTheDocument()
        })
    })

    describe('when click to get more score cards', () => {
        it('should call navigate function to my scores page', async () => {
            await renderPage({
                getMoreScoreCards: true,
            })

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores, expect.anything())
        })

        it('should call listMyScoresApi request again', async () => {
            const page = SCORES[SCORES.length - 1]?.scoreId

            await renderPage({
                getMoreScoreCards: true,
            })

            expect(mockListMyScoresApi).toHaveBeenCalledTimes(2)
            expect(mockListMyScoresApi).toHaveBeenLastCalledWith({
                page
            })
        })

        describe('and when listMyScoresApi re request succeeds', () => {
            it('should not render the loading messages', async () => {
                await renderPage({
                    getMoreScoreCards: true,
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
                        getMoreScoreCards: true,
                    })

                    await waitFor(() => {
                        const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                        expect(scoreCards).toHaveLength(SCORES.length + 1)
                    })
                })

                describe('and when the total of new score cards is less than 10', () => {
                    it('should not render a get more link', async () => {
                        await renderPage({
                            getMoreScoreCards: true,
                        })

                        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                        expect(getMoreLink).toBeNull()
                    })
                })
            })

            describe('and when no scores', () => {
                it(`should render a list with 10 score cards`, async () => {
                    await renderPage({
                        moreScores: [],
                        getMoreScoreCards: true,
                    })

                    await waitFor(() => {
                        const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                        expect(scoreCards).toHaveLength(SCORES.length)
                    })
                })

                it('should not render a get more link', async () => {
                    await renderPage({
                        moreScores: [],
                        getMoreScoreCards: true,
                    })

                    const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                    expect(getMoreLink).toBeNull()
                })
            })
        })

        describe('and when listMyScoresApi re request fails', () => {
            it('should render the loading messages', async () => {
                await renderPage({
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
            const texts = [
                'Tem certeza que deseja remover a pontuação?'
            ]

            await renderPage({
                openDeleteModalToScoreCardIndex: scoreCardIndex
            })

            const modal = screen.getByRole('dialog')
            const modalTitle = within(modal).getByRole('heading', { name: 'Remover pontuação' })
            const messageGroup = within(modal).getByRole('group')
            const messageTexts = within(modal).getAllByRole('paragraph').map(x => x.textContent)
            const valueList = within(modal).getByRole('list')
            const button = within(modal).getByRole('button', { name: 'Remover' })

            expect(modal).toBeInTheDocument()
            expect(modalTitle).toBeInTheDocument()
            expect(messageGroup).toBeInTheDocument()
            expect(messageTexts).toEqual(texts)
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
            const texts = ([
                SCORES[scoreCardIndex].ratingTypeValue,
                SCORES[scoreCardIndex].heroTypeValue,
                SCORES[scoreCardIndex].creationDate,
            ]).map(x => `\u2022 ${x}`)

            await renderPage({
                openDeleteModalToScoreCardIndex: scoreCardIndex
            })

            const modal = screen.getByRole('dialog')
            const valueTexts = within(modal).getAllByRole('listitem').map(x => x.textContent)

            expect(valueTexts).toEqual(texts)
        })

        describe('and when click on the main button', () => {
            it('should call deleteScoreApi request', async () => {
                const scoreCardIndex = 0

                await renderPage({
                    openDeleteModalToScoreCardIndex: scoreCardIndex,
                    confirmScoreDeletion: true,
                })

                expect(mockDeleteScoreApi).toHaveBeenCalledTimes(1)
                expect(mockDeleteScoreApi).toHaveBeenCalledWith(SCORES[scoreCardIndex].scoreId)
            })

            describe('and when deleteScoreApi request succeeds', () => {
                it.each([
                    0,
                    4,
                    9
                ])('should remove the score from the list', async (scoreCardIndex) => {
                    await renderPage({
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                    })

                    const scoreCards = screen.getAllByLabelText('Cartão da pontuação')
                    const removedScoreDate = screen.queryByText(SCORES[scoreCardIndex].creationDate)

                    expect(scoreCards).toHaveLength(SCORES.length - 1)
                    expect(removedScoreDate).toBeNull()
                })

                it('should close the modal', async () => {
                    const scoreCardIndex = 0

                    await renderPage({
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                    })

                    const modal = screen.queryByRole('dialog')

                    expect(modal).toBeNull()
                })
            })

            describe('and when deleteScoreApi request fails', () => {
                it('should show a warning with the error', async () => {
                    const scoreCardIndex = 0

                    await renderPage({
                        openDeleteModalToScoreCardIndex: scoreCardIndex,
                        confirmScoreDeletion: true,
                        mockFailDeleteScoreApi: true
                    })

                    const modal = screen.getByRole('dialog')
                    const modalWarning = within(modal).getByRole('alert')
                    const modalWarningMessage = within(modal).getByText(ERROR_MESSAGE)

                    expect(modalWarning).toBeInTheDocument()
                    expect(modalWarningMessage).toBeInTheDocument()
                })
            })
        })

        describe('and when click to close the modal', () => {
            it('should close the modal', async () => {
                const scoreCardIndex = 0

                await renderPage({
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
                const lastScenario = generateLastScenario()

                await renderPage({
                    lastScenario,
                })

                const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                expect(saveCardTitle).toBeNull()
            })
        })

        describe('and when finished', () => {
            it('should render the save card', async () => {
                await renderPage({
                    lastScenario: LAST_SCENARIO_FINISHED,
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
                        lastScenario: LAST_SCENARIO_FINISHED,
                        openDeleteModalToLastScenario: true
                    })

                    const modal = screen.getByRole('dialog')

                    expect(modal).toBeInTheDocument()
                })
            })

            describe('and when delete modal is open', () => {
                it('should render the main values of the save card', async () => {
                    const ratingType = getRatingTypeEnumValue(getRatingTypeByDecisions(LAST_SCENARIO_FINISHED.decisions))
                    const heroType = getHeroTypeEnumValue(getHeroTypeByDecision(LAST_SCENARIO_FINISHED.decisions[0]))
                    const creationDate = formatDateToView(LAST_SCENARIO_FINISHED.creationDate)

                    const texts = ([
                        ratingType,
                        heroType,
                        creationDate,
                    ]).map(x => `\u2022 ${x}`)

                    await renderPage({
                        lastScenario: LAST_SCENARIO_FINISHED,
                        openDeleteModalToLastScenario: true
                    })

                    const modal = screen.getByRole('dialog')
                    const valueTexts = within(modal).getAllByRole('listitem').map(x => x.textContent)

                    expect(valueTexts).toEqual(texts)
                })

                describe('and when click on the main button', () => {
                    it('should call removeScenarioStorage function', async () => {
                        await renderPage({
                            lastScenario: LAST_SCENARIO_FINISHED,
                            openDeleteModalToLastScenario: true,
                            confirmLastScenarioDeletion: true
                        })

                        expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                    })

                    it('should hide the save card', async () => {
                        await renderPage({
                            lastScenario: LAST_SCENARIO_FINISHED,
                            openDeleteModalToLastScenario: true,
                            confirmLastScenarioDeletion: true
                        })

                        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                        const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                        expect(saveCardTitle).toBeNull()
                    })

                    it('should close the modal', async () => {
                        await renderPage({
                            lastScenario: LAST_SCENARIO_FINISHED,
                            openDeleteModalToLastScenario: true,
                            confirmLastScenarioDeletion: true
                        })

                        const modal = screen.queryByRole('dialog')

                        expect(modal).toBeNull()
                    })
                })
            })

            describe('and when click to save', () => {
                it('should call createScoreApi request', async () => {
                    await renderPage({
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
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        expect(mockRemoveScenarioStorage).toHaveBeenCalledTimes(1)
                    })

                    it('should hide the save card', async () => {
                        await renderPage({
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        const saveCard = screen.getAllByLabelText('Cartão da pontuação')[0]
                        const saveCardTitle = within(saveCard).queryByRole('heading', { name: 'Pontuação da última aventura' })

                        expect(saveCardTitle).toBeNull()
                    })

                    it(`should render a list with 11 score cards`, async () => {
                        await renderPage({
                            lastScenario: LAST_SCENARIO_FINISHED,
                            saveLastScenario: true,
                        })

                        await waitFor(() => {
                            const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                            expect(scoreCards).toHaveLength(SCORES.length + 1)
                        })
                    })
                })

                describe('and when createScoreApi request fails', () => {
                    it('should show a warning with the error', async () => {
                        await renderPage({
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
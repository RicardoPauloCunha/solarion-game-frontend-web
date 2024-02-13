import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Scores from "."
import { OptionData } from "../../components/Inputs/Checkbox"
import { createAxiosError } from "../../config/axios/error"
import { defineValidatorErrorDictionary } from "../../config/validator/dictionary"
import * as scoreApiFile from "../../hooks/api/score"
import { ListAllScoresParams, ScoreViewModel } from "../../hooks/api/score"
import { getDecisionTypeEnumValue } from "../../types/enums/decisionType"
import { HeroTypeEnum, getHeroTypeEnumValue } from "../../types/enums/heroType"
import { LastMonthsTypeEnum, getLastMonthsTypeEnumValue, listLastMonthsTypeOptions } from "../../types/enums/lastMonthsType"
import { RatingTypeEnum, getRatingTypeEnumValue } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { formatCurrentDateToISO } from "../../utils/date"
import { testSubmitForm, testTypeInInput } from "../../utils/test"

const mockListAllScoresApi = jest.spyOn(scoreApiFile, 'listAllScoresApi')
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateScores = (options?: {
    getMore1?: boolean,
}): ScoreViewModel[] => {
    let list = [
        {
            scoreId: 11,
            creationDate: "10:46 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14],
            name: 'User name 1'
        },
        {
            scoreId: 10,
            creationDate: "10:38 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.C,
            decisions: [3, 5, 11, 19],
            name: 'User name 2'
        },
        {
            scoreId: 9,
            creationDate: "10:36 13/12/2023",
            heroType: HeroTypeEnum.Healer,
            ratingType: RatingTypeEnum.C,
            decisions: [2, 5, 11, 17],
            name: 'User name 3'
        },
        {
            scoreId: 8,
            creationDate: "10:33 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14],
            name: 'User name 2'
        },
        {
            scoreId: 7,
            creationDate: "10:26 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.C,
            decisions: [1, 5, 11, 15],
            name: 'User name 1'
        },
        {
            scoreId: 6,
            creationDate: "09:00 13/12/2023",
            heroType: HeroTypeEnum.Healer,
            ratingType: RatingTypeEnum.D,
            decisions: [2, 5, 11, 16],
            name: 'User name 3'
        },
        {
            scoreId: 5,
            creationDate: "08:57 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.C,
            decisions: [3, 5, 11, 19],
            name: 'User name 1'
        },
        {
            scoreId: 4,
            creationDate: "08:56 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.D,
            decisions: [1, 5, 11, 14],
            name: 'User name 2'
        },
        {
            scoreId: 3,
            creationDate: "08:55 13/12/2023",
            heroType: HeroTypeEnum.Warrior,
            ratingType: RatingTypeEnum.C,
            decisions: [1, 5, 11, 15],
            name: 'User name 3'
        },
        {
            scoreId: 2,
            creationDate: "08:50 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.A,
            decisions: [3, 4, 6, 9, 10, 13, 19],
            name: 'User name 2'
        }
    ]

    if (options?.getMore1) {
        list = [{
            scoreId: 1,
            creationDate: "08:45 13/12/2023",
            heroType: HeroTypeEnum.Mage,
            ratingType: RatingTypeEnum.A,
            decisions: [3, 4, 6, 9, 10, 13, 19],
            name: 'User name 1'
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

const SCORES = generateScores()
const MORE_SCORES = generateScores({ getMore1: true })
const ERROR_MESSAGE = 'Error message.'
const RATING_OPTION: OptionData = {
    value: RatingTypeEnum.A.toString(),
    label: getRatingTypeEnumValue(RatingTypeEnum.A)
}
const HERO_OPTION: OptionData = {
    value: HeroTypeEnum.Warrior.toString(),
    label: getHeroTypeEnumValue(HeroTypeEnum.Warrior)
}
const LAST3_MONTHS_OPTION: OptionData = {
    value: LastMonthsTypeEnum.Last3.toString(),
    label: getLastMonthsTypeEnumValue(LastMonthsTypeEnum.Last3)
}
const CUSTOM_PERIOD_OPTION: OptionData = {
    value: LastMonthsTypeEnum.Custom.toString(),
    label: getLastMonthsTypeEnumValue(LastMonthsTypeEnum.Custom)
}
const TODAY_DATE = formatCurrentDateToISO()

// TODO: test dates out of format, currently must type a valid date

const renderPage = async (options?: {
    scores?: ScoreViewModel[],
    moreScores?: ScoreViewModel[],
    mockFailListAllScoresApi?: boolean,
    skipInitialLoading?: boolean,
    getMoreScoreCards?: boolean,
    mockFailListAllScoresApiWhenCallAgain?: boolean,
    openFilterForm?: boolean,
    selectCustomPeriodOption?: boolean,
    submitEmptyFilterForm?: boolean
    submitValidFilterForm?: boolean
}) => {
    defineValidatorErrorDictionary()

    if (options?.mockFailListAllScoresApi)
        mockListAllScoresApi.mockRejectedValueOnce(createAxiosError(400, ERROR_MESSAGE))
    else
        mockListAllScoresApi.mockResolvedValueOnce(options?.scores ? options?.scores : SCORES)

    if (options?.mockFailListAllScoresApiWhenCallAgain)
        mockListAllScoresApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    else
        mockListAllScoresApi.mockResolvedValue(options?.moreScores ? options?.moreScores : MORE_SCORES)


    waitFor(() => {
        render(<Scores />, { wrapper: BrowserRouter })
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

    if (options?.openFilterForm) {
        const toggle = screen.getAllByRole('switch')[0]
        await userEvent.click(toggle)
    }

    if (options?.selectCustomPeriodOption) {
        const periodInput = screen.getByLabelText('Período')
        await userEvent.click(periodInput)

        const customPeriodOption = screen.getByRole('option', { name: CUSTOM_PERIOD_OPTION.label })
        await userEvent.click(customPeriodOption)
    }

    if (options?.submitEmptyFilterForm) {
        await testSubmitForm('Filtrar')
    }

    if (options?.submitValidFilterForm) {
        const ratingOption = screen.getByLabelText(RATING_OPTION.label)
        await userEvent.click(ratingOption)

        const heroOption = screen.getByLabelText(HERO_OPTION.label)
        await userEvent.click(heroOption)

        if (options?.selectCustomPeriodOption) {
            await testTypeInInput('Data inicial', TODAY_DATE)
            await testTypeInInput('Data final', TODAY_DATE)
        } else {
            const periodInput = screen.getByLabelText('Período')
            await userEvent.click(periodInput)

            const periodOption = screen.getByRole('option', { name: LAST3_MONTHS_OPTION.label })
            await userEvent.click(periodOption)
        }

        await testSubmitForm('Filtrar')
    }
}

describe('Scores Page', () => {
    it('should render my scores page', async () => {
        await renderPage({
            skipInitialLoading: true
        })

        const title = screen.getByRole('heading', { name: 'Todas as pontuações' })
        const filterField = screen.getByText('Filtros')
        const filterForm = screen.queryByRole('form')
        const loadingText = screen.getByText('Carregando lista de pontuações...')
        const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')
        const warning = screen.queryByRole('alert')
        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

        expect(title).toBeInTheDocument()
        expect(filterField).toBeInTheDocument()
        expect(filterForm).toBeNull()
        expect(loadingText).toBeInTheDocument()
        expect(scoreCards).toHaveLength(0)
        expect(warning).toBeNull()
        expect(getMoreLink).toBeNull()
    })

    describe('when listAllScoresApi request succeeds', () => {
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
                const emptyListMessage = screen.queryByText('Nenhuma pontuação dos usuários foram encontradas.')

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
                const emptyListMessage = within(warning).getByText('Nenhuma pontuação dos usuários foram encontradas.')

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

    describe('when listAllScoresApi request fails', () => {
        it('should render the loading message', async () => {
            await renderPage({
                skipInitialLoading: true,
                mockFailListAllScoresApi: true,
            })

            const loadingText = screen.getByText('Carregando lista de pontuações...')

            expect(loadingText).toBeInTheDocument()
        })
    })

    describe('when click to get more score cards', () => {
        it('should call navigate function to scores page', async () => {
            await renderPage({
                getMoreScoreCards: true,
            })

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Scores, expect.anything())
        })

        it('should call listAllScoresApi request again', async () => {
            const page = SCORES[SCORES.length - 1]?.scoreId

            await renderPage({
                getMoreScoreCards: true,
            })

            expect(mockListAllScoresApi).toHaveBeenCalledTimes(2)
            expect(mockListAllScoresApi).toHaveBeenLastCalledWith({
                page
            })
        })

        describe('and when listAllScoresApi re request succeeds', () => {
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

        describe('and when listAllScoresApi re request fails', () => {
            it('should render the loading messages', async () => {
                await renderPage({
                    getMoreScoreCards: true,
                    mockFailListAllScoresApiWhenCallAgain: true
                })

                const loadingText = screen.getByText('Carregando lista de pontuações...')
                const getMoreLoadingText = screen.getByText('Carregando mais pontuações...')

                expect(loadingText).toBeInTheDocument()
                expect(getMoreLoadingText).toBeInTheDocument()
            })
        })
    })

    describe('when click to open the filters', () => {
        it('should render a filter form', async () => {
            await renderPage({
                openFilterForm: true
            })

            const ratingInput = screen.getByText('Escolha as notas')
            const heroInput = screen.getByText('Escolha as classes')
            const periodInput = screen.getByLabelText('Período')
            const startDateInput = screen.queryByLabelText('Data inicial')
            const endDateInput = screen.queryByLabelText('Data final')
            const warning = screen.queryByRole('alert')
            const filterButton = screen.getByRole('button', { name: 'Filtrar' })
            const clearButton = screen.getByRole('button', { name: 'Limpar filtro' })

            expect(ratingInput).toBeInTheDocument()
            expect(heroInput).toBeInTheDocument()
            expect(periodInput).toBeInTheDocument()
            expect(startDateInput).toBeNull()
            expect(endDateInput).toBeNull()
            expect(warning).toBeNull()
            expect(filterButton).toBeInTheDocument()
            expect(clearButton).toBeInTheDocument()
        })
    })

    describe('when filters are open', () => {
        describe('and when click to close', () => {
            it('should hide the filter form', async () => {
                await renderPage({
                    openFilterForm: true
                })

                const toggle = screen.getAllByRole('switch')[0]
                await userEvent.click(toggle)

                const ratingInput = screen.queryByText('Escolha as notas')
                const heroInput = screen.queryByText('Escolha as classes')
                const periodInput = screen.queryByLabelText('Período')
                const startDateInput = screen.queryByLabelText('Data inicial')
                const endDateInput = screen.queryByLabelText('Data final')
                const warning = screen.queryByRole('alert')
                const filterButton = screen.queryByRole('button', { name: 'Filtrar' })
                const clearButton = screen.queryByRole('button', { name: 'Limpar filtro' })

                expect(ratingInput).toBeNull()
                expect(heroInput).toBeNull()
                expect(periodInput).toBeNull()
                expect(startDateInput).toBeNull()
                expect(endDateInput).toBeNull()
                expect(warning).toBeNull()
                expect(filterButton).toBeNull()
                expect(clearButton).toBeNull()
            })
        })

        describe('and when select a period option', () => {
            describe('and when is a default option', () => {
                it.each(
                    listLastMonthsTypeOptions().filter(x => x.value !== CUSTOM_PERIOD_OPTION.value).map(x => [x.label])
                )('should not render start and end date inputs for value %p', async (label) => {
                    await renderPage({
                        openFilterForm: true
                    })

                    const periodInput = screen.getByLabelText('Período')
                    await userEvent.click(periodInput)

                    const customPeriodOption = screen.getByRole('option', { name: label })
                    await userEvent.click(customPeriodOption)

                    const startDateInput = screen.queryByLabelText('Data inicial')
                    const endDateInput = screen.queryByLabelText('Data final')

                    expect(startDateInput).toBeNull()
                    expect(endDateInput).toBeNull()
                })
            })

            describe('and when is the custom option', () => {
                it('should render start and end date inputs', async () => {
                    await renderPage({
                        openFilterForm: true,
                        selectCustomPeriodOption: true
                    })

                    const startDateInput = screen.getByLabelText('Data inicial')
                    const endDateInput = screen.getByLabelText('Data final')

                    expect(startDateInput).toBeInTheDocument()
                    expect(endDateInput).toBeInTheDocument()
                })
            })
        })

        describe('and when filter is already applied', () => {
            it('should render the form with initial values', async () => {
                await renderPage({
                    openFilterForm: true,
                    submitValidFilterForm: true
                })

                const ratingOption = screen.getByLabelText(RATING_OPTION.label)
                const heroOption = screen.getByLabelText(HERO_OPTION.label)
                const periodValue = screen.getByText(LAST3_MONTHS_OPTION.label)

                expect(ratingOption).toBeChecked()
                expect(heroOption).toBeChecked()
                expect(periodValue).toBeInTheDocument()
            })

            describe('and when a custom period option has been selected', () => {
                it('should render the form with initial values', async () => {
                    await renderPage({
                        openFilterForm: true,
                        selectCustomPeriodOption: true,
                        submitValidFilterForm: true,
                    })

                    const ratingOption = screen.getByLabelText(RATING_OPTION.label)
                    const heroOption = screen.getByLabelText(HERO_OPTION.label)
                    const periodValue = screen.getByText(CUSTOM_PERIOD_OPTION.label)
                    const startDate = screen.getByLabelText('Data inicial')
                    const endDate = screen.getByLabelText('Data final')

                    expect(ratingOption).toBeChecked()
                    expect(heroOption).toBeChecked()
                    expect(periodValue).toBeInTheDocument()
                    expect(startDate).toHaveValue(TODAY_DATE)
                    expect(endDate).toHaveValue(TODAY_DATE)
                })
            })
        })
    })

    describe('when submit filter form', () => {
        describe('and when invalid inputs value', () => {
            describe('and when a custom period option has been selected', () => {
                it('should show a invalid value warning', async () => {
                    await renderPage({
                        openFilterForm: true,
                        selectCustomPeriodOption: true
                    })

                    await testSubmitForm('Filtrar')

                    const warning = screen.getByRole('alert')
                    const warningTitle = screen.getByText('Dados inválidos')

                    expect(warning).toBeInTheDocument()
                    expect(warningTitle).toBeInTheDocument()
                })

                describe('and when no value', () => {
                    it('should show a required error in the inputs', async () => {
                        const errors = [
                            'Coloque uma data válida.',
                            'Coloque uma data válida.'
                        ]

                        await renderPage({
                            openFilterForm: true,
                            selectCustomPeriodOption: true
                        })

                        await testSubmitForm('Filtrar')

                        const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                        expect(inputsErrorText).toEqual(errors)
                    })
                })

                describe('and when length is shorter', () => {
                    it('should show a length error in the inputs', async () => {
                        const errors = [
                            'Coloque uma data válida maior ou igual a 01/01/1900.',
                            'Coloque uma data válida.',
                        ]

                        await renderPage({
                            openFilterForm: true,
                            selectCustomPeriodOption: true
                        })

                        await testTypeInInput('Data inicial', '1899-12-31')
                        await testSubmitForm('Filtrar')

                        const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                        expect(inputsErrorText).toEqual(errors)
                    })
                })

                describe('and when end date is less than start date', () => {
                    it('should show a length error in the end date input', async () => {
                        const yesterday = formatCurrentDateToISO(-1)
                        const errors = [
                            'Coloque uma data maior ou igual a data inicial.',
                        ]

                        await renderPage({
                            openFilterForm: true,
                            selectCustomPeriodOption: true
                        })

                        await testTypeInInput('Data inicial', TODAY_DATE)
                        await testTypeInInput('Data final', yesterday)
                        await testSubmitForm('Filtrar')

                        const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                        expect(inputsErrorText).toEqual(errors)
                    })
                })

                describe('and when length is greater', () => {
                    it('should show a length error in the inputs', async () => {
                        const tomorrow = formatCurrentDateToISO(1)
                        const errors = [
                            'Coloque uma data menor ou igual a data de hoje.',
                            'Coloque uma data menor ou igual a data de hoje.',
                        ]

                        await renderPage({
                            openFilterForm: true,
                            selectCustomPeriodOption: true
                        })

                        await testTypeInInput('Data inicial', tomorrow)
                        await testTypeInInput('Data final', tomorrow)
                        await testSubmitForm('Filtrar')

                        const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                        expect(inputsErrorText).toEqual(errors)
                    })
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call listAllScoresApi request again', async () => {
                const params: ListAllScoresParams = {
                    endDate: undefined,
                    heroTypes: [],
                    lastMonths: undefined,
                    page: 0,
                    ratingTypes: [],
                    startDate: undefined
                }

                await renderPage({
                    openFilterForm: true,
                    submitEmptyFilterForm: true
                })

                expect(mockListAllScoresApi).toHaveBeenCalledTimes(2)
                expect(mockListAllScoresApi).toHaveBeenLastCalledWith(params)
            })

            describe('and when form has values', () => {
                it('should call listAllScoresApi request with params', async () => {
                    const params: ListAllScoresParams = {
                        page: 0,
                        heroTypes: [Number(HERO_OPTION.value)],
                        lastMonths: Number(LAST3_MONTHS_OPTION.value),
                        ratingTypes: [Number(RATING_OPTION.value)],
                        endDate: undefined,
                        startDate: undefined
                    }

                    await renderPage({
                        openFilterForm: true,
                        submitValidFilterForm: true
                    })

                    expect(mockListAllScoresApi).toHaveBeenCalledTimes(2)
                    expect(mockListAllScoresApi).toHaveBeenLastCalledWith(params)
                })

                describe('and when a custom period option has been selected', () => {
                    it('should call listAllScoresApi request with params', async () => {
                        const params: ListAllScoresParams = {
                            page: 0,
                            heroTypes: [Number(HERO_OPTION.value)],
                            lastMonths: Number(CUSTOM_PERIOD_OPTION.value),
                            ratingTypes: [Number(RATING_OPTION.value)],
                            endDate: TODAY_DATE as unknown as Date,
                            startDate: TODAY_DATE as unknown as Date
                        }

                        await renderPage({
                            openFilterForm: true,
                            selectCustomPeriodOption: true,
                            submitValidFilterForm: true,
                        })

                        expect(mockListAllScoresApi).toHaveBeenCalledTimes(2)
                        expect(mockListAllScoresApi).toHaveBeenLastCalledWith(params)
                    })
                })
            })

            describe('and when listAllScoresApi re request succeeds', () => {
                it('should not render the loading messages', async () => {
                    await renderPage({
                        openFilterForm: true,
                        submitEmptyFilterForm: true
                    })

                    await waitFor(() => {
                        const loadingText = screen.queryByText('Carregando lista de pontuações...')

                        expect(loadingText).toBeNull()
                    })
                })

                describe('and when have scores', () => {
                    it(`should render a list with 1 score card`, async () => {
                        await renderPage({
                            openFilterForm: true,
                            submitEmptyFilterForm: true
                        })

                        await waitFor(() => {
                            const scoreCards = screen.getAllByLabelText('Cartão da pontuação')

                            expect(scoreCards).toHaveLength(1)
                        })
                    })

                    describe('and when the total of new score cards is less than 10', () => {
                        it('should not render a get more link', async () => {
                            await renderPage({
                                openFilterForm: true,
                                submitEmptyFilterForm: true
                            })

                            const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                            expect(getMoreLink).toBeNull()
                        })
                    })
                })

                describe('and when no scores', () => {
                    it(`should not render a list of score cards`, async () => {
                        await renderPage({
                            moreScores: [],
                            openFilterForm: true,
                            submitEmptyFilterForm: true
                        })

                        const scoreCards = screen.queryAllByLabelText('Cartão da pontuação')

                        expect(scoreCards).toHaveLength(0)
                    })

                    it(`should render an empty list warning`, async () => {
                        await renderPage({
                            moreScores: [],
                            openFilterForm: true,
                            submitEmptyFilterForm: true
                        })

                        const warning = screen.getByRole('alert')
                        const emptyListMessage = within(warning).getByText('Nenhuma pontuação dos usuários foram encontradas.')

                        expect(warning).toBeInTheDocument()
                        expect(emptyListMessage).toBeInTheDocument()
                    })

                    it('should not render a get more link', async () => {
                        await renderPage({
                            moreScores: [],
                            openFilterForm: true,
                            submitEmptyFilterForm: true
                        })

                        const getMoreLink = screen.queryByRole('link', { name: 'Exibir mais' })

                        expect(getMoreLink).toBeNull()
                    })
                })
            })

            describe('and when listAllScoresApi re request fails', () => {
                it('should render the loading messages', async () => {
                    await renderPage({
                        openFilterForm: true,
                        submitEmptyFilterForm: true,
                        mockFailListAllScoresApiWhenCallAgain: true
                    })

                    const loadingText = screen.getByText('Carregando lista de pontuações...')

                    expect(loadingText).toBeInTheDocument()
                })
            })
        })
    })
})
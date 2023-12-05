import { ResultWrapperData } from "../../config/axios/error"
import { getParams, post, remove } from "../../config/axios/methods"

const root = "scores/"

export interface DecisionViewModel {
    decisionType: number
    decisionTypeValue: string
}

export interface ScoreViewModel {
    scoreId: number
    creationDate: string
    heroType: number
    heroTypeValue: string
    ratingType: number
    ratingTypeValue: string
    decisions: DecisionViewModel[]
    userName: string
}

interface ListMyScoresParams {
    page?: number
}

export const listMyScoresApi = async (params: ListMyScoresParams): Promise<ScoreViewModel[]> => {
    let { data } = await getParams<ListMyScoresParams, ScoreViewModel[]>(root, params)
    return data
}

interface CreateScoreRequest {
    ratingType: number
    heroType: number
    decisionTypes: number[]
}

export const createScoreApi = async (requestData: CreateScoreRequest): Promise<ResultWrapperData<ScoreViewModel>> => {
    let { data } = await post<CreateScoreRequest, ResultWrapperData<ScoreViewModel>>(root, requestData)
    return data
}

export const deleteScoreApi = async (scoreId: number): Promise<ResultWrapperData<null>> => {
    let { data } = await remove<ResultWrapperData<null>>(root + scoreId)
    return data
}

export interface ListAllScoresParams {
    page?: number
    ratingTypes?: number[]
    heroTypes?: number[]
    lastMonths?: number
    startDate?: Date | null
    endDate?: Date | null
}

export const listAllScoresApi = async (params: ListAllScoresParams): Promise<ScoreViewModel[]> => {
    let { data } = await getParams<ListAllScoresParams, ScoreViewModel[]>(root + 'all', params)
    return data
}

export interface ChartViewModel {
    description: string
    totalValue: number
    values?: ChartValueViewModel[]
}

interface ChartValueViewModel {
    column: string
    value: number
}

export interface ScoreIndicatorsViewModel {
    adventuresChart: ChartViewModel
    heroCharts: ChartViewModel[]
    ratingCharts: ChartViewModel[]
}

export interface GetScoreIndicatorsParams {
    lastMonths?: number
    startDate?: Date | null
    endDate?: Date | null
}

export const GetScoreIndicatorsApi = async (params: GetScoreIndicatorsParams): Promise<ScoreIndicatorsViewModel> => {
    let { data } = await getParams<GetScoreIndicatorsParams, ScoreIndicatorsViewModel>(root + 'all/indicators', params)
    return data
}
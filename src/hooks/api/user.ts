import { ResultWrapperData } from "../../config/axios/error"
import { get, post, put } from "../../config/axios/methods"

const root = "users/"

interface UserSimpleViewModel {
    userId: number
    name: string
    email: string
}

export const getLoggedUserApi = async (): Promise<UserSimpleViewModel> => {
    let { data } = await get<UserSimpleViewModel>(root)
    return data
}

interface CreateCommonUserRequest {
    name: string
    email: string
    password: string
}

export const createCommonUserApi = async (requestData: CreateCommonUserRequest): Promise<ResultWrapperData<string>> => {
    let { data } = await post<CreateCommonUserRequest, ResultWrapperData<string>>(root, requestData)
    return data
}

interface EditUserDataRequest {
    name: string
    email: string
}

export const editUserDataApi = async (requestData: EditUserDataRequest): Promise<ResultWrapperData<string>> => {
    let { data } = await put<EditUserDataRequest, ResultWrapperData<string>>(root, requestData)
    return data
}

interface EditUserPasswordRequest {
    password: string
    newPassword: string
}

export const editUserPasswordApi = async (requestData: EditUserPasswordRequest): Promise<ResultWrapperData<null>> => {
    let { data } = await put<EditUserPasswordRequest, ResultWrapperData<null>>(root + 'password', requestData)
    return data
}

interface LoginRequest {
    email: string
    password: string
}

export const loginApi = async (requestData: LoginRequest): Promise<ResultWrapperData<string>> => {
    let { data } = await post<LoginRequest, ResultWrapperData<string>>(root + 'auth', requestData)
    return data
}
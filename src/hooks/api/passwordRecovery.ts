import { ResultWrapperData } from "../../config/axios/error"
import { post, put } from "../../config/axios/methods"

const root = "password-recoveries/"

interface SolicitPasswordRecoveryRequest {
    email: string
}

export const solicitPasswordRecoveryApi = async (requestData: SolicitPasswordRecoveryRequest): Promise<ResultWrapperData<null>> => {
    let { data } = await post<SolicitPasswordRecoveryRequest, ResultWrapperData<null>>(root, requestData)
    return data
}

interface ReplyPasswordRecoveryRequest {
    verificationCode: string
    email: string
    password: string
}

export const replyPasswordRecoveryApi = async (requestData: ReplyPasswordRecoveryRequest): Promise<ResultWrapperData<null>> => {
    let { data } = await put<ReplyPasswordRecoveryRequest, ResultWrapperData<null>>(root + 'reply', requestData)
    return data
}
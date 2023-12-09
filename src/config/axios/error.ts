import { AxiosError } from "axios"
import { WarningData } from "../../components/Cards/WarningCard"

export interface ResultWrapperData<T = null> {
    message: string
    responseStatus: number
    result: T
    errors?: string[]
}

export const getAxiosError = (baseError: any) => {
    let warning: WarningData = {
        title: 'Erro na operação',
        message: 'Ocorreu um erro no servidor ou não foi possível acessá-lo.',
        variant: 'error'
    }

    try {
        if (baseError instanceof AxiosError) {
            let error = baseError as AxiosError<ResultWrapperData>
            let status = error?.response?.status

            switch (status) {
                case 422:
                    warning = {
                        title: 'Dados inválidos',
                        message: 'Os dados enviados para a operação são inválidos.',
                        variant: 'error',
                        submessages: error.response?.data?.errors
                    }
                    break
                case 401:
                case 403:
                    warning = {
                        title: 'Autorização negada',
                        message: 'Você não possui autorização para realizar essa ação ou sua sessão expirou. Saia da sua conta e faça login novamente.',
                        variant: 'error'
                    }
                    break
                default:
                    if (error?.response?.data?.message) {
                        warning.title = 'Erro na operação'
                        warning.message = error.response.data.message
                        warning.submessages = error.response?.data?.errors
                    }
                    break
            }

            console.log(error?.response?.status, error?.response?.data, error?.response?.data?.message)
        }

        return warning
    } catch (error) {
        return warning
    }
}
import { AxiosResponse } from 'axios'
import { getTokenStorage } from '../../hooks/storage/token'
import Axios from './axios'

export async function get<Response>(path: string): Promise<AxiosResponse<Response>> {
    return await Axios.get(path, { headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}

export async function getParams<Params, Response>(path: string, params: Params): Promise<AxiosResponse<Response>> {
    return await Axios.get(path, { params, headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}

export async function post<Request, Response>(path: string, data: Request): Promise<AxiosResponse<Response>> {
    return await Axios.post(path, data, { headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}

export async function postFile<Response>(path: string, data: FormData): Promise<AxiosResponse<Response>> {
    return await Axios.post(path, data, {
        headers: {
            Authorization: 'Bearer ' + getTokenStorage(),
            "Content-Type": "multipart/form-data"
        }
    })
}

export async function put<Request, Response>(path: string, data: Request): Promise<AxiosResponse<Response>> {
    return await Axios.put(path, data, { headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}

export async function patch<Response>(path: string): Promise<AxiosResponse<Response>> {
    return await Axios.patch(path, undefined, { headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}

export async function remove<Response>(path: string): Promise<AxiosResponse<Response>> {
    return await Axios.delete(path, { headers: { Authorization: 'Bearer ' + getTokenStorage() } })
}
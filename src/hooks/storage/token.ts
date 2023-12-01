export const TOKEN_DATA_KEY = "@SolarionGame:token-data"

export const setTokenStorage = (data: string) => {
    localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(data))
}

export const getTokenStorage = () => {
    let data = localStorage.getItem(TOKEN_DATA_KEY)

    if (data === null)
        return undefined

    try {
        return JSON.parse(data) as string
    } catch (error) {
        return undefined
    }
}

export const removeTokenStorage = () => {
    localStorage.removeItem(TOKEN_DATA_KEY)
}

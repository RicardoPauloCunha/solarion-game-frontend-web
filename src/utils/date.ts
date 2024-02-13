export const formatDateToView = (value: Date) => {
    if (!(value instanceof Date)) {
        try {
            value = new Date(value)
        } catch (error) {
            return ''
        }
    }

    let date = new Date(value).toLocaleDateString()
    let time = new Date(value).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return `${time} - ${date}`
}

export const formatStringToDate = (value: string) => {
    if (!value)
        return ''

    return value
        .split('/')
        .reverse()
        .join('-')
}

export const formatDateToString = (value: string) => {
    if (!value)
        return ''

    return value
        .split('-')
        .reverse()
        .join('/')
}

export const formatCurrentDateToISO = (addDay: number = 0) => {
    let date = new Date()

    date.setDate(date.getDate() + addDay)

    return date.toISOString().split('T')[0]
}
export const formatDateToString = (value: Date) => {
    if (!(value instanceof Date)) {
        try {
            value = new Date(value)
        } catch (error) {
            return ''
        }
    }

    let date = new Date(value).toLocaleDateString()
    let time = new Date(value).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    })

    return `${time} - ${date}`
}
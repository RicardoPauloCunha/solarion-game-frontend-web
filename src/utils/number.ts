export const formatNumberToPercentage = (value: number) => {
    return value.toFixed(2).toString().replace('.', ',') + '%'
}
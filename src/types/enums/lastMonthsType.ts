import { OptionData } from "../../components/Inputs/Checkbox"

export enum LastMonthsTypeEnum {
    Custom = 0,
    Last1 = 1,
    Last3 = 3,
    Last6 = 6,
    Last12 = 12,
}

export const getLastMonthsTypeEnumValue = (type: LastMonthsTypeEnum | number) => {
    switch (type) {
        case LastMonthsTypeEnum.Custom:
            return "Personalizado"
        case LastMonthsTypeEnum.Last1:
            return "No último mês"
        case LastMonthsTypeEnum.Last3:
            return "Nos últimos 3 meses"
        case LastMonthsTypeEnum.Last6:
            return "Nos últimos 6 meses"
        case LastMonthsTypeEnum.Last12:
            return "Nos últimos 12 meses"
        default:
            return ""
    }
}

export const listLastMonthsTypeOptions = (): OptionData[] => {
    let list = [
        LastMonthsTypeEnum.Last1,
        LastMonthsTypeEnum.Last3,
        LastMonthsTypeEnum.Last6,
        LastMonthsTypeEnum.Last12,
        LastMonthsTypeEnum.Custom,
    ]

    return list.map(x => ({
        label: getLastMonthsTypeEnumValue(x),
        value: `${x}`
    }))
}
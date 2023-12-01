import { OptionData } from "../../components/Inputs/Checkbox"
import { DecisionTypeEnum } from "./decisionType"

export enum RatingTypeEnum {
    None = 0,
    A = 1,
    B = 2,
    C = 3,
    D = 4,
}

export const getRatingTypeEnumValue = (type: RatingTypeEnum | number) => {
    switch (type) {
        case RatingTypeEnum.A:
            return "A"
        case RatingTypeEnum.B:
            return "B"
        case RatingTypeEnum.C:
            return "C"
        case RatingTypeEnum.D:
            return "D"
        default:
            return ""
    }
}

export const listRatingTypeOptions = (): OptionData[] => {
    let list = [
        RatingTypeEnum.A,
        RatingTypeEnum.B,
        RatingTypeEnum.C,
        RatingTypeEnum.D,
    ]

    return list.map(x => ({
        label: getRatingTypeEnumValue(x),
        value: `${x}`
    }))
}

export const getRatingTypeByDecisions = (decisionTypes: DecisionTypeEnum[]) => {
    let points = 0

    decisionTypes.forEach(x => {
        switch (x) {
            case DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Shield:
            case DecisionTypeEnum.CH6_ACT3_DEC_Break:
            case DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Shield:
            case DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Mage:
            case DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Shield:
                points++
        }
    })

    switch (points) {
        case 3:
            return RatingTypeEnum.A
        case 2:
            return RatingTypeEnum.B
        case 1:
            return RatingTypeEnum.C
        default:
            return RatingTypeEnum.D
    }
}
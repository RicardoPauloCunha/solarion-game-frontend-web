import { OptionData } from "../../components/Inputs/Checkbox"
import { DecisionTypeEnum } from "./decisionType"

export enum HeroTypeEnum {
    None = 0,
    Warrior = 1,
    Healer = 2,
    Mage = 3,
}

export const getHeroTypeEnumValue = (type: HeroTypeEnum | number) => {
    switch (type) {
        case HeroTypeEnum.Warrior:
            return "Guerreiro"
        case HeroTypeEnum.Healer:
            return "Curandeira"
        case HeroTypeEnum.Mage:
            return "Mago"
        default:
            return ""
    }
}

export const listHeroTypeOptions = (): OptionData[] => {
    let list = [
        HeroTypeEnum.Warrior,
        HeroTypeEnum.Healer,
        HeroTypeEnum.Mage,
    ]

    return list.map(x => ({
        label: getHeroTypeEnumValue(x),
        value: `${x}`
    }))
}

export const getHeroTypeByDecision = (decisionType: DecisionTypeEnum) => {
    switch (decisionType) {
        case DecisionTypeEnum.CH1_ACT2_DEC_Warrior:
            return HeroTypeEnum.Warrior
        case DecisionTypeEnum.CH1_ACT2_DEC_Healer:
            return HeroTypeEnum.Healer
        case DecisionTypeEnum.CH1_ACT2_DEC_Mage:
            return HeroTypeEnum.Mage
        default:
            return HeroTypeEnum.None
    }
}
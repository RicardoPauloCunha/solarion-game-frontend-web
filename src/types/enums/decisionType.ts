export enum DecisionTypeEnum {
    None = 0,
    CH1_ACT2_DEC_Warrior = 1,
    CH1_ACT2_DEC_Healer = 2,
    CH1_ACT2_DEC_Mage = 3,
    CH3_ACT1_DEC_Front = 4,
    CH3_ACT1_DEC_Back = 5,
    CH4_ACT2_DEC_Fight = 6,
    CH4_ACT2_DEC_Run = 7,
    CH4_ROT1_ACT1_DEC_Weapon = 8,
    CH4_ROT1_ACT1_DEC_Shield = 9,
    CH5_ACT2_DEC_Left = 10,
    CH5_ACT2_DEC_Right = 11,
    CH6_ACT3_DEC_Run = 12,
    CH6_ACT3_DEC_Break = 13,
    CH8_ROT_WAR_AC2_DEC_Sword = 14,
    CH8_ROT_WAR_AC2_DEC_Shield = 15,
    CH8_ROT_HEA_AC3_DEC_Warrior = 16,
    CH8_ROT_HEA_AC3_DEC_Mage = 17,
    CH8_ROT_MAG_AC2_DEC_Lightning = 18,
    CH8_ROT_MAG_AC2_DEC_Shield = 19,
}

export const getDecisionTypeEnumValue = (type: DecisionTypeEnum | number) => {
    switch (type) {
        case DecisionTypeEnum.CH1_ACT2_DEC_Warrior:
            return "Guerreiro. Gosto de abordagens diretas."
        case DecisionTypeEnum.CH1_ACT2_DEC_Healer:
            return "Curandeira. Prefiro ajudar os outros."
        case DecisionTypeEnum.CH1_ACT2_DEC_Mage:
            return "Mago. Uma mente aguçada é a mais poderosa das lâminas."
        case DecisionTypeEnum.CH3_ACT1_DEC_Front:
            return "Ir na frente. A sorte favorece os ousados."
        case DecisionTypeEnum.CH3_ACT1_DEC_Back:
            return "Procurar por uma entrada dos fundos. Vamos continuar escondidos."
        case DecisionTypeEnum.CH4_ACT2_DEC_Fight:
            return "Luta com o esqueleto."
        case DecisionTypeEnum.CH4_ACT2_DEC_Run:
            return "Foge."
        case DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Weapon:
            return "Empunha suas armas."
        case DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Shield:
            return "Levanta seus escudos."
        case DecisionTypeEnum.CH5_ACT2_DEC_Left:
            return "Entra no corredor à esquerda."
        case DecisionTypeEnum.CH5_ACT2_DEC_Right:
            return "Sobe as escadas à direita."
        case DecisionTypeEnum.CH6_ACT3_DEC_Run:
            return "Sai o mais rápido possível."
        case DecisionTypeEnum.CH6_ACT3_DEC_Break:
            return "Destrói as capsulas."
        case DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Sword:
            return "Ataca com sua espada."
        case DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Shield:
            return "Usa seu escudo para defender dos inimigos."
        case DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Warrior:
            return "Cura o Guerreiro."
        case DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Mage:
            return "Cura o Mago."
        case DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Lightning:
            return "Lança um 'Raio Puro' em Xarth."
        case DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Shield:
            return "Lança um 'Encantamento de Escudo' em seus amigos."
        default:
            return ""
    }
}
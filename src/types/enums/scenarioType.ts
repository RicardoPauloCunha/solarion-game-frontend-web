import CH1HeroImg from '../../assets/images/ch1-hero.png'
import CH1TableImg from '../../assets/images/ch1-table.png'
import CH2ContextImg from '../../assets/images/ch2-context.png'
import CH3TowerImg from '../../assets/images/ch3-tower.png'
import CH3TrapImg from '../../assets/images/ch3-trap.png'
import CH4BonesImg from '../../assets/images/ch4-bones.png'
import CH4SkeletonImg from '../../assets/images/ch4-skeleton.png'
import CH5SewerImg from '../../assets/images/ch5-sewer.png'
import CH6CapsulesImg from '../../assets/images/ch6-capsules.png'
import CH7DoorImg from '../../assets/images/ch7-door.png'
import CH8DustImg from '../../assets/images/ch8-dust.png'
import CH8VillainImg from '../../assets/images/ch8-villain.png'
import NotFoundImg from '../../assets/images/not-found.png'
import { DecisionViewModel } from '../../hooks/api/score'
import { DecisionTypeEnum, getDecisionTypeEnumValue } from "./decisionType"

export enum ScenarioTypeEnum {
    Finished = -1,
    None = 0,
    CH1_ACT1 = 1,
    CH1_ACT2_DEC = 2,
    CH2_ACT1 = 3,
    CH2_ACT2 = 4,
    CH2_ACT3 = 5,
    CH3_ACT1_DEC = 6,
    CH3_ACT2 = 7,
    CH4_ACT1 = 8,
    CH4_ACT2_DEC = 9,
    CH4_ROT1_ACT1_DEC = 10,
    CH4_ROT1_SUBROT1_ACT1 = 11,
    CH4_ROT1_SUBROT1_ACT2 = 12,
    CH4_ROT1_SUBROT2_ACT1 = 13,
    CH4_ROT1_SUBROT2_ACT2 = 14,
    CH4_ROT2_ACT1 = 15,
    CH5_ACT1 = 16,
    CH5_ACT2_DEC = 17,
    CH6_ACT1 = 18,
    CH6_ACT2 = 19,
    CH6_ACT3_DEC = 20,
    CH6_ROT1_AC1 = 21,
    CH6_ROT2_AC1 = 22,
    CH7_AC1 = 23,
    CH7_AC2 = 24,
    CH8_AC1 = 25,
    CH8_AC2 = 26,
    CH8_AC3 = 27,
    CH8_ROT_WAR_AC1 = 28,
    CH8_ROT_WAR_AC2_DEC = 29,
    CH8_ROT_WAR_SUBROT1_AC1 = 30,
    CH8_ROT_WAR_SUBROT1_AC2 = 31,
    CH8_ROT_WAR_SUBROT1_AC3 = 32,
    CH8_ROT_WAR_SUBROT1_AC4_END = 33,
    CH8_ROT_WAR_SUBROT2_AC1 = 34,
    CH8_ROT_WAR_SUBROT2_AC2 = 35,
    CH8_ROT_WAR_SUBROT2_AC3_END = 36,
    CH8_ROT_HEA_AC1 = 37,
    CH8_ROT_HEA_AC2 = 38,
    CH8_ROT_HEA_AC3_DEC = 39,
    CH8_ROT_HEA_SUBROT1_AC1 = 40,
    CH8_ROT_HEA_SUBROT1_AC2_END = 41,
    CH8_ROT_HEA_SUBROT2_AC1 = 42,
    CH8_ROT_HEA_SUBROT2_AC2_END = 43,
    CH8_ROT_MAG_AC1 = 44,
    CH8_ROT_MAG_AC2_DEC = 45,
    CH8_ROT_MAG_SUBROT1_AC1 = 46,
    CH8_ROT_MAG_SUBROT1_AC2 = 47,
    CH8_ROT_MAG_SUBROT1_AC3 = 48,
    CH8_ROT_MAG_SUBROT1_AC4_END = 49,
    CH8_ROT_MAG_SUBROT2_AC1 = 50,
    CH8_ROT_MAG_SUBROT2_AC2 = 51,
    CH8_ROT_MAG_SUBROT2_AC3_END = 52,
}

export const getScenarioTypeEnumValue = (type: ScenarioTypeEnum | number) => {
    switch (type) {
        case ScenarioTypeEnum.CH1_ACT1:
            return "Huum... Parece que a missão de hoje nos levará à Torre do Necromante... para tentar recuperar o Cajado de Solarion das garras de Xarth, o Senhor do Terror."
        case ScenarioTypeEnum.CH1_ACT2_DEC:
            return "Você está pronto(a) para escolher seu personagem?"
        case ScenarioTypeEnum.CH2_ACT1:
            return "O rei confiou a você e seus companheiros a missão de recuperar o Cajado de Solarion... uma tarefa que, se concluída com sucesso, garantirá seu lugar no hall das lendas além de uma generosa quantidade de ouro e prata."
        case ScenarioTypeEnum.CH2_ACT2:
            return "Após um longo mês de viagem por terras implacáveis, você vê, num precipício, seu destino pairando à distância."
        case ScenarioTypeEnum.CH2_ACT3:
            return "Ali, numa planície enluarada, está a Torre do Necromante... em que Xarth, o Senhor do Terror, usurpa o poder do Cajado de Solarion para propósitos vis."
        case ScenarioTypeEnum.CH3_ACT1_DEC:
            return "A torre está bem diante de você."
        case ScenarioTypeEnum.CH3_ACT2:
            return "Após procurar na base da torre, você descobre uma armadilha escondida no arbusto. Em frente está uma escada pela qual desce seu grupo."
        case ScenarioTypeEnum.CH4_ACT1:
            return "Um esqueleto protege o corredor à sua frente. Parece perigoso."
        case ScenarioTypeEnum.CH4_ACT2_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH4_ROT1_ACT1_DEC:
            return "O esqueleto ataca!"
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT1:
            return "O esqueleto é rápido demais, e ataca seu grupo antes que alguém possa atacar!"
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2:
            return "A força do impacto lança seu grupo para trás. Incapaz de parar a tempo, você escorrega em uma pedra íngreme e cai em algo molhado."
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT1:
            return "Você bloqueia o ataque com sucesso. O esqueleto cai para trás, dando a você tempo suficiente para atacar e matar a vil criatura."
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT2:
            return "Você continua pelo corredor, tomando cuidado para não pisar nos restos mortais do esqueleto."
        case ScenarioTypeEnum.CH4_ROT2_ACT1:
            return "Você vira e corre em um corredor pouco iluminado. A pedra fria se inclina e contorce para baixo pelo que parece uma eternidade. Finalmente, você surge em uma nova área."
        case ScenarioTypeEnum.CH5_ACT1:
            return "Você se encontra em um corredor que lembra um esgoto. À esquerda, um corredor brilha com uma peculiar luz verde. À direita, uma escada leva à escuridão."
        case ScenarioTypeEnum.CH5_ACT2_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH6_ACT1:
            return "Você está em uma sala. À esquerda há uma escada. À direita, três prisioneiros flutuam em cápsulas estranhas e brilhantes. Eles parecem estar passando por algum tipo de transformação."
        case ScenarioTypeEnum.CH6_ACT2:
            return "Será que esse é um experimento doentio do Senhor do Terror?"
        case ScenarioTypeEnum.CH6_ACT3_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH6_ROT1_AC1:
            return "Tentando afastar a visão perturbadora dos prisioneiros de sua cabeça, você e seus companheiros sobem a escada rapidamente."
        case ScenarioTypeEnum.CH6_ROT2_AC1:
            return "Após dar um descanso a essas pobres almas, você e seus companheiros sobem a escada."
        case ScenarioTypeEnum.CH7_AC1:
            return "Você chegou a uma porta no fim de um corredor."
        case ScenarioTypeEnum.CH7_AC2:
            return "Chegou a hora de enfrentar o Xarth, o Senhor do Terror."
        case ScenarioTypeEnum.CH8_AC1:
            return "Xarth: Intrusos? Como se atrevem a violar meus aposentos particulares?!"
        case ScenarioTypeEnum.CH8_AC2:
            return "Ah, então vocês vieram buscar o Cajado de Solarion..."
        case ScenarioTypeEnum.CH8_AC3:
            return "He, he, he... tolos. Vocês serão um bom reforço para o meu exército de esqueletos!"
        case ScenarioTypeEnum.CH8_ROT_WAR_AC1:
            return "O Senhor do Terror está lançando um encanto..."
        case ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC1:
            return "Você ataca, mas Xarth desvia e lança um Feixe de Sombras em seus companheiros!"
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC2:
            return "A Curandeira e o Mago viram cinzas..."
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC3:
            return "Você ataca com sua espada novamente e desfere um golpe firme. Xarth grita e se transforma em poeira."
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC4_END:
            return "Você pega o Cajado de Solarion e segura-o firme. A paz e a ordem foram restauradas ao mundo."
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC1:
            return "Xarth lança um 'Feixe de Sombras' na Curandeira... mas você levanta seu escudo bem na hora para bloquear o ataque!"
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC2:
            return "Enquanto Xarth prepara outro feitiço, você o ataca e acerta com sua espada."
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC3_END:
            return "O Cajado de Solarion brilha tranquilamente enquanto você o levanta. A ordem foi restaurada ao mundo!"
        case ScenarioTypeEnum.CH8_ROT_HEA_AC1:
            return "Xarth, o Senhor do Terror lança Feixe de Sombras!"
        case ScenarioTypeEnum.CH8_ROT_HEA_AC2:
            return "Você foi capaz de desviar do feitiço, mas seus companheiros estão gravemente feridos!"
        case ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC1:
            return "O Guerreiro ataca e desfere um golpe mortal em Xarth, liberando o Cajado de Solarion de suas garras."
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC2_END:
            return "A paz e a ordem é restaurada ao mundo."
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC1:
            return "O Mago lança 'Raio Puro'... Um feixe de luz branca atinge Xarth bem no rosto. O Senhor do Terror grita e se transforma em poeira."
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC2_END:
            return "Você pega o Cajado de Solarion e segura-o firme. A ordem foi restaurada ao mundo."
        case ScenarioTypeEnum.CH8_ROT_MAG_AC1:
            return "Xarth, o Rei do Terror, sussurra um encantamento..."
        case ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC:
            return "O que você faz?"
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC1:
            return "Antes que você tenha chance de lançar seu feitiço, Xarth lança um Feixe de Sombras em seus companheiros!"
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC2:
            return "O Guerreiro e a Curandeira são reduzidos a cinzas."
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC3:
            return "Seu feitiço acerta Xarth bem no rosto."
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC4_END:
            return "Ele grita e se reduz a pó. Você pega o Cajado de Solarion e segura-o firme. A paz e a ordem foram restauradas ao mundo."
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC1:
            return "Você lança um 'Encantamento de Escudo' no Guerreiro e na Curandeira."
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC2:
            return "Xarth dispara raios de pura energia sombria. Um deles acerta a Curandeira, mas seu 'Encantamento de Escudo' o rebate no rosto de 'Xarth'!"
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC3_END:
            return "Xarth é derrotado, e o Cajado de Solarion brilha tranquilamente. A ordem foi restaurada ao mundo."
        default:
            return "..."
    }
}

export const getNextScenarioType = (currentScenarioType: ScenarioTypeEnum, decisionType?: DecisionTypeEnum) => {
    switch (currentScenarioType) {
        case ScenarioTypeEnum.CH1_ACT1:
            return ScenarioTypeEnum.CH1_ACT2_DEC
        case ScenarioTypeEnum.CH1_ACT2_DEC:
            return ScenarioTypeEnum.CH2_ACT1
        case ScenarioTypeEnum.CH2_ACT1:
            return ScenarioTypeEnum.CH2_ACT2
        case ScenarioTypeEnum.CH2_ACT2:
            return ScenarioTypeEnum.CH2_ACT3
        case ScenarioTypeEnum.CH2_ACT3:
            return ScenarioTypeEnum.CH3_ACT1_DEC
        case ScenarioTypeEnum.CH3_ACT1_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH3_ACT1_DEC_Front:
                    return ScenarioTypeEnum.CH4_ACT1
                case DecisionTypeEnum.CH3_ACT1_DEC_Back:
                    return ScenarioTypeEnum.CH3_ACT2
                default:
                    return ScenarioTypeEnum.CH3_ACT1_DEC
            }
        case ScenarioTypeEnum.CH3_ACT2:
            return ScenarioTypeEnum.CH5_ACT1
        case ScenarioTypeEnum.CH4_ACT1:
            return ScenarioTypeEnum.CH4_ACT2_DEC
        case ScenarioTypeEnum.CH4_ACT2_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH4_ACT2_DEC_Fight:
                    return ScenarioTypeEnum.CH4_ROT1_ACT1_DEC
                case DecisionTypeEnum.CH4_ACT2_DEC_Run:
                    return ScenarioTypeEnum.CH4_ROT2_ACT1
                default:
                    return ScenarioTypeEnum.CH4_ACT2_DEC
            }
        case ScenarioTypeEnum.CH4_ROT1_ACT1_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Weapon:
                    return ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT1
                case DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Shield:
                    return ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT1
                default:
                    return ScenarioTypeEnum.CH4_ROT1_ACT1_DEC
            }
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT1:
            return ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2:
            return ScenarioTypeEnum.CH5_ACT1
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT1:
            return ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT2
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT2:
            return ScenarioTypeEnum.CH5_ACT1
        case ScenarioTypeEnum.CH4_ROT2_ACT1:
            return ScenarioTypeEnum.CH5_ACT1
        case ScenarioTypeEnum.CH5_ACT1:
            return ScenarioTypeEnum.CH5_ACT2_DEC
        case ScenarioTypeEnum.CH5_ACT2_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH5_ACT2_DEC_Left:
                    return ScenarioTypeEnum.CH6_ACT1
                case DecisionTypeEnum.CH5_ACT2_DEC_Right:
                    return ScenarioTypeEnum.CH7_AC1
                default:
                    return ScenarioTypeEnum.CH5_ACT2_DEC
            }
        case ScenarioTypeEnum.CH6_ACT1:
            return ScenarioTypeEnum.CH6_ACT2
        case ScenarioTypeEnum.CH6_ACT2:
            return ScenarioTypeEnum.CH6_ACT3_DEC
        case ScenarioTypeEnum.CH6_ACT3_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH6_ACT3_DEC_Run:
                    return ScenarioTypeEnum.CH6_ROT1_AC1
                case DecisionTypeEnum.CH6_ACT3_DEC_Break:
                    return ScenarioTypeEnum.CH6_ROT2_AC1
                default:
                    return ScenarioTypeEnum.CH6_ACT3_DEC
            }
        case ScenarioTypeEnum.CH6_ROT1_AC1:
            return ScenarioTypeEnum.CH7_AC1
        case ScenarioTypeEnum.CH6_ROT2_AC1:
            return ScenarioTypeEnum.CH7_AC1
        case ScenarioTypeEnum.CH7_AC1:
            return ScenarioTypeEnum.CH7_AC2
        case ScenarioTypeEnum.CH7_AC2:
            return ScenarioTypeEnum.CH8_AC1
        case ScenarioTypeEnum.CH8_AC1:
            return ScenarioTypeEnum.CH8_AC2
        case ScenarioTypeEnum.CH8_AC2:
            return ScenarioTypeEnum.CH8_AC3
        case ScenarioTypeEnum.CH8_AC3:
            switch (decisionType) {
                case DecisionTypeEnum.CH1_ACT2_DEC_Warrior:
                    return ScenarioTypeEnum.CH8_ROT_WAR_AC1
                case DecisionTypeEnum.CH1_ACT2_DEC_Healer:
                    return ScenarioTypeEnum.CH8_ROT_HEA_AC1
                case DecisionTypeEnum.CH1_ACT2_DEC_Mage:
                    return ScenarioTypeEnum.CH8_ROT_MAG_AC1
                default:
                    return ScenarioTypeEnum.CH8_AC3
            }
        case ScenarioTypeEnum.CH8_ROT_WAR_AC1:
            return ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC
        case ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Sword:
                    return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC1
                case DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Shield:
                    return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC1
                default:
                    return ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC
            }
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC1:
            return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC2
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC2:
            return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC3
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC3:
            return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC4_END
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC4_END:
            return ScenarioTypeEnum.Finished
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC1:
            return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC2
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC2:
            return ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC3_END
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC3_END:
            return ScenarioTypeEnum.Finished
        case ScenarioTypeEnum.CH8_ROT_HEA_AC1:
            return ScenarioTypeEnum.CH8_ROT_HEA_AC2
        case ScenarioTypeEnum.CH8_ROT_HEA_AC2:
            return ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC
        case ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Warrior:
                    return ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC1
                case DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Mage:
                    return ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC1
                default:
                    return ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC
            }
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC1:
            return ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC2_END
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC2_END:
            return ScenarioTypeEnum.Finished
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC1:
            return ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC2_END
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC2_END:
            return ScenarioTypeEnum.Finished
        case ScenarioTypeEnum.CH8_ROT_MAG_AC1:
            return ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC
        case ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC:
            switch (decisionType) {
                case DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Lightning:
                    return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC1
                case DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Shield:
                    return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC1
                default:
                    return ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC
            }
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC1:
            return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC2
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC2:
            return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC3
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC3:
            return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC4_END
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC4_END:
            return ScenarioTypeEnum.Finished
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC1:
            return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC2
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC2:
            return ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC3_END
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC3_END:
            return ScenarioTypeEnum.Finished
        default:
            return ScenarioTypeEnum.None
    }
}

export const getScenarioTypeImage = (type: ScenarioTypeEnum) => {
    switch (type) {
        case ScenarioTypeEnum.CH1_ACT1:
            return CH1TableImg
        case ScenarioTypeEnum.CH1_ACT2_DEC:
            return CH1HeroImg
        case ScenarioTypeEnum.CH2_ACT1:
        case ScenarioTypeEnum.CH2_ACT2:
        case ScenarioTypeEnum.CH2_ACT3:
            return CH2ContextImg
        case ScenarioTypeEnum.CH3_ACT1_DEC:
            return CH3TowerImg
        case ScenarioTypeEnum.CH3_ACT2:
            return CH3TrapImg
        case ScenarioTypeEnum.CH4_ACT1:
        case ScenarioTypeEnum.CH4_ACT2_DEC:
        case ScenarioTypeEnum.CH4_ROT1_ACT1_DEC:
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT1:
        case ScenarioTypeEnum.CH4_ROT1_SUBROT1_ACT2:
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT1:
        case ScenarioTypeEnum.CH4_ROT2_ACT1:
            return CH4SkeletonImg
        case ScenarioTypeEnum.CH4_ROT1_SUBROT2_ACT2:
            return CH4BonesImg
        case ScenarioTypeEnum.CH5_ACT1:
        case ScenarioTypeEnum.CH5_ACT2_DEC:
            return CH5SewerImg
        case ScenarioTypeEnum.CH6_ACT1:
        case ScenarioTypeEnum.CH6_ACT2:
        case ScenarioTypeEnum.CH6_ACT3_DEC:
        case ScenarioTypeEnum.CH6_ROT1_AC1:
        case ScenarioTypeEnum.CH6_ROT2_AC1:
            return CH6CapsulesImg
        case ScenarioTypeEnum.CH7_AC1:
        case ScenarioTypeEnum.CH7_AC2:
            return CH7DoorImg
        case ScenarioTypeEnum.CH8_AC1:
        case ScenarioTypeEnum.CH8_AC2:
        case ScenarioTypeEnum.CH8_AC3:
        case ScenarioTypeEnum.CH8_ROT_WAR_AC1:
        case ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC1:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC2:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC3:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC1:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC2:
        case ScenarioTypeEnum.CH8_ROT_HEA_AC1:
        case ScenarioTypeEnum.CH8_ROT_HEA_AC2:
        case ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC:
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC1:
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC1:
        case ScenarioTypeEnum.CH8_ROT_MAG_AC1:
        case ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC1:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC2:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC3:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC1:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC2:
            return CH8VillainImg
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT1_AC4_END:
        case ScenarioTypeEnum.CH8_ROT_WAR_SUBROT2_AC3_END:
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT1_AC2_END:
        case ScenarioTypeEnum.CH8_ROT_HEA_SUBROT2_AC2_END:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT1_AC4_END:
        case ScenarioTypeEnum.CH8_ROT_MAG_SUBROT2_AC3_END:
            return CH8DustImg
        default:
            return NotFoundImg
    }
}

export const listDecisionByScenario = (scenarioType: ScenarioTypeEnum): DecisionViewModel[] => {
    let list: DecisionTypeEnum[] = []

    switch (scenarioType) {
        case ScenarioTypeEnum.CH1_ACT2_DEC:
            list = [
                DecisionTypeEnum.CH1_ACT2_DEC_Warrior,
                DecisionTypeEnum.CH1_ACT2_DEC_Healer,
                DecisionTypeEnum.CH1_ACT2_DEC_Mage,
            ]
            break
        case ScenarioTypeEnum.CH3_ACT1_DEC:
            list = [
                DecisionTypeEnum.CH3_ACT1_DEC_Front,
                DecisionTypeEnum.CH3_ACT1_DEC_Back,
            ]
            break
        case ScenarioTypeEnum.CH4_ACT2_DEC:
            list = [
                DecisionTypeEnum.CH4_ACT2_DEC_Fight,
                DecisionTypeEnum.CH4_ACT2_DEC_Run,
            ]
            break
        case ScenarioTypeEnum.CH4_ROT1_ACT1_DEC:
            list = [
                DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Weapon,
                DecisionTypeEnum.CH4_ROT1_ACT1_DEC_Shield,
            ]
            break
        case ScenarioTypeEnum.CH5_ACT2_DEC:
            list = [
                DecisionTypeEnum.CH5_ACT2_DEC_Left,
                DecisionTypeEnum.CH5_ACT2_DEC_Right,
            ]
            break
        case ScenarioTypeEnum.CH6_ACT3_DEC:
            list = [
                DecisionTypeEnum.CH6_ACT3_DEC_Run,
                DecisionTypeEnum.CH6_ACT3_DEC_Break,
            ]
            break
        case ScenarioTypeEnum.CH8_ROT_WAR_AC2_DEC:
            list = [
                DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Sword,
                DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Shield,
            ]
            break
        case ScenarioTypeEnum.CH8_ROT_HEA_AC3_DEC:
            list = [
                DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Warrior,
                DecisionTypeEnum.CH8_ROT_HEA_AC3_DEC_Mage,
            ]
            break
        case ScenarioTypeEnum.CH8_ROT_MAG_AC2_DEC:
            list = [
                DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Lightning,
                DecisionTypeEnum.CH8_ROT_MAG_AC2_DEC_Shield,
            ]
            break
    }

    return list.map(x => ({
        decisionType: x,
        decisionTypeValue: getDecisionTypeEnumValue(x)
    }))
}
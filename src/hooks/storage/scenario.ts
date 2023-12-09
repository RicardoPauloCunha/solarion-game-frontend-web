import { DecisionTypeEnum } from "../../types/enums/decisionType"
import { ScenarioTypeEnum } from "../../types/enums/scenarioType"

export const SCENARIO_DATA_KEY = "@SolarionGame:scenario-data"

export interface ScenarioData {
    scenarioType: ScenarioTypeEnum
    decisions: DecisionTypeEnum[]
    creationDate: Date
}

export const setScenarioStorage = (data: ScenarioData) => {
    localStorage.setItem(SCENARIO_DATA_KEY, JSON.stringify(data))
}

export const getScenarioStorage = () => {
    let data = localStorage.getItem(SCENARIO_DATA_KEY)

    if (data === null)
        return undefined

    try {
        return JSON.parse(data) as ScenarioData
    } catch (error) {
        return undefined
    }
}

export const removeScenarioStorage = () => {
    localStorage.removeItem(SCENARIO_DATA_KEY)
}
import { createContext, ReactNode, useContext } from 'react'

interface ScenarioContextData {

}

export const ScenarioContext = createContext({} as ScenarioContextData)

interface ScenarioContextProviderProps {
    children: ReactNode
}

export const ScenarioContextProvider = ({ children }: ScenarioContextProviderProps) => {

    return (
        <ScenarioContext.Provider value={{

        }}>
            {children}
        </ScenarioContext.Provider>
    )
}

export const useScenarioContext = () => {
    return useContext(ScenarioContext)
}

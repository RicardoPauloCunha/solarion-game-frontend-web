import { useEffect } from 'react';
import AppRoutes from './app.routes';
import { defineValidatorErrorDictionary } from './config/validator/dictionary';
import { AuthContextProvider } from './hooks/contexts/auth';
import { ScenarioContextProvider } from './hooks/contexts/scenario';
import GlobalStyles from './styles/global';

const App = () => {
    useEffect(() => {
        defineValidatorErrorDictionary()
    }, [])

    return (
        <AuthContextProvider>
            <ScenarioContextProvider>
                <div className="App">
                    <AppRoutes />
                    <GlobalStyles />
                </div>
            </ScenarioContextProvider>
        </AuthContextProvider>
    );
}

export default App

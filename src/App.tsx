import { useEffect } from 'react';
import AppRoutes from './app.routes';
import { defineValidatorErrorDictionary } from './config/validator/dictionary';
import { AuthContextProvider } from './hooks/contexts/auth';
import GlobalStyles from './styles/global';

const App = () => {
    useEffect(() => {
        defineValidatorErrorDictionary()
    }, [])

    return (
        <AuthContextProvider>
            <div className="App">
                <AppRoutes />
                <GlobalStyles />
            </div>
        </AuthContextProvider>
    );
}

export default App

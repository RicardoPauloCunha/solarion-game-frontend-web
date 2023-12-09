import { useEffect } from 'react'
import { defineValidatorErrorDictionary } from './config/validator/dictionary'
import { AuthContextProvider } from './hooks/contexts/auth'
import AppRoutes from './routes/app.routes'
import GlobalStyles from './styles/global'

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
    )
}

export default App
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Login from "."
import { createAxiosError } from "../../config/axios/error"
import { ErrorDictionary, defineValidatorErrorDictionary, replaceVariableInErrorDictionaryMessage } from "../../config/validator/dictionary"
import * as userApiFile from "../../hooks/api/user"
import { AuthContext, AuthContextData } from "../../hooks/contexts/auth"
import * as tokenStorageFile from "../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { UserTypeEnum } from "../../types/enums/userType"
import { testSubmitForm, testTypeInInput } from "../../utils/test"

const mockLoginApi = jest.spyOn(userApiFile, 'loginApi')
const mockSetTokenStorage = jest.spyOn(tokenStorageFile, "setTokenStorage")
const mockDefineLoggedUserByToken = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const renderPage = async (options?: {
    submitValidLoginForm?: boolean,
    mockSuccessfulLoginRequest?: boolean,
    mockFailLoginRequest?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const email = 'email@mail.com'
    const password = 'password'
    const result = 'jwt-token'
    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulLoginRequest) {
        mockLoginApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result
        })
    }
    else if (options?.mockFailLoginRequest) {
        mockLoginApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    render(<AuthContext.Provider
        value={{
            defineLoggedUserByToken: mockDefineLoggedUserByToken
        } as unknown as AuthContextData}
    >
        <Login />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    if (options?.submitValidLoginForm) {
        await testTypeInInput('Email', email)
        await testTypeInInput('Senha', password)
        await testSubmitForm('Entrar')
    }

    return {
        form: {
            email,
            password
        },
        result,
        errorMessage
    }
}

// TODO: Test loading message in button when submit form
// TODO: Test warning reset
// TODO: Test error message reset

describe('Login page', () => {
    it('should render the login page', async () => {
        await renderPage()

        const title = screen.getByRole('heading', { name: 'Login' })
        const emailInput = screen.getByLabelText('Email')
        const passwordInput = screen.getByLabelText('Senha')
        const warning = screen.queryByRole('alert')
        const loginButton = screen.getByRole('button', { name: 'Entrar' })
        const forgotPasswordLink = screen.getByRole('link', { name: 'Esqueci minha senha' })
        const signupLink = screen.getByRole('link', { name: 'Registrar-se' })

        expect(title).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(loginButton).toBeInTheDocument()
        expect(forgotPasswordLink).toBeInTheDocument()
        expect(signupLink).toBeInTheDocument()
    })

    describe('when click in the link', () => {
        it.each([
            ['recover password', 'Esqueci minha senha', DefaultRoutePathEnum.RecoverPassword],
            ['register account', 'Registrar-se', DefaultRoutePathEnum.RegisterAccount],
        ])('should call the navigation function to %p page', async (caseName, linkName, linkPath) => {
            await renderPage()

            const link = screen.getByRole('link', { name: linkName })
            await userEvent.click(link)

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(linkPath, expect.anything())
        })
    })

    describe('when submit login form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage()

                await testSubmitForm('Entrar')

                const warning = screen.getByRole('alert')
                const warningTitle = screen.getByText('Dados inválidos')

                expect(warning).toBeInTheDocument()
                expect(warningTitle).toBeInTheDocument()
            })

            describe('and when no value', () => {
                it('should show a required error in the inputs', async () => {
                    await renderPage()

                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Email', 'e')
                    await testTypeInInput('Senha', 'p')
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testTypeInInput('Senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '80'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when out of format', () => {
                it.each([
                    ['email'],
                    ['email.email'],
                    ['email@'],
                    ['email@@'],
                    ['email@.'],
                    ['email@.e'],
                ])('should show a email error in the inputs for %p', async (emailInputValue) => {
                    await renderPage()

                    await testTypeInInput('Email', emailInputValue)
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.string.email,
                        ErrorDictionary.mixed.required,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call the login request', async () => {
                const props = await renderPage({ submitValidLoginForm: true })

                expect(mockLoginApi).toHaveBeenCalledTimes(1)
                expect(mockLoginApi).toHaveBeenCalledWith({
                    email: props.form.email,
                    password: props.form.password
                })
            })

            describe('and when the login request succeeds', () => {
                it('should call the set token storage function', async () => {
                    const props = await renderPage({ submitValidLoginForm: true, mockSuccessfulLoginRequest: true })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(props.result)
                })

                it.each([
                    ['scores', UserTypeEnum.Admin, DefaultRoutePathEnum.Scores],
                    ['my scores', UserTypeEnum.Common, DefaultRoutePathEnum.MyScores],
                ])('should call the navigation function to %p page', async (caseName, userType, linkPath) => {
                    mockDefineLoggedUserByToken.mockReturnValue({
                        userId: 1,
                        name: 'Name',
                        userType
                    })

                    await renderPage({ submitValidLoginForm: true, mockSuccessfulLoginRequest: true })

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(linkPath)
                })
            })

            describe('and when the login request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({ submitValidLoginForm: true, mockFailLoginRequest: true })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(props.errorMessage)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })
})
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

const EMAIL = 'email@mail.com'
const PASSWORD = 'password'
const TOKEN = 'jwt-token'
const ERROR_MESSAGE = 'Error message.'

const renderPage = async (options?: {
    submitValidLoginForm?: boolean,
    mockFailLoginApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    if (options?.mockFailLoginApi) {
        mockLoginApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockLoginApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: TOKEN
        })
    }

    render(<AuthContext.Provider
        value={{
            defineLoggedUserByToken: mockDefineLoggedUserByToken
        } as unknown as AuthContextData}
    >
        <Login />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    if (options?.submitValidLoginForm) {
        await testTypeInInput('Email', EMAIL)
        await testTypeInInput('Senha', PASSWORD)
        await testSubmitForm('Entrar')
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

    describe('when click in the bottom link', () => {
        it.each([
            [DefaultRoutePathEnum.RecoverPassword, 'Esqueci minha senha'],
            [DefaultRoutePathEnum.RegisterAccount, 'Registrar-se'],
        ])('should call navigate function to %p', async (linkPath, linkName) => {
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
                    const errors = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required
                    ]

                    await renderPage()

                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                    ]

                    await renderPage()

                    await testTypeInInput('Email', 'e')
                    await testTypeInInput('Senha', 'p')
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '80'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
                    ]

                    await renderPage()

                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testTypeInInput('Senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
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
                    const errors = [
                        ErrorDictionary.string.email,
                        ErrorDictionary.mixed.required,
                    ]

                    await renderPage()

                    await testTypeInInput('Email', emailInputValue)
                    await testSubmitForm('Entrar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call loginApi request', async () => {
                await renderPage({
                    submitValidLoginForm: true
                })

                expect(mockLoginApi).toHaveBeenCalledTimes(1)
                expect(mockLoginApi).toHaveBeenCalledWith({
                    email: EMAIL,
                    password: PASSWORD
                })
            })

            describe('and when loginApi request succeeds', () => {
                it('should call setTokenStorage function', async () => {
                    await renderPage({
                        submitValidLoginForm: true,
                    })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(TOKEN)
                })

                it.each([
                    [DefaultRoutePathEnum.Scores, UserTypeEnum.Admin],
                    [DefaultRoutePathEnum.MyScores, UserTypeEnum.Common],
                ])('should call navigate function to %p', async (linkPath, userType) => {
                    mockDefineLoggedUserByToken.mockReturnValue({
                        userId: 1,
                        name: 'Name',
                        userType
                    })

                    await renderPage({
                        submitValidLoginForm: true,
                    })

                    expect(mockNavigate).toHaveBeenCalledTimes(1)
                    expect(mockNavigate).toHaveBeenCalledWith(linkPath)
                })
            })

            describe('and when loginApi request fails', () => {
                it('should show a warning with the error', async () => {
                    await renderPage({
                        submitValidLoginForm: true,
                        mockFailLoginApi: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(ERROR_MESSAGE)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import RegisterAccount from "."
import { createAxiosError } from "../../config/axios/error"
import { ErrorDictionary, defineValidatorErrorDictionary, replaceVariableInErrorDictionaryMessage } from "../../config/validator/dictionary"
import * as userApiFile from "../../hooks/api/user"
import { AuthContext, AuthContextData } from "../../hooks/contexts/auth"
import * as tokenStorageFile from "../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { testSubmitForm, testTypeInInput } from "../../utils/test"

const mockCreateCommonUserApi = jest.spyOn(userApiFile, 'createCommonUserApi')
const mockSetTokenStorage = jest.spyOn(tokenStorageFile, "setTokenStorage");
const mockDefineLoggedUserByToken = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const renderPage = async (options?: {
    submitValidAccountForm?: boolean,
    mockSuccessfulCreateCommonUserRequest?: boolean,
    mockFailCreateCommonUserRequest?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const name = 'Name'
    const email = 'email@mail'
    const password = 'password'
    const result = 'jwt-token'
    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulCreateCommonUserRequest) {
        mockCreateCommonUserApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result
        })
    }
    else if (options?.mockFailCreateCommonUserRequest) {
        mockCreateCommonUserApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    render(<AuthContext.Provider
        value={{
            defineLoggedUserByToken: mockDefineLoggedUserByToken
        } as unknown as AuthContextData}
    >
        <RegisterAccount />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    if (options?.submitValidAccountForm) {
        await testTypeInInput('Nome', name)
        await testTypeInInput('Email', email)
        await testTypeInInput('Senha', password)
        await testTypeInInput('Confirme sua senha', password)
        await testSubmitForm('Criar conta')
    }

    return {
        form: {
            name,
            email,
            password
        },
        result,
        errorMessage
    }
}

describe('RegisterAccount Page', () => {
    it('should render the register account page', async () => {
        await renderPage()

        const title = screen.getByRole('heading', { name: 'Registrar-se' })
        const nameInput = screen.getByLabelText('Nome')
        const emailInput = screen.getByLabelText('Email')
        const passwordInput = screen.getByLabelText('Senha')
        const confirmPasswordInput = screen.getByLabelText('Confirme sua senha')
        const warning = screen.queryByRole('alert')
        const createAccountButton = screen.getByRole('button', { name: 'Criar conta' })
        const loginLink = screen.getByRole('link', { name: 'Já tenho uma conta' })
        const modalTitle = screen.queryByRole('heading', { name: 'Conta criada' })

        expect(title).toBeInTheDocument()
        expect(nameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(confirmPasswordInput).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(createAccountButton).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
        expect(modalTitle).toBeNull()
    })

    describe('when click in the bottom link', () => {
        it('should call the navigation function to login page', async () => {
            await renderPage()

            const link = screen.getByRole('link', { name: 'Já tenho uma conta' })
            await userEvent.click(link)

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login, expect.anything())
        })
    })

    describe('when submit account form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage()

                await testSubmitForm('Criar conta')

                const warning = screen.getByRole('alert')
                const warningTitle = screen.getByText('Dados inválidos')

                expect(warning).toBeInTheDocument()
                expect(warningTitle).toBeInTheDocument()
            })

            describe('and when no value', () => {
                it('should show a required error in the inputs', async () => {
                    await renderPage()

                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Nome', 'n')
                    await testTypeInInput('Email', 'e')
                    await testTypeInInput('Senha', 'p')
                    await testTypeInInput('Confirme sua senha', 'p')
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Nome', 'NameNameNameNameNameNameNameNameNameName1')
                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testTypeInInput('Senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Confirme sua senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '40'),
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
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.string.email,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })

                it.each([
                    ['Xpassword', 'password'],
                    ['passwordX', 'password'],
                    ['passXword', 'password'],
                    ['password ', 'password'],
                    [' password', 'password'],
                    ['pass word', 'password'],
                ])('should show a comparison error in the passwords input for %p', async (confirmPassword, password) => {
                    await renderPage()

                    await testTypeInInput('Senha', password)
                    await testTypeInInput('Confirme sua senha', confirmPassword)
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        'As senhas precisam ser iguais.',
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call the create common user request', async () => {
                const props = await renderPage({
                    submitValidAccountForm: true
                })

                expect(mockCreateCommonUserApi).toHaveBeenCalledTimes(1)
                expect(mockCreateCommonUserApi).toHaveBeenCalledWith({
                    name: props.form.name,
                    email: props.form.email,
                    password: props.form.password
                })
            })

            describe('and when the create common user request succeeds', () => {
                it('should call the set token storage function', async () => {
                    const props = await renderPage({
                        submitValidAccountForm: true,
                        mockSuccessfulCreateCommonUserRequest: true
                    })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(props.result)
                })

                it('should open success modal', async () => {
                    await renderPage({
                        submitValidAccountForm: true,
                        mockSuccessfulCreateCommonUserRequest: true
                    })

                    const modalTitle = screen.getByRole('heading', { name: 'Conta criada' })
                    const modalMessagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Conta de usuário criada com sucesso.',
                        'Agora você pode salvar a pontuação das suas aventuras.'
                    ]
                    const okButton = screen.getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(okButton).toBeInTheDocument()
                })
            })

            describe('and when the create common user request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        submitValidAccountForm: true,
                        mockFailCreateCommonUserRequest: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(props.errorMessage)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when success modal is opened', () => {
        describe('and when click in ok button', () => {
            it('should call the navigation function to my scores page', async () => {
                await renderPage({
                    submitValidAccountForm: true,
                    mockSuccessfulCreateCommonUserRequest: true
                })

                const link = screen.getByRole('button', { name: 'Entendi' })
                await userEvent.click(link)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores)
            })
        })

        describe('and when close the modal', () => {
            it('should call the navigation function to my scores page', async () => {
                await renderPage({
                    submitValidAccountForm: true,
                    mockSuccessfulCreateCommonUserRequest: true
                })

                const closeButton = screen.getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeButton)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores)
            })
        })
    })
})
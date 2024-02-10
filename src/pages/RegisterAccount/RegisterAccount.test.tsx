import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import RegisterAccount from "."
import { createAxiosError } from "../../config/axios/error"
import { ErrorDictionary, defineValidatorErrorDictionary, replaceVariableInErrorDictionaryMessage } from "../../config/validator/dictionary"
import * as userApiFile from "../../hooks/api/user"
import { AuthContext, AuthContextData } from "../../hooks/contexts/auth"
import * as tokenStorageFile from "../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { UserTypeEnum } from "../../types/enums/userType"
import { testSubmitForm, testTypeInInput } from "../../utils/test"

const mockCreateCommonUserApi = jest.spyOn(userApiFile, 'createCommonUserApi')
const mockSetTokenStorage = jest.spyOn(tokenStorageFile, "setTokenStorage")
const mockDefineLoggedUserByToken = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const NAME = 'Name'
const EMAIL = 'email@mail'
const PASSWORD = 'password'
const TOKEN = 'jwt-token'
const ERROR_MESSAGE = 'Error message.'

const renderPage = async (options?: {
    submitValidAccountForm?: boolean,
    mockFailCreateCommonUserApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    if (options?.mockFailCreateCommonUserApi) {
        mockCreateCommonUserApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockCreateCommonUserApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: TOKEN
        })
    }

    mockDefineLoggedUserByToken.mockReturnValue({
        userId: 1,
        name: NAME,
        userType: UserTypeEnum.Common
    })

    render(<AuthContext.Provider
        value={{
            defineLoggedUserByToken: mockDefineLoggedUserByToken
        } as unknown as AuthContextData}
    >
        <RegisterAccount />
    </AuthContext.Provider>, { wrapper: BrowserRouter })

    if (options?.submitValidAccountForm) {
        await testTypeInInput('Nome', NAME)
        await testTypeInInput('Email', EMAIL)
        await testTypeInInput('Senha', PASSWORD)
        await testTypeInInput('Confirme sua senha', PASSWORD)
        await testSubmitForm('Criar conta')
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
        const modal = screen.queryByRole('dialog')

        expect(title).toBeInTheDocument()
        expect(nameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(confirmPasswordInput).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(createAccountButton).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
        expect(modal).toBeNull()
    })

    describe('when click in the bottom link', () => {
        it('should call navigate function to login page', async () => {
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
                    const errors = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    await renderPage()

                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                    ]

                    await renderPage()

                    await testTypeInInput('Nome', 'n')
                    await testTypeInInput('Email', 'e')
                    await testTypeInInput('Senha', 'p')
                    await testTypeInInput('Confirme sua senha', 'p')
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '40'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '80'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
                    ]

                    await renderPage()

                    await testTypeInInput('Nome', 'NameNameNameNameNameNameNameNameNameName1')
                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testTypeInInput('Senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Confirme sua senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Criar conta')

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
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.string.email,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    await renderPage()

                    await testTypeInInput('Email', emailInputValue)
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })

                it.each([
                    ['Xpassword', 'password'],
                    ['passwordX', 'password'],
                    ['passXword', 'password'],
                    ['password ', 'password'],
                    [' password', 'password'],
                    ['pass word', 'password'],
                ])('should show a comparison error in the passwords input for %p', async (confirmPassword, password) => {
                    const errors = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        'As senhas precisam ser iguais.',
                    ]

                    await renderPage()

                    await testTypeInInput('Senha', password)
                    await testTypeInInput('Confirme sua senha', confirmPassword)
                    await testSubmitForm('Criar conta')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call createCommonUserApi request', async () => {
                await renderPage({
                    submitValidAccountForm: true
                })

                expect(mockCreateCommonUserApi).toHaveBeenCalledTimes(1)
                expect(mockCreateCommonUserApi).toHaveBeenCalledWith({
                    name: NAME,
                    email: EMAIL,
                    password: PASSWORD
                })
            })

            describe('and when createCommonUserApi request succeeds', () => {
                it('should call setTokenStorage function', async () => {
                    await renderPage({
                        submitValidAccountForm: true,
                    })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(TOKEN)
                })

                it('should open success modal', async () => {
                    const texts = [
                        'Conta de usuário criada com sucesso.',
                        'Agora você pode salvar a pontuação das suas aventuras.'
                    ]

                    await renderPage({
                        submitValidAccountForm: true,
                    })

                    const modal = screen.getByRole('dialog')
                    const modalTitle = within(modal).getByRole('heading', { name: 'Conta criada' })
                    const modalMessageTexts = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
                    const modalButton = within(modal).getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessageTexts).toEqual(texts)
                    expect(modalButton).toBeInTheDocument()
                })
            })

            describe('and when createCommonUserApi request fails', () => {
                it('should show a warning with the error', async () => {
                    await renderPage({
                        submitValidAccountForm: true,
                        mockFailCreateCommonUserApi: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(ERROR_MESSAGE)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when success modal is open', () => {
        describe('and when click in modal button', () => {
            it('should call navigate function to my scores page', async () => {
                await renderPage({
                    submitValidAccountForm: true,
                })

                const modal = screen.getByRole('dialog')
                const modalButton = within(modal).getByRole('button', { name: 'Entendi' })
                await userEvent.click(modalButton)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores)
            })
        })

        describe('and when click to close the modal', () => {
            it('should call navigate function to my scores page', async () => {
                await renderPage({
                    submitValidAccountForm: true,
                })

                const modal = screen.getByRole('dialog')
                const closeIcon = within(modal).getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeIcon)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.MyScores)
            })
        })
    })
})
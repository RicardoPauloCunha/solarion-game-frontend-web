import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import RecoverPassword from "."
import { createAxiosError } from "../../config/axios/error"
import { ErrorDictionary, defineValidatorErrorDictionary, replaceVariableInErrorDictionaryMessage } from "../../config/validator/dictionary"
import * as passwordRecoveryApiFile from "../../hooks/api/passwordRecovery"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { testSubmitForm, testTypeInInput } from "../../utils/test"

const mockSolicitPasswordRecoveryApi = jest.spyOn(passwordRecoveryApiFile, 'solicitPasswordRecoveryApi')
const mockReplyPasswordRecoveryApi = jest.spyOn(passwordRecoveryApiFile, 'replyPasswordRecoveryApi')
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const EMAIL = 'email@mail.com'
const VERIFICATION_CODE = '123456'
const PASSWORD = 'password'
const ERROR_MESSAGE = 'Error message.'

const renderPage = async (options?: {
    submitValidSolicitForm?: boolean,
    mockFailSolicitPasswordRecoveryApi?: boolean,
    submitValidRecoveryForm?: boolean
    mockFailReplyPasswordRecoveryApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    if (options?.mockFailSolicitPasswordRecoveryApi) {
        mockSolicitPasswordRecoveryApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockSolicitPasswordRecoveryApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }

    if (options?.mockFailReplyPasswordRecoveryApi) {
        mockReplyPasswordRecoveryApi.mockRejectedValue(createAxiosError(400, ERROR_MESSAGE))
    }
    else {
        mockReplyPasswordRecoveryApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }

    render(<RecoverPassword />, { wrapper: BrowserRouter })

    if (options?.submitValidSolicitForm) {
        await testTypeInInput('Email', EMAIL)
        await testSubmitForm('Avançar')
    }

    if (options?.submitValidRecoveryForm) {
        await testTypeInInput('Código de verificação', VERIFICATION_CODE)
        await testTypeInInput('Nova senha', PASSWORD)
        await testTypeInInput('Confirme sua nova senha', PASSWORD)
        await testSubmitForm('Alterar senha')
    }
}

describe('RecoverPassword Page', () => {
    it('should render the recover password page', async () => {
        await renderPage()

        const title = screen.getByRole('heading', { name: 'Recuperar senha' })
        const emailInput = screen.getByLabelText('Email')
        const warning = screen.queryByRole('alert')
        const forwardButton = screen.getByRole('button', { name: 'Avançar' })
        const loginLink = screen.getByRole('link', { name: 'Tentar entrar novamente' })
        const modal = screen.queryByRole('dialog')

        expect(title).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(forwardButton).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
        expect(modal).toBeNull()
    })

    describe('when click in the bottom link', () => {
        it('should call navigate function to login page', async () => {
            await renderPage()

            const link = screen.getByRole('link', { name: 'Tentar entrar novamente' })
            await userEvent.click(link)

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login, expect.anything())
        })

        describe('and when recovery solicitation is sent', () => {
            it('should call navigate function to recover password page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                })

                const link = screen.getByRole('link', { name: 'Voltar' })
                await userEvent.click(link)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.RecoverPassword, expect.anything())
            })

            it('should replace recovery form by solicit form', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                })

                const link = screen.getByRole('link', { name: 'Voltar' })
                await userEvent.click(link)

                const text = screen.queryByText(`Foi enviado para o email (${EMAIL}) o código de verificação para a recuperação de senha.`)
                const codeInput = screen.queryByLabelText('Código de verificação')
                const passwordInput = screen.queryByLabelText('Nova senha')
                const confirmPasswordInput = screen.queryByLabelText('Confirme sua nova senha')
                const changePasswordButton = screen.queryByRole('button', { name: 'Alterar senha' })
                const backLink = screen.queryByRole('link', { name: 'Voltar' })
                const emailInput = screen.getByLabelText('Email')
                const forwardButton = screen.getByRole('button', { name: 'Avançar' })
                const loginLink = screen.getByRole('link', { name: 'Tentar entrar novamente' })
                const warning = screen.queryByRole('alert')
                const modal = screen.queryByRole('dialog')

                expect(text).toBeNull()
                expect(codeInput).toBeNull()
                expect(passwordInput).toBeNull()
                expect(confirmPasswordInput).toBeNull()
                expect(changePasswordButton).toBeNull()
                expect(backLink).toBeNull()
                expect(emailInput).toBeInTheDocument()
                expect(warning).toBeNull()
                expect(forwardButton).toBeInTheDocument()
                expect(loginLink).toBeInTheDocument()
                expect(modal).toBeNull()
            })
        })
    })

    describe('when submit solicit form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage()

                await testSubmitForm('Avançar')

                const warning = screen.getByRole('alert')
                const warningTitle = screen.getByText('Dados inválidos')

                expect(warning).toBeInTheDocument()
                expect(warningTitle).toBeInTheDocument()
            })

            describe('and when no value', () => {
                it('should show a required error in the inputs', async () => {
                    const errors = [
                        ErrorDictionary.mixed.required
                    ]

                    await renderPage()

                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                    ]

                    await renderPage()

                    await testTypeInInput('Email', 'e')
                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '80'),
                    ]

                    await renderPage()

                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testSubmitForm('Avançar')

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
                    ]

                    await renderPage()

                    await testTypeInInput('Email', emailInputValue)
                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call solicitPasswordRecoveryApi request', async () => {
                await renderPage({
                    submitValidSolicitForm: true
                })

                expect(mockSolicitPasswordRecoveryApi).toHaveBeenCalledTimes(1)
                expect(mockSolicitPasswordRecoveryApi).toHaveBeenCalledWith({
                    email: EMAIL
                })
            })

            describe('and when solicitPasswordRecoveryApi request succeeds', () => {
                it('should replace solicit form by recovery form', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                    })

                    const emailInput = screen.queryByLabelText('Email')
                    const forwardButton = screen.queryByRole('button', { name: 'Avançar' })
                    const loginLink = screen.queryByRole('link', { name: 'Tentar entrar novamente' })
                    const text = screen.getByText(`Foi enviado para o email (${EMAIL}) o código de verificação para a recuperação de senha.`)
                    const codeInput = screen.getByLabelText('Código de verificação')
                    const passwordInput = screen.getByLabelText('Nova senha')
                    const confirmPasswordInput = screen.getByLabelText('Confirme sua nova senha')
                    const changePasswordButton = screen.getByRole('button', { name: 'Alterar senha' })
                    const backLink = screen.getByRole('link', { name: 'Voltar' })
                    const warning = screen.queryByRole('alert')
                    const modal = screen.queryByRole('dialog')

                    expect(emailInput).toBeNull()
                    expect(forwardButton).toBeNull()
                    expect(loginLink).toBeNull()
                    expect(text).toBeInTheDocument()
                    expect(codeInput).toBeInTheDocument()
                    expect(passwordInput).toBeInTheDocument()
                    expect(confirmPasswordInput).toBeInTheDocument()
                    expect(changePasswordButton).toBeInTheDocument()
                    expect(backLink).toBeInTheDocument()
                    expect(warning).toBeNull()
                    expect(modal).toBeNull()
                })
            })

            describe('and when solicitPasswordRecoveryApi request fails', () => {
                it('should show a warning with the error', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockFailSolicitPasswordRecoveryApi: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(ERROR_MESSAGE)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when submit recovery form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                })

                await testSubmitForm('Alterar senha')

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
                    ]

                    await renderPage({
                        submitValidSolicitForm: true,
                    })

                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.length, '6'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6')
                    ]

                    await renderPage({
                        submitValidSolicitForm: true,
                    })

                    await testTypeInInput('Código de verificação', '1')
                    await testTypeInInput('Nova senha', 'p')
                    await testTypeInInput('Confirme sua nova senha', 'p')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    const errors = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.length, '6'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
                    ]

                    await renderPage({
                        submitValidSolicitForm: true,
                    })

                    await testTypeInInput('Código de verificação', '1234567')
                    await testTypeInInput('Nova senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Confirme sua nova senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })

            describe('and when out of format', () => {
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
                        'As senhas precisam ser iguais.',
                    ]

                    await renderPage({
                        submitValidSolicitForm: true,
                    })

                    await testTypeInInput('Nova senha', password)
                    await testTypeInInput('Confirme sua nova senha', confirmPassword)
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)

                    expect(inputsErrorText).toEqual(errors)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call replyPasswordRecoveryApi request', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    submitValidRecoveryForm: true
                })

                expect(mockReplyPasswordRecoveryApi).toHaveBeenCalledTimes(1)
                expect(mockReplyPasswordRecoveryApi).toHaveBeenCalledWith({
                    verificationCode: VERIFICATION_CODE,
                    email: EMAIL,
                    password: PASSWORD
                })
            })

            describe('and when replyPasswordRecoveryApi request succeeds', () => {
                it('should open success modal', async () => {
                    const texts = [
                        'Senha da conta alterada com sucesso.',
                        'Faça login usando o email e a nova senha para continuar a registrar a pontuação das suas aventuras.'
                    ]

                    await renderPage({
                        submitValidSolicitForm: true,
                        submitValidRecoveryForm: true,
                    })

                    const modal = screen.getByRole('dialog')
                    const modalTitle = within(modal).getByRole('heading', { name: 'Senha alterada' })
                    const modalMessageTexts = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
                    const modalButton = within(modal).getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessageTexts).toEqual(texts)
                    expect(modalButton).toBeInTheDocument()
                })
            })

            describe('and when replyPasswordRecoveryApi request fails', () => {
                it('should show a warning with the error', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        submitValidRecoveryForm: true,
                        mockFailReplyPasswordRecoveryApi: true
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
            it('should call navigate function to login page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    submitValidRecoveryForm: true,
                })

                const modal = screen.getByRole('dialog')
                const modalButton = within(modal).getByRole('button', { name: 'Entendi' })
                await userEvent.click(modalButton)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login)
            })
        })

        describe('and when click to close the modal', () => {
            it('should call navigate function to login page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    submitValidRecoveryForm: true,
                })

                const modal = screen.getByRole('dialog')
                const closeIcon = within(modal).getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeIcon)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login)
            })
        })
    })
})
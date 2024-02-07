import { render, screen } from "@testing-library/react"
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

const renderPage = async (options?: {
    submitValidSolicitForm?: boolean,
    mockSuccessfulSolicitPasswordRecoveryRequest?: boolean,
    mockFailSolicitPasswordRecoveryRequest?: boolean,
    submitValidRecoveryForm?: boolean
    mockSuccessfulReplyPasswordRecoveryRequest?: boolean,
    mockFailReplyPasswordRecoveryRequest?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const email = 'email@mail.com'
    const verificationCode = '123456'
    const password = 'password'
    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulSolicitPasswordRecoveryRequest) {
        mockSolicitPasswordRecoveryApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }
    else if (options?.mockFailSolicitPasswordRecoveryRequest) {
        mockSolicitPasswordRecoveryApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    if (options?.mockSuccessfulReplyPasswordRecoveryRequest) {
        mockReplyPasswordRecoveryApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }
    else if (options?.mockFailReplyPasswordRecoveryRequest) {
        mockReplyPasswordRecoveryApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    render(<RecoverPassword />, { wrapper: BrowserRouter })

    if (options?.submitValidSolicitForm) {
        await testTypeInInput('Email', email)
        await testSubmitForm('Avançar')
    }

    if (options?.submitValidRecoveryForm) {
        await testTypeInInput('Código de verificação', verificationCode)
        await testTypeInInput('Nova senha', password)
        await testTypeInInput('Confirme sua nova senha', password)
        await testSubmitForm('Alterar senha')
    }

    return {
        form: {
            email,
            verificationCode,
            password
        },
        result: null,
        errorMessage
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
        const modalTitle = screen.queryByRole('heading', { name: 'Senha alterada' })

        expect(title).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(forwardButton).toBeInTheDocument()
        expect(loginLink).toBeInTheDocument()
        expect(modalTitle).toBeNull()
    })

    describe('when click in the bottom link', () => {
        it('should call the navigation function to login page', async () => {
            await renderPage()

            const link = screen.getByRole('link', { name: 'Tentar entrar novamente' })
            await userEvent.click(link)

            expect(mockNavigate).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login, expect.anything())
        })

        describe('and when recovery solicitation is sent', () => {
            it('should call the navigation function to recover password page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true
                })

                const link = screen.getByRole('link', { name: 'Voltar' })
                await userEvent.click(link)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.RecoverPassword, expect.anything())
            })

            it('should replace password recovery form by solicit recovery form', async () => {
                const props = await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true
                })

                const link = screen.getByRole('link', { name: 'Voltar' })
                await userEvent.click(link)

                const text = screen.queryByText(`Foi enviado para o email (${props.form.email}) o código de verificação para a recuperação de senha.`)
                const codeInput = screen.queryByLabelText('Código de verificação')
                const passwordInput = screen.queryByLabelText('Nova senha')
                const confirmPasswordInput = screen.queryByLabelText('Confirme sua nova senha')
                const changePasswordButton = screen.queryByRole('button', { name: 'Alterar senha' })
                const backLink = screen.queryByRole('link', { name: 'Voltar' })

                expect(text).toBeNull()
                expect(codeInput).toBeNull()
                expect(passwordInput).toBeNull()
                expect(confirmPasswordInput).toBeNull()
                expect(changePasswordButton).toBeNull()
                expect(backLink).toBeNull()

                const emailInput = screen.getByLabelText('Email')
                const warning = screen.queryByRole('alert')
                const forwardButton = screen.getByRole('button', { name: 'Avançar' })
                const loginLink = screen.getByRole('link', { name: 'Tentar entrar novamente' })
                const modalTitle = screen.queryByRole('heading', { name: 'Senha alterada' })

                expect(emailInput).toBeInTheDocument()
                expect(warning).toBeNull()
                expect(forwardButton).toBeInTheDocument()
                expect(loginLink).toBeInTheDocument()
                expect(modalTitle).toBeNull()
            })
        })
    })

    describe('when submit solicit recovery form', () => {
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
                    await renderPage()

                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Email', 'e')
                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage()

                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '80'),
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
                    await testSubmitForm('Avançar')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.string.email,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call the solicit password recovery request', async () => {
                const props = await renderPage({
                    submitValidSolicitForm: true
                })

                expect(mockSolicitPasswordRecoveryApi).toHaveBeenCalledTimes(1)
                expect(mockSolicitPasswordRecoveryApi).toHaveBeenCalledWith({
                    email: props.form.email
                })
            })

            describe('and when the solicit password recovery request succeeds', () => {
                it('should replace solicit recovery form by password recovery form', async () => {
                    const props = await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true
                    })

                    const emailInput = screen.queryByLabelText('Email')
                    const forwardButton = screen.queryByRole('button', { name: 'Avançar' })
                    const loginLink = screen.queryByRole('link', { name: 'Tentar entrar novamente' })

                    expect(emailInput).toBeNull()
                    expect(forwardButton).toBeNull()
                    expect(loginLink).toBeNull()

                    const text = screen.getByText(`Foi enviado para o email (${props.form.email}) o código de verificação para a recuperação de senha.`)
                    const codeInput = screen.getByLabelText('Código de verificação')
                    const passwordInput = screen.getByLabelText('Nova senha')
                    const confirmPasswordInput = screen.getByLabelText('Confirme sua nova senha')
                    const warning = screen.queryByRole('alert')
                    const changePasswordButton = screen.getByRole('button', { name: 'Alterar senha' })
                    const backLink = screen.getByRole('link', { name: 'Voltar' })
                    const modalTitle = screen.queryByRole('heading', { name: 'Senha alterada' })

                    expect(text).toBeInTheDocument()
                    expect(codeInput).toBeInTheDocument()
                    expect(passwordInput).toBeInTheDocument()
                    expect(confirmPasswordInput).toBeInTheDocument()
                    expect(warning).toBeNull()
                    expect(changePasswordButton).toBeInTheDocument()
                    expect(backLink).toBeInTheDocument()
                    expect(modalTitle).toBeNull()
                })
            })

            describe('and when the solicit password recovery request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        submitValidSolicitForm: true,
                        mockFailSolicitPasswordRecoveryRequest: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(props.errorMessage)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when submit password recovery form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true
                })

                await testSubmitForm('Alterar senha')

                const warning = screen.getByRole('alert')
                const warningTitle = screen.getByText('Dados inválidos')

                expect(warning).toBeInTheDocument()
                expect(warningTitle).toBeInTheDocument()
            })

            describe('and when no value', () => {
                it('should show a required error in the inputs', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true
                    })

                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true
                    })

                    await testTypeInInput('Código de verificação', '1')
                    await testTypeInInput('Nova senha', 'p')
                    await testTypeInInput('Confirme sua nova senha', 'p')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.length, '6'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6')
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true
                    })

                    await testTypeInInput('Código de verificação', '1234567')
                    await testTypeInInput('Nova senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Confirme sua nova senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.length, '6'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
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
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true
                    })

                    await testTypeInInput('Nova senha', password)
                    await testTypeInInput('Confirme sua nova senha', confirmPassword)
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        'As senhas precisam ser iguais.',
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call the solicit password recovery request', async () => {
                const props = await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true,
                    submitValidRecoveryForm: true
                })

                expect(mockReplyPasswordRecoveryApi).toHaveBeenCalledTimes(1)
                expect(mockReplyPasswordRecoveryApi).toHaveBeenCalledWith({
                    verificationCode: props.form.verificationCode,
                    email: props.form.email,
                    password: props.form.password
                })
            })

            describe('and when the solicit password recovery request succeeds', () => {
                it('should open success modal', async () => {
                    await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true,
                        submitValidRecoveryForm: true,
                        mockSuccessfulReplyPasswordRecoveryRequest: true
                    })

                    const modalTitle = screen.getByRole('heading', { name: 'Senha alterada' })
                    const modalMessagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Senha da conta alterada com sucesso.',
                        'Faça login usando o email e a nova senha para continuar a registrar a pontuação das suas aventuras.'
                    ]
                    const okButton = screen.getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(okButton).toBeInTheDocument()
                })
            })

            describe('and when the solicit password recovery request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        submitValidSolicitForm: true,
                        mockSuccessfulSolicitPasswordRecoveryRequest: true,
                        submitValidRecoveryForm: true,
                        mockFailReplyPasswordRecoveryRequest: true
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
            it('should call the navigation function to login page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true,
                    submitValidRecoveryForm: true,
                    mockSuccessfulReplyPasswordRecoveryRequest: true
                })

                const link = screen.getByRole('button', { name: 'Entendi' })
                await userEvent.click(link)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login)
            })
        })

        describe('and when click to close the modal', () => {
            it('should call the navigation function to login page', async () => {
                await renderPage({
                    submitValidSolicitForm: true,
                    mockSuccessfulSolicitPasswordRecoveryRequest: true,
                    submitValidRecoveryForm: true,
                    mockSuccessfulReplyPasswordRecoveryRequest: true
                })

                const closeButton = screen.getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeButton)

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.Login)
            })
        })
    })
})
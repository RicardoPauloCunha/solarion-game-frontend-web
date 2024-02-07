import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Profile from "."
import { createAxiosError } from "../../config/axios/error"
import { ErrorDictionary, defineValidatorErrorDictionary, replaceVariableInErrorDictionaryMessage } from "../../config/validator/dictionary"
import * as userApiFile from "../../hooks/api/user"
import { UserSimpleViewModel } from "../../hooks/api/user"
import { AuthContext, AuthContextData } from "../../hooks/contexts/auth"
import * as tokenStorageFile from "../../hooks/storage/token"
import { UserTypeEnum } from "../../types/enums/userType"
import { textAwait as testAwait, testClearInputs, testSubmitForm, testTypeInInput } from "../../utils/test"

const mockGetLoggedUserApi = jest.spyOn(userApiFile, 'getLoggedUserApi')
const mockEditUserDataApi = jest.spyOn(userApiFile, 'editUserDataApi')
const mockEditUserPasswordApi = jest.spyOn(userApiFile, 'editUserPasswordApi')
const mockSetTokenStorage = jest.spyOn(tokenStorageFile, "setTokenStorage");
const mockDefineLoggedUserByToken = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const renderPage = async (options?: {
    mockSuccessfulGetLoggedUserRequest?: boolean,
    mockFailGetLoggedUserRequest?: boolean,
    submitValidInforForm?: boolean,
    mockSuccessfulEditUserDataRequest?: boolean,
    mockFailEditUserDataRequest?: boolean,
    submitValidPasswordForm?: boolean,
    mockSuccessfulEditUserPasswordRequest?: boolean,
    mockFailEditUserPasswordRequest?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const password = 'password'
    const newPassword = 'wordpass'
    const simpleUser: UserSimpleViewModel = {
        userId: 1,
        name: "Name",
        email: "email@mail"
    }
    const token = 'jwt-token'
    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulGetLoggedUserRequest)
        mockGetLoggedUserApi.mockResolvedValue(simpleUser)
    else if (options?.mockFailGetLoggedUserRequest)
        mockGetLoggedUserApi.mockRejectedValue(createAxiosError(400, errorMessage))

    if (options?.mockSuccessfulEditUserDataRequest) {
        mockEditUserDataApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: token
        })
    }
    else if (options?.mockFailEditUserDataRequest) {
        mockEditUserDataApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    if (options?.mockSuccessfulEditUserPasswordRequest) {
        mockEditUserPasswordApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }
    else if (options?.mockFailEditUserPasswordRequest) {
        mockEditUserPasswordApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    mockDefineLoggedUserByToken.mockReturnValue({
        userId: simpleUser.userId,
        name: simpleUser.name,
        userType: UserTypeEnum.None
    })

    waitFor(() => {
        render(<AuthContext.Provider
            value={{
                defineLoggedUserByToken: mockDefineLoggedUserByToken
            } as unknown as AuthContextData}
        >
            <Profile />
        </AuthContext.Provider>, { wrapper: BrowserRouter })
    })

    await testAwait(10)

    if (options?.submitValidInforForm)
        await testSubmitForm('Alterar informações')

    if (options?.submitValidPasswordForm) {
        await testTypeInInput('Senha', password)
        await testTypeInInput('Nova senha', newPassword)
        await testTypeInInput('Confirme sua nova senha', newPassword)
        await testSubmitForm('Alterar senha')
    }

    return {
        form: {
            name: simpleUser.name,
            email: simpleUser.email,
            password,
            newPassword
        },
        result: {
            simpleUser,
            token
        },
        errorMessage
    }
}

// TODO: Test if the warning is in the correct form

describe('Profile Page', () => {
    it('should render the profile page', async () => {
        await renderPage({
            mockSuccessfulGetLoggedUserRequest: true
        })

        const infoTitle = screen.getByRole('heading', { name: 'Minhas informações' })
        const nameInput = screen.getByLabelText('Nome')
        const emailInput = screen.getByLabelText('Email')
        const infoButton = screen.getByRole('button', { name: 'Alterar informações' })
        const passwordTitle = screen.getByRole('heading', { name: 'Senha de acesso' })
        const passwordInput = screen.getByLabelText('Senha')
        const newPasswordInput = screen.getByLabelText('Nova senha')
        const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')
        const passwordButton = screen.getByRole('button', { name: 'Alterar senha' })
        const warning = screen.queryByRole('alert')
        const modalTitle = screen.queryByRole('Dados alterados')

        expect(infoTitle).toBeInTheDocument()
        expect(nameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(infoButton).toBeInTheDocument()
        expect(passwordTitle).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(newPasswordInput).toBeInTheDocument()
        expect(confirmNewPasswordInput).toBeInTheDocument()
        expect(passwordButton).toBeInTheDocument()
        expect(warning).toBeNull()
        expect(modalTitle).toBeNull()
    })

    describe('when get logged user request fails', () => {
        it('should show the loading button in info section', async () => {
            await renderPage({
                mockFailGetLoggedUserRequest: true
            })

            const infoButton = screen.getByRole('button', { name: 'Carregando...' })
            const passwordButton = screen.getByRole('button', { name: 'Alterar senha' })

            expect(infoButton).toBeInTheDocument()
            expect(passwordButton).toBeInTheDocument()
        })

        it('should disable the inputs in info section', async () => {
            await renderPage({
                mockFailGetLoggedUserRequest: true
            })

            const nameInput = screen.getByLabelText('Nome')
            const emailInput = screen.getByLabelText('Email')

            const passwordInput = screen.getByLabelText('Senha')
            const newPasswordInput = screen.getByLabelText('Nova senha')
            const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')

            expect(nameInput).toBeDisabled()
            expect(emailInput).toBeDisabled()
            expect(passwordInput).not.toBeDisabled()
            expect(newPasswordInput).not.toBeDisabled()
            expect(confirmNewPasswordInput).not.toBeDisabled()
        })
    })

    describe('when submit info form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true
                })

                await testClearInputs([
                    'Nome',
                    'Email'
                ])
                await testSubmitForm('Alterar informações')

                const warning = screen.getByRole('alert')
                const warningTitle = screen.getByText('Dados inválidos')

                expect(warning).toBeInTheDocument()
                expect(warningTitle).toBeInTheDocument()
            })

            describe('and when no value', () => {
                it('should show a required error in the inputs', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testClearInputs([
                        'Nome',
                        'Email'
                    ])
                    await testSubmitForm('Alterar informações')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.mixed.required,
                        ErrorDictionary.mixed.required,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is shorter', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testClearInputs([
                        'Nome',
                        'Email'
                    ])
                    await testTypeInInput('Nome', 'n')
                    await testTypeInInput('Email', 'e')
                    await testSubmitForm('Alterar informações')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '3'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testClearInputs([
                        'Nome',
                        'Email'
                    ])
                    await testTypeInInput('Nome', 'NameNameNameNameNameNameNameNameNameName1')
                    await testTypeInInput('Email', 'emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail1')
                    await testSubmitForm('Alterar informações')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '40'),
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
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testClearInputs(['Email'])
                    await testTypeInInput('Email', emailInputValue)
                    await testSubmitForm('Alterar informações')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        ErrorDictionary.string.email,
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })
        })

        describe('and when form is valid', () => {
            it('should call the edit user data request', async () => {
                const props = await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true,
                    submitValidInforForm: true
                })

                expect(mockEditUserDataApi).toHaveBeenCalledTimes(1)
                expect(mockEditUserDataApi).toHaveBeenCalledWith({
                    name: props.form.name,
                    email: props.form.email,
                })
            })

            describe('and when the edit user data request succeeds', () => {
                it('should clear the inputs of password form', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidInforForm: true,
                        mockSuccessfulEditUserDataRequest: true
                    })

                    const passwordInput = screen.getByLabelText('Senha')
                    const newPasswordInput = screen.getByLabelText('Nova senha')
                    const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')

                    expect(passwordInput).not.toHaveValue()
                    expect(newPasswordInput).not.toHaveValue()
                    expect(confirmNewPasswordInput).not.toHaveValue()
                })

                it('should call the set token storage function', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidInforForm: true,
                        mockSuccessfulEditUserDataRequest: true
                    })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(props.result.token)
                })

                it('should open success modal', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidInforForm: true,
                        mockSuccessfulEditUserDataRequest: true
                    })

                    const modalTitle = screen.getByRole('heading', { name: 'Dados alterados' })
                    const modalMessagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Os dados da sua conta foram alterados com sucesso.'
                    ]
                    const okButton = screen.getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(okButton).toBeInTheDocument()
                })
            })

            describe('and when the edit user data request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidInforForm: true,
                        mockFailEditUserDataRequest: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(props.errorMessage)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when submit password form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true
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
                        mockSuccessfulGetLoggedUserRequest: true
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
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testTypeInInput('Senha', 'p')
                    await testTypeInInput('Nova senha', 'p')
                    await testTypeInInput('Confirme sua nova senha', 'p')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.min, '6'),
                    ]

                    expect(inputsErrorText).toEqual(inputsErrorTextData)
                })
            })

            describe('and when length is greater', () => {
                it('should show a length error in the inputs', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true
                    })

                    await testTypeInInput('Senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Nova senha', 'passwordpasswordpassword1')
                    await testTypeInInput('Confirme sua nova senha', 'passwordpasswordpassword1')
                    await testSubmitForm('Alterar senha')

                    const inputsErrorText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const inputsErrorTextData = [
                        replaceVariableInErrorDictionaryMessage(ErrorDictionary.string.max, '24'),
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
                        mockSuccessfulGetLoggedUserRequest: true
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
            it('should call the edit user password request', async () => {
                const props = await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true,
                    submitValidPasswordForm: true
                })

                expect(mockEditUserPasswordApi).toHaveBeenCalledTimes(1)
                expect(mockEditUserPasswordApi).toHaveBeenCalledWith({
                    password: props.form.password,
                    newPassword: props.form.newPassword,
                })
            })

            describe('and when the edit user password request succeeds', () => {
                it('should open success modal', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidPasswordForm: true,
                        mockSuccessfulEditUserPasswordRequest: true
                    })

                    const modalTitle = screen.getByRole('heading', { name: 'Dados alterados' })
                    const modalMessagesText = screen.getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Os dados da sua conta foram alterados com sucesso.'
                    ]
                    const okButton = screen.getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(okButton).toBeInTheDocument()
                })
            })

            describe('and when the edit user password request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserRequest: true,
                        submitValidPasswordForm: true,
                        mockFailEditUserPasswordRequest: true
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
            it('should close the modal', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true,
                    submitValidInforForm: true,
                    mockSuccessfulEditUserDataRequest: true
                })

                const link = screen.getByRole('button', { name: 'Entendi' })
                await userEvent.click(link)

                const modalTitle = screen.queryByRole('heading', { name: 'Dados alterados' })

                expect(modalTitle).toBeNull()
            })
        })

        describe('and when click to close the modal', () => {
            it('should close the modal', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserRequest: true,
                    submitValidInforForm: true,
                    mockSuccessfulEditUserDataRequest: true
                })

                const closeButton = screen.getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeButton)

                const modalTitle = screen.queryByRole('heading', { name: 'Dados alterados' })

                expect(modalTitle).toBeNull()
            })
        })
    })
})
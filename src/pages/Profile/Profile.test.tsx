import { render, screen, waitFor, within } from "@testing-library/react"
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
import { testClearInputs, testSubmitForm, testTypeInInput } from "../../utils/test"

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

const generateSimpleUser = (): UserSimpleViewModel => {
    return {
        userId: 1,
        name: "Name",
        email: "email@mail"
    }
}

const renderPage = async (options?: {
    mockSuccessfulGetLoggedUserApi?: boolean,
    mockFailGetLoggedUserApi?: boolean,
    waitInitialLoadingFinish?: boolean,
    submitValidInfoForm?: boolean,
    mockSuccessfulEditUserDataApi?: boolean,
    mockFailEditUserDataApi?: boolean,
    submitValidPasswordForm?: boolean,
    mockSuccessfulEditUserPasswordApi?: boolean,
    mockFailEditUserPasswordApi?: boolean,
}) => {
    defineValidatorErrorDictionary()

    const password = 'password'
    const newPassword = 'wordpass'
    const simpleUser = generateSimpleUser()
    const token = 'jwt-token'
    const errorMessage = 'Não foi possível completar a requisição.'

    if (options?.mockSuccessfulGetLoggedUserApi)
        mockGetLoggedUserApi.mockResolvedValue(simpleUser)
    else if (options?.mockFailGetLoggedUserApi)
        mockGetLoggedUserApi.mockRejectedValue(createAxiosError(400, errorMessage))

    if (options?.mockSuccessfulEditUserDataApi) {
        mockEditUserDataApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: token
        })
    }
    else if (options?.mockFailEditUserDataApi) {
        mockEditUserDataApi.mockRejectedValue(createAxiosError(400, errorMessage))
    }

    if (options?.mockSuccessfulEditUserPasswordApi) {
        mockEditUserPasswordApi.mockResolvedValue({
            message: '',
            responseStatus: 200,
            result: null
        })
    }
    else if (options?.mockFailEditUserPasswordApi) {
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

    if (options?.waitInitialLoadingFinish) {
        await waitFor(() => {
            const infoFormButton = screen.getByRole('button', { name: 'Alterar informações' })

            expect(infoFormButton).toBeEnabled()
        })
    }

    if (options?.submitValidInfoForm)
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

// TODO: Test if the data get by request is typed in the inputs using 'getByDisplayValue'

describe('Profile Page', () => {
    it('should render the profile page', async () => {
        await renderPage({
            mockSuccessfulGetLoggedUserApi: true
        })

        const infoTitle = screen.getByRole('heading', { name: 'Minhas informações' })
        const nameInput = screen.getByLabelText('Nome')
        const emailInput = screen.getByLabelText('Email')
        const infoButton = screen.getByRole('button', { name: 'Carregando...' })
        const passwordTitle = screen.getByRole('heading', { name: 'Senha de acesso' })
        const passwordInput = screen.getByLabelText('Senha')
        const newPasswordInput = screen.getByLabelText('Nova senha')
        const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')
        const passwordButton = screen.getByRole('button', { name: 'Alterar senha' })
        const warning = screen.queryByRole('alert')
        const modal = screen.queryByRole('dialog')

        expect(infoTitle).toBeInTheDocument()
        expect(nameInput).toBeInTheDocument()
        expect(nameInput).toBeDisabled()
        expect(emailInput).toBeInTheDocument()
        expect(emailInput).toBeDisabled()
        expect(infoButton).toBeInTheDocument()
        expect(infoButton).toBeDisabled()
        expect(passwordTitle).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(passwordInput).toBeEnabled()
        expect(newPasswordInput).toBeInTheDocument()
        expect(newPasswordInput).toBeEnabled()
        expect(confirmNewPasswordInput).toBeInTheDocument()
        expect(confirmNewPasswordInput).toBeEnabled()
        expect(passwordButton).toBeInTheDocument()
        expect(passwordButton).toBeEnabled()
        expect(warning).toBeNull()
        expect(modal).toBeNull()
    })

    describe('when getLoggedUserApi request succeeds', () => {
        it('should enable the inputs and buttons in info section', async () => {
            await renderPage({
                mockSuccessfulGetLoggedUserApi: true
            })

            await waitFor(() => {
                const infoButton = screen.getByRole('button', { name: 'Alterar informações' })

                expect(infoButton).toBeEnabled()
            })

            const nameInput = screen.getByLabelText('Nome')
            const emailInput = screen.getByLabelText('Email')

            expect(nameInput).toBeEnabled()
            expect(emailInput).toBeEnabled()
        })
    })

    describe('when getLoggedUserApi request fails', () => {
        it('should disable the inputs and buttons in info section', async () => {
            await renderPage({
                mockFailGetLoggedUserApi: true
            })

            await waitFor(() => {
                const infoButton = screen.getByRole('button', { name: 'Carregando...' })

                expect(infoButton).toBeDisabled()
            })

            const nameInput = screen.getByLabelText('Nome')
            const emailInput = screen.getByLabelText('Email')

            expect(nameInput).toBeDisabled()
            expect(emailInput).toBeDisabled()
        })

        it('should not disable the inputs and buttons in password section', async () => {
            await renderPage({
                mockFailGetLoggedUserApi: true
            })

            await waitFor(() => {
                const passwordButton = screen.getByRole('button', { name: 'Alterar senha' })

                expect(passwordButton).toBeEnabled()
            })

            const passwordInput = screen.getByLabelText('Senha')
            const newPasswordInput = screen.getByLabelText('Nova senha')
            const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')

            expect(passwordInput).toBeEnabled()
            expect(newPasswordInput).toBeEnabled()
            expect(confirmNewPasswordInput).toBeEnabled()
        })
    })

    describe('when submit info form', () => {
        describe('and when invalid inputs value', () => {
            it('should show a invalid value warning', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserApi: true,
                    waitInitialLoadingFinish: true
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
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true
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
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true
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
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true
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
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true
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
            it('should call editUserDataApi request', async () => {
                const props = await renderPage({
                    mockSuccessfulGetLoggedUserApi: true,
                    waitInitialLoadingFinish: true,
                    submitValidInfoForm: true
                })

                expect(mockEditUserDataApi).toHaveBeenCalledTimes(1)
                expect(mockEditUserDataApi).toHaveBeenCalledWith({
                    name: props.form.name,
                    email: props.form.email,
                })
            })

            describe('and when editUserDataApi request succeeds', () => {
                it('should clear the inputs of password form', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true,
                        submitValidInfoForm: true,
                        mockSuccessfulEditUserDataApi: true
                    })

                    const passwordInput = screen.getByLabelText('Senha')
                    const newPasswordInput = screen.getByLabelText('Nova senha')
                    const confirmNewPasswordInput = screen.getByLabelText('Confirme sua nova senha')

                    expect(passwordInput).not.toHaveValue()
                    expect(newPasswordInput).not.toHaveValue()
                    expect(confirmNewPasswordInput).not.toHaveValue()
                })

                it('should call setTokenStorage function', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true,
                        submitValidInfoForm: true,
                        mockSuccessfulEditUserDataApi: true
                    })

                    expect(mockSetTokenStorage).toHaveBeenCalledTimes(1)
                    expect(mockSetTokenStorage).toHaveBeenCalledWith(props.result.token)
                })

                it('should open success modal', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true,
                        submitValidInfoForm: true,
                        mockSuccessfulEditUserDataApi: true
                    })

                    const modal = screen.getByRole('dialog')
                    const modalTitle = within(modal).getByRole('heading', { name: 'Dados alterados' })
                    const modalMessagesText = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Os dados da sua conta foram alterados com sucesso.'
                    ]
                    const modalButton = within(modal).getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(modalButton).toBeInTheDocument()
                })
            })

            describe('and when editUserDataApi request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        waitInitialLoadingFinish: true,
                        submitValidInfoForm: true,
                        mockFailEditUserDataApi: true
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
                    mockSuccessfulGetLoggedUserApi: true
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
                        mockSuccessfulGetLoggedUserApi: true
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
                        mockSuccessfulGetLoggedUserApi: true
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
                        mockSuccessfulGetLoggedUserApi: true
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
                        mockSuccessfulGetLoggedUserApi: true
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
            it('should call editUserPasswordApi request', async () => {
                const props = await renderPage({
                    mockSuccessfulGetLoggedUserApi: true,
                    submitValidPasswordForm: true
                })

                expect(mockEditUserPasswordApi).toHaveBeenCalledTimes(1)
                expect(mockEditUserPasswordApi).toHaveBeenCalledWith({
                    password: props.form.password,
                    newPassword: props.form.newPassword,
                })
            })

            describe('and when editUserPasswordApi request succeeds', () => {
                it('should open success modal', async () => {
                    await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        submitValidPasswordForm: true,
                        mockSuccessfulEditUserPasswordApi: true
                    })

                    const modal = screen.getByRole('dialog')
                    const modalTitle = within(modal).getByRole('heading', { name: 'Dados alterados' })
                    const modalMessagesText = within(modal).getAllByRole('alertdialog').map(x => x.textContent)
                    const modalMessagesTextData = [
                        'Os dados da sua conta foram alterados com sucesso.'
                    ]
                    const modalButton = within(modal).getByRole('button', { name: 'Entendi' })

                    expect(modalTitle).toBeInTheDocument()
                    expect(modalMessagesText).toEqual(modalMessagesTextData)
                    expect(modalButton).toBeInTheDocument()
                })
            })

            describe('and when editUserPasswordApi request fails', () => {
                it('should show a warning with the error', async () => {
                    const props = await renderPage({
                        mockSuccessfulGetLoggedUserApi: true,
                        submitValidPasswordForm: true,
                        mockFailEditUserPasswordApi: true
                    })

                    const warning = screen.getByRole('alert')
                    const warningMessage = screen.getByText(props.errorMessage)

                    expect(warning).toBeInTheDocument()
                    expect(warningMessage).toBeInTheDocument()
                })
            })
        })
    })

    describe('when success modal is open', () => {
        describe('and when click in modal button', () => {
            it('should close the modal', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserApi: true,
                    waitInitialLoadingFinish: true,
                    submitValidInfoForm: true,
                    mockSuccessfulEditUserDataApi: true
                })

                const modalOn = screen.getByRole('dialog')
                const modalButton = within(modalOn).getByRole('button', { name: 'Entendi' })
                await userEvent.click(modalButton)

                const modalOff = screen.queryByRole('dialog')

                expect(modalOff).toBeNull()
            })
        })

        describe('and when click to close the modal', () => {
            it('should close the modal', async () => {
                await renderPage({
                    mockSuccessfulGetLoggedUserApi: true,
                    waitInitialLoadingFinish: true,
                    submitValidInfoForm: true,
                    mockSuccessfulEditUserDataApi: true
                })

                const modalOn = screen.getByRole('dialog')
                const closeIcon = within(modalOn).getByRole('switch', { name: 'Fechar modal' })
                await userEvent.click(closeIcon)

                const modalOff = screen.queryByRole('dialog')

                expect(modalOff).toBeNull()
            })
        })
    })
})
import { FormHandles, SubmitHandler } from "@unform/core"
import { Form } from "@unform/web"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup'
import Button from "../../components/Buttons/Button"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import Input from "../../components/Inputs/Input"
import SuccessModal from "../../components/Modals/SuccessModal"
import PageContainer from "../../components/PageContainer"
import Link from "../../components/Typographies/Link"
import { getAxiosError } from "../../config/axios/error"
import { getSchemaError } from "../../config/validator/methods"
import { confirmPasswordSchema, emailSchema, passwordSchema } from "../../config/validator/schemas"
import { replyPasswordRecoveryApi, solicitPasswordRecoveryApi } from "../../hooks/api/passwordRecovery"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"

interface SolicitRecoverFormData {
    email: string
}

interface RecoverPasswordFormData {
    verificationCode: string
    password: string
    confirmPassword: string
}

const RecoverPassword = () => {
    const navigate = useNavigate()
    const formRef = useRef<FormHandles>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)
    const [email, setEmail] = useState('')

    const submitSolicitRecoverForm: SubmitHandler<SolicitRecoverFormData> = async (data) => {
        try {
            setIsLoading(true)
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                email: Yup.string()
                    .concat(emailSchema()),
            })

            await shema.validate(data, { abortEarly: false })

            await solicitPasswordRecoveryApi({
                email: data.email,
            }).then(() => {
                setEmail(data.email)
            }).catch(baseError => {
                setWarning(getAxiosError(baseError))
            }).finally(() => setIsLoading(false))
        } catch (error) {
            let schemaError = getSchemaError(error)

            formRef.current?.setErrors(schemaError.errors)
            setWarning(schemaError.warning)
            setIsLoading(false)
        }
    }

    const submitRecoverPasswordForm: SubmitHandler<RecoverPasswordFormData> = async (data) => {
        try {
            setIsLoading(true)
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                verificationCode: Yup.string().trim()
                    .length(6)
                    .required(),
                password: Yup.string()
                    .concat(passwordSchema()),
                confirmPassword: Yup.string()
                    .concat(confirmPasswordSchema('password')),
            })

            await shema.validate(data, { abortEarly: false })

            await replyPasswordRecoveryApi({
                verificationCode: data.verificationCode,
                email,
                password: data.password
            }).then(() => {
                setShowModal(true)
            }).catch(baseError => {
                setWarning(getAxiosError(baseError))
            }).finally(() => setIsLoading(false))
        } catch (error) {
            let schemaError = getSchemaError(error)

            formRef.current?.setErrors(schemaError.errors)
            setWarning(schemaError.warning)
            setIsLoading(false)
        }
    }

    const handleCloseModal = () => {
        navigate(DefaultRoutePathEnum.Login)
        setShowModal(false)
    }

    const handleBack = () => {
        let mail = email

        setEmail('')
        setWarning(undefined)

        setTimeout(() => {
            formRef.current?.setFieldValue('email', mail)
        }, 300)
    }

    return (
        <PageContainer>
            {!email
                ? <section>
                    <h1>Recuperar senha</h1>

                    <Form
                        ref={formRef}
                        onSubmit={submitSolicitRecoverForm}
                    >
                        <Input
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Coloque o email da sua conta"
                        />

                        {warning && <WarningCard {...warning} />}

                        <Button
                            text="Avançar"
                            type="submit"
                            isLoading={isLoading}
                        />
                    </Form>

                    <Link
                        to={DefaultRoutePathEnum.Login}
                        text="Tentar entrar novamente"
                    />
                </section>
                : <section>
                    <h1>Recuperar senha</h1>

                    <p>Foi enviado para o email ({email}) o código de verificação para a recuperação de senha.</p>

                    <Form
                        ref={formRef}
                        onSubmit={submitRecoverPasswordForm}
                    >
                        <Input
                            name="verificationCode"
                            label="Código de verificação"
                            type="text"
                            placeholder="Coloque o código de verificação"
                        />

                        <Input
                            name="password"
                            label="Nova senha"
                            type="password"
                            placeholder="Coloque sua nova senha"
                        />

                        <Input
                            name="confirmPassword"
                            label="Confirme sua nova senha"
                            type="password"
                            placeholder="Coloque sua nova senha novamente"
                        />

                        {warning && <WarningCard {...warning} />}

                        <Button
                            text="Alterar senha"
                            type="submit"
                            isLoading={isLoading}
                        />
                    </Form>

                    <Link
                        to={DefaultRoutePathEnum.RecoverPassword}
                        text="Voltar"
                        onClick={handleBack}
                    />
                </section>
            }

            <SuccessModal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Senha alterada"
                messages={[
                    'Senha da conta alterada com sucesso.',
                    'Faça login usando o email e a nova senha para continuar a registrar a pontuação das suas aventuras.'
                ]}
            />
        </PageContainer>
    )
}

export default RecoverPassword
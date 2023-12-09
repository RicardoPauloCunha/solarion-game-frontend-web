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
import { confirmPasswordSchema, emailSchema, nameSchema, passwordSchema } from "../../config/validator/schemas"
import { createCommonUserApi } from "../../hooks/api/user"
import { useAuthContext } from "../../hooks/contexts/auth"
import { setTokenStorage } from "../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"

interface AccountFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const RegisterAccount = () => {
    const navigate = useNavigate()
    const formRef = useRef<FormHandles>(null)

    const {
        defineLoggedUserByToken
    } = useAuthContext()

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)

    const submitAccountForm: SubmitHandler<AccountFormData> = async (data) => {
        try {
            setIsLoading(true)
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                name: Yup.string()
                    .concat(nameSchema()),
                email: Yup.string()
                    .concat(emailSchema()),
                password: Yup.string()
                    .concat(passwordSchema()),
                confirmPassword: Yup.string()
                    .concat(confirmPasswordSchema('password')),
            })

            await shema.validate(data, { abortEarly: false })

            await createCommonUserApi({
                name: data.name,
                email: data.email,
                password: data.password
            }).then(response => {
                let token = response.result

                setTokenStorage(token)
                defineLoggedUserByToken(token)

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
        navigate(DefaultRoutePathEnum.MyScores)
        setShowModal(false)
    }

    return (
        <PageContainer>
            <section>
                <h1>Registrar-se</h1>

                <Form
                    ref={formRef}
                    onSubmit={submitAccountForm}
                >
                    <Input
                        name="name"
                        label="Nome"
                        type="text"
                        placeholder="Coloque seu nome"
                    />

                    <Input
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Coloque seu email"
                    />

                    <Input
                        name="password"
                        label="Senha"
                        type="password"
                        placeholder="Coloque sua senha"
                    />

                    <Input
                        name="confirmPassword"
                        label="Confirme sua senha"
                        type="password"
                        placeholder="Coloque sua senha novamente"
                    />

                    {warning && <WarningCard {...warning} />}

                    <Button
                        text="Criar conta"
                        type="submit"
                        isLoading={isLoading}
                    />
                </Form>

                <Link
                    text="Já tenho uma conta"
                    to={DefaultRoutePathEnum.Login}
                />
            </section>

            <SuccessModal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Conta criada"
                messages={[
                    'Conta de usuário criada com sucesso.',
                    'Agora você pode salvar a pontuação das suas aventuras.'
                ]}
            />
        </PageContainer>
    )
}

export default RegisterAccount
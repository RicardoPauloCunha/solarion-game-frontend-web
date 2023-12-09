import { FormHandles, SubmitHandler } from "@unform/core"
import { Form } from "@unform/web"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup'
import Button from "../../components/Buttons/Button"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import VerticalGroup from "../../components/Groups/VerticalGroup"
import Input from "../../components/Inputs/Input"
import PageContainer from "../../components/PageContainer"
import Link from "../../components/Typographies/Link"
import { getAxiosError } from "../../config/axios/error"
import { getSchemaError } from "../../config/validator/methods"
import { emailSchema, passwordSchema } from "../../config/validator/schemas"
import { loginApi } from "../../hooks/api/user"
import { useAuthContext } from "../../hooks/contexts/auth"
import { setTokenStorage } from "../../hooks/storage/token"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { UserTypeEnum } from "../../types/enums/userType"

interface LoginFormData {
    email: string
    password: string
}

const Login = () => {
    const navigate = useNavigate()
    const formRef = useRef<FormHandles>(null)

    const {
        defineLoggedUserByToken
    } = useAuthContext()

    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)

    const submitLoginForm: SubmitHandler<LoginFormData> = async (data) => {
        try {
            setIsLoading(true)
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                email: Yup.string()
                    .concat(emailSchema()),
                password: Yup.string()
                    .concat(passwordSchema()),
            })

            await shema.validate(data, { abortEarly: false })

            await loginApi({
                email: data.email,
                password: data.password
            }).then(response => {
                let token = response.result

                setTokenStorage(token)
                let user = defineLoggedUserByToken(token)

                if (user.userType === UserTypeEnum.Admin)
                    navigate(DefaultRoutePathEnum.Scores)
                else
                    navigate(DefaultRoutePathEnum.MyScores)
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

    return (
        <PageContainer>
            <section>
                <h1>Login</h1>

                <Form
                    ref={formRef}
                    onSubmit={submitLoginForm}
                >
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

                    {warning && <WarningCard {...warning} />}

                    <Button
                        text="Entrar"
                        type="submit"
                        isLoading={isLoading}
                    />
                </Form>

                <VerticalGroup>
                    <Link
                        text="Esqueci minha senha"
                        to={DefaultRoutePathEnum.RecoverPassword}
                    />

                    <Link
                        text="Registrar-se"
                        to={DefaultRoutePathEnum.RegisterAccount}
                    />
                </VerticalGroup>
            </section>
        </PageContainer>
    )
}

export default Login
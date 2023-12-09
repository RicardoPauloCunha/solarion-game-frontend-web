import { ValidationError } from 'yup'
import { WarningData } from '../../components/Cards/WarningCard'

interface FieldErrors {
    [key: string]: string
}

interface SchemaError {
    errors: FieldErrors
    warning: WarningData
}

export const getSchemaError = (error: any) => {
    const schemaError: SchemaError = {
        errors: {},
        warning: {
            title: 'Dados inválidos',
            message: 'Corrija as informações destacadas em vermelho para continuar.',
            variant: 'error'
        }
    }

    if (error instanceof ValidationError) {
        error.inner.forEach(error => {
            let index = error.path

            if (index)
                schemaError.errors[index] = error.message
        })
    }

    return schemaError
}
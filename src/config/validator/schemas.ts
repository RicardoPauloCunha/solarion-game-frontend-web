import * as Yup from 'yup'

export const nameSchema = () => {
    return Yup.string().trim()
        .min(3)
        .max(40)
        .required()
}

export const emailSchema = () => {
    return Yup.string().trim()
        .min(3)
        .max(80)
        .email()
        .required()
}

export const passwordSchema = () => {
    return Yup.string().trim()
        .min(6)
        .max(24)
        .required()
}

export const confirmPasswordSchema = (fieldName: string) => {
    return Yup.string()
        .oneOf([Yup.ref(fieldName), ''], 'As senhas precisam ser iguais.')
        .required()
}

export const startDateSchema = () => {
    return Yup.date()
        .max(new Date(), 'Coloque uma data menor ou igual a data de hoje.')
        .min('1900-01-01', 'Coloque uma data válida maior ou igual a 01/01/1900.')
        .typeError('Coloque uma data válida.')
}

export const endDateSchema = (startDate: Date | null) => {
    return Yup.date()
        .max(new Date(), 'Coloque uma data menor ou igual a data de hoje.')
        .min(startDate ? startDate : new Date(), 'Coloque uma data maior ou igual a data inicial.')
        .typeError('Coloque uma data válida.')
}
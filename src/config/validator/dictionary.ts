import { setLocale } from 'yup'

const ErrorDictionary = {
    mixed: {
        default: "O valor é inválido.",
        required: "Preencha o campo com o valor solicitado.",
    },
    string: {
        length: "Coloque exatamente ${length} caracteres.",
        min: "Coloque no mínimo ${min} caracteres.",
        max: "Coloque no máximo ${max} caracteres.",
        email: "E-mail inválido.",
        trim: "Não deve conter espaços no início ou no fim."
    },
    number: {
        min: "Coloque no mínimo ${min}.",
        max: "Coloque no máximo ${max}.",
        lessThan: "Coloque um valor menor que ${less}.",
        moreThan: "Coloque um valor maior que ${more}.",
    },
    date: {
        min: "Coloque uma data maior que ${min}.",
        max: "Coloque uma data menor que ${max}."
    },
    array: {
        min: "Escolha no mínimo ${min} item.",
        max: "Escolha no mínimo ${max} item."
    }
}

export const defineValidatorErrorDictionary = () => {
    setLocale(ErrorDictionary)
}
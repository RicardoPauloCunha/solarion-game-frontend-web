import { useField } from '@unform/core'
import { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { cepMask, cnpjMask, cpfMask, dateMask, phoneMask } from '../../../utils/mask'
import { Container } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date'
    placeholder: string
    onChangeValue?: (value: string) => void
}

const Input = ({
    name,
    label,
    mask,
    disabled,
    onChangeValue,
    ...rest
}: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name)

    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (defaultValue)
            defineValue(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputRef.current,
            getValue(ref) {
                if (mask)
                    return removeMask(ref.value)
                else
                    return ref.value
            },
            setValue(_, value) {
                defineValue(value)
                clearError()
            },
            clearValue(_) {
                defineValue('')
                clearError()
            }
        })
    }, [fieldName, registerField])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    const handleChangeValue = useCallback((e: any) => {
        let value = defineValue(`${e?.target?.value}`)

        if (onChangeValue)
            onChangeValue(value)

        clearError()
    }, [])

    const defineValue = (value: string) => {
        if (!inputRef.current)
            return ''

        if (mask) {
            value = removeMask(value)
            let maskedValue = ''

            switch (mask) {
                case 'cpf':
                    maskedValue = cpfMask(value)
                    break
                case 'cnpj':
                    maskedValue = cnpjMask(value)
                    break
                case 'phone':
                    maskedValue = phoneMask(value)
                    break
                case 'cep':
                    maskedValue = cepMask(value)
                    break
                case 'date':
                    maskedValue = dateMask(value)
                    break
                default:
                    maskedValue = value
                    break
            }

            inputRef.current.value = maskedValue
        }
        else {
            inputRef.current.value = value
        }

        return value
    }

    const removeMask = (value: string) => {
        return value.replace(/(\D)/g, '')
    }

    return (
        <Container
            $hasError={hasError}
            $isDisabled={!!disabled}
        >
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                ref={inputRef}
                name={name}
                disabled={disabled}
                onChange={handleChangeValue}
                {...rest}
            />

            {error && <strong>{error}</strong>}
        </Container>
    )
}

export default Input

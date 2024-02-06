import { useField } from '@unform/core'
import { TextareaHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { Container } from './styles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string
    label: string
    placeholder: string
    onChangeValue?: (value: string) => void
}

const Textarea = ({
    name,
    label,
    disabled,
    onChangeValue,
    ...rest
}: TextareaProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name)

    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (inputRef.current && defaultValue)
            inputRef.current.value = defaultValue
    }, [defaultValue])

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputRef.current,
            getValue(ref) {
                return ref.value
            },
            setValue(ref, value) {
                ref.value = value

                clearError()
            },
            clearValue(ref) {
                ref.value = ''

                clearError()
            }
        })
    }, [fieldName, registerField])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    const handleChangeValue = useCallback((e: any) => {
        let value = `${e?.target?.value}`

        if (inputRef.current)
            inputRef.current.style.height = (inputRef.current.scrollHeight + 4) + "px"

        if (onChangeValue)
            onChangeValue(value)

        clearError()
    }, [])

    return (
        <Container
            $hasError={hasError}
            $isDisabled={!!disabled}
        >
            <label htmlFor={name}>{label}</label>

            <textarea
                id={name}
                ref={inputRef}
                name={name}
                disabled={disabled}
                onChange={handleChangeValue}
                {...rest}
            />

            {error && <strong role='alertdialog'>{error}</strong>}
        </Container>
    )
}

export default Textarea
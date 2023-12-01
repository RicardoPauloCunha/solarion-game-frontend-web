import { useField } from '@unform/core'
import { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { Container } from './styles'

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    placeholder: string
    onChangeValue?: (value: string) => void
}

interface InputProps extends InputBaseProps {
    rawText?: string
    onInitialData?: (value: string) => void
}

const Input = ({
    name,
    label,
    disabled,
    onChangeValue,
    rawText,
    onInitialData,
    ...rest
}: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name)

    const [hasError, setHasError] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (inputRef.current)
            inputRef.current.value = defaultValue
    }, [defaultValue])

    useEffect(() => {
        if (onInitialData)
            onInitialData(defaultValue)
    }, [defaultValue, onInitialData])

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputRef.current,
            getValue(ref) {
                if (!ref)
                    return ''

                if (rawText)
                    return rawText

                return ref.value
            },
            setValue(ref, value) {
                if (ref && value) {
                    ref.value = value

                    if (onInitialData)
                        onInitialData(value)

                    clearError()
                }
            },
            clearValue(ref) {
                if (ref) {
                    ref.value = ''

                    if (onInitialData)
                        onInitialData('')

                    clearError()
                }
            }
        })
    }, [fieldName, registerField, rawText])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    useEffect(() => {
        if (error)
            clearError()
    }, [rawText])

    const handleFocus = useCallback(() => {
        setIsFocused(true)
        setHasError(false)
    }, [])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
        setIsFilled(!!inputRef.current?.value)
    }, [])

    const handleChangeValue = useCallback((e: any) => {
        let value = `${e.target.value}`

        if (inputRef.current)
            inputRef.current.value = value

        if (onChangeValue)
            onChangeValue(value)

        clearError()
    }, [])

    return (
        <Container
            $hasError={hasError}
            $isFilled={isFilled}
            $isFocused={isFocused}
            $isDisabled={!!disabled}
        >
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                ref={inputRef}
                name={name}
                disabled={disabled}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={handleChangeValue}
                {...rest}
            />

            {error && <strong>{error}</strong>}
        </Container>
    )
}

export default Input

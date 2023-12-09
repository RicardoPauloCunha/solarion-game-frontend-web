import { useField } from '@unform/core'
import { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { Container } from './styles'

export interface OptionData {
    label: string
    value: string
    disabled?: boolean
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    disabled?: boolean
    onChangeValue?: (value: string) => void
    options: OptionData[]
}

const Checkbox = ({
    name,
    label,
    disabled,
    onChangeValue,
    options,
}: CheckboxProps) => {
    const inputsRef = useRef<HTMLInputElement[]>([])
    const { fieldName, registerField, defaultValue = [], error, clearError } = useField(name)

    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (inputsRef.current && defaultValue && defaultValue.length !== 0) {
            inputsRef.current.forEach(x => {
                if (defaultValue.includes(x?.value))
                    x.checked = true
            })
        }
    }, [defaultValue])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputsRef.current,
            getValue: (refs: HTMLInputElement[]) => {
                return refs
                    .filter(x => x.checked)
                    .map(x => `${x.value}`)
            },
            setValue: (refs: HTMLInputElement[], values: string[]) => {
                refs.forEach(x => {
                    if (values.includes(x.value))
                        x.checked = true
                })

                clearError()
            },
            clearValue: (refs: HTMLInputElement[]) => {
                refs.forEach(x => {
                    x.checked = false
                })

                clearError()
            },
        })
    }, [fieldName, registerField])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    const handleChangeValue = useCallback((e: any) => {
        let value = `${e?.target?.value}`

        if (onChangeValue)
            onChangeValue(value)

        clearError()
    }, [])

    return (
        <Container
            $hasError={hasError}
            $isDisabled={!!disabled}
        >
            <span>{label}</span>

            {options.map((x, index) => (
                <label
                    key={index}
                    htmlFor={`${name}-${x.value}`}
                >
                    {x.label}

                    <input
                        type="checkbox"
                        id={`${name}-${x.value}`}
                        ref={y => {
                            inputsRef.current[index] = y as HTMLInputElement
                        }}
                        name={name}
                        value={x.value}
                        disabled={x.disabled || disabled}
                        onChange={handleChangeValue}
                    />

                    <span></span>
                </label>
            ))}

            {error && <strong>{error}</strong>}
        </Container>
    )
}

export default Checkbox
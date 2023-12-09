import { useField } from '@unform/core'
import { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { FaFolderOpen } from 'react-icons/fa'
import { Container } from './styles'

interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    placeholder: string
    onChangeValue?: (value: File | undefined) => void
}

const FileUpload = ({
    name,
    label,
    placeholder,
    onChangeValue,
    disabled,
}: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name)

    const [hasError, setHasError] = useState(false)
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputRef.current,
            getValue(ref) {
                return ref.files[0]
            },
            clearValue(ref) {
                ref.value = ''
                setFileName('')

                clearError()
            }
        })
    }, [fieldName, registerField])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    const handleChangeValue = useCallback((e: any) => {
        let file = e?.target?.files
            ? e.target.files[0]
            : undefined

        setFileName(file ? file.name : '')

        if (onChangeValue)
            onChangeValue(file)

        clearError()
    }, [])

    return (
        <Container
            $hasValue={!!fileName}
            $hasError={hasError}
            $isDisabled={!!disabled}
        >
            <span>{label}</span>

            <label htmlFor={name}>
                {fileName ? fileName : placeholder}
                <FaFolderOpen />
            </label>

            <input
                id={name}
                ref={inputRef}
                name={name}
                type='file'
                disabled={disabled}
                placeholder={placeholder}
                onChange={handleChangeValue}
            />

            {error && <strong>{error}</strong>}
        </Container>
    )
}

export default FileUpload
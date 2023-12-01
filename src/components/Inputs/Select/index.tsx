import { useField } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'
import { Container, selectStyles } from './styles'

interface SelectProps extends ReactSelectProps {
	name: string
	label: string
	placeholder: string
	onChangeValue?: (value: string) => void
}

const Select = ({
	name,
	label,
	isDisabled,
	onChangeValue,
	...rest
}: SelectProps) => {
	const inputRef = useRef<any>(null)

	const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name)

	const [hasError, setHasError] = useState(false)
	const [isFilled, setIsFilled] = useState(false)
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		if (inputRef?.current) {
			const selected = inputRef.current.props?.options?.find((x: any) => x?.value === defaultValue)

			if (selected)
				inputRef.current.setValue(selected)
		}
	}, [defaultValue])

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			getValue: (ref) => {
				if (!ref?.state?.selectValue[0]?.value)
					return ''

				return ref.state.selectValue[0].value
			},
			setValue: (ref, value) => {
				if (ref && value) {
					const selected = ref.props?.options?.find((x: any) => x?.value === value)

					if (selected)
						ref.setValue(selected)

					clearError()
				}
			},
			clearValue(ref) {
				if (ref) {
					ref.setValue('')

					clearError()
				}
			},
		})
	}, [fieldName, registerField])

	useEffect(() => {
		setHasError(!!error)
	}, [error])

	const handleFocus = useCallback(() => {
		setIsFocused(true)
		setHasError(false)
	}, [])

	const handleBlur = useCallback(() => {
		setIsFocused(false)
		setIsFilled(!!inputRef?.current?.state?.selectValue[0]?.value)
	}, [])

	const handleChangeValue = useCallback((e: any) => {
		let value = `${e?.value}`

		if (onChangeValue)
			onChangeValue(value)

		clearError()
	}, [])

	return (
		<Container
			$hasError={hasError}
			$isFilled={isFilled}
			$isFocused={isFocused}
			$isDisabled={!!isDisabled}
		>
			<label htmlFor={name}>{label}</label>

			<ReactSelect
				inputId={name}
				ref={inputRef}
				name={name}
				isDisabled={isDisabled}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onChange={handleChangeValue}
				styles={selectStyles}
				{...rest}
			/>

			{error && <strong>{error}</strong>}
		</Container >
	)
}

export default Select
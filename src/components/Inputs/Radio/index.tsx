import { useField } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckboxProps } from '../Checkbox'
import { Container } from './styles'

interface RadioProps extends CheckboxProps {

}

const Radio = ({
	name,
	label,
	disabled,
	onChangeValue,
	options,
}: RadioProps) => {
	const inputsRef = useRef<HTMLInputElement[]>([])
	const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name)

	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		if (inputsRef.current && defaultValue) {
			inputsRef.current.forEach(x => {
				if (x?.value === defaultValue)
					x.checked = true
			})
		}
	}, [defaultValue])

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputsRef.current,
			getValue: (refs: HTMLInputElement[]) => {
				let option = refs.find(x => x?.checked)

				if (!option)
					return ''

				return option.value
			},
			setValue: (refs: HTMLInputElement[], value: string) => {
				refs.forEach(x => {
					if (x.value === value)
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
						type="radio"
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

export default Radio
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

export const testSubmitForm = async (buttonName: string) => {
    const button = screen.getByRole('button', { name: buttonName })
    await userEvent.click(button)
}

export const testTypeInInput = async (inputLabel: string, value: string) => {
    const input = screen.getByLabelText(inputLabel)
    await userEvent.type(input, value)
}

export const testClearInputs = async (inputsName: string[]) => {
    inputsName.forEach(async x => {
        const input = screen.getByLabelText(x)
        await userEvent.clear(input)
    })
}
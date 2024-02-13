import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Scenario from "."
import CH1TableImg from '../../assets/images/ch1-table.png'
import * as scenarioStorageFile from "../../hooks/storage/scenario"
import { ScenarioData } from "../../hooks/storage/scenario"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"
import { ScenarioTypeEnum, getScenarioTypeEnumValue, getScenarioTypeImage, listDecisionByScenario } from "../../types/enums/scenarioType"
import * as timerUtilsFile from "../../utils/timer"

const mockTimer = jest.spyOn(timerUtilsFile, 'delay')
const mockGetScenarioStorage = jest.spyOn(scenarioStorageFile, 'getScenarioStorage')
const mockSetScenarioStorage = jest.spyOn(scenarioStorageFile, 'setScenarioStorage')
const mockNavigate = jest.fn()
window.scrollTo = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const generateLastScenario = (options?: {
    finished?: boolean
}): ScenarioData => {
    return options?.finished
        ? {
            scenarioType: ScenarioTypeEnum.Finished,
            decisions: [2, 5, 11, 16],
            creationDate: new Date()
        } : {
            scenarioType: ScenarioTypeEnum.CH2_ACT3,
            decisions: [1],
            creationDate: new Date()
        }
}

const generateScene = (scenarioType: ScenarioTypeEnum) => {
    const image = getScenarioTypeImage(scenarioType)
    const text = getScenarioTypeEnumValue(scenarioType)
    const decisionsText = listDecisionByScenario(scenarioType).map(x => x.decisionTypeValue)

    return {
        image,
        text,
        decisionsText
    }
}

const IMAGE_ALT_TEXT = "Cenários do jogo 'Solarion Chronicles: The Game' no evento do Sebastian (Stardew Valley)."

const renderPage = async (options?: {
    lastScenario?: ScenarioData,
    selectFirstDecisionToNextScene?: boolean,
    clickInTextToNextScene?: string,
}) => {
    mockTimer.mockResolvedValue(new Promise(res => setTimeout(res, 0)))

    if (options?.lastScenario)
        mockGetScenarioStorage.mockReturnValue(options.lastScenario)

    render(<Scenario />, { wrapper: BrowserRouter })

    if (options?.selectFirstDecisionToNextScene) {
        const decisionButton = (await screen.findAllByRole('button'))[0]
        await userEvent.click(decisionButton)
    }

    if (options?.clickInTextToNextScene) {
        const text = await screen.findByText(options?.clickInTextToNextScene)
        await userEvent.click(text)
    }
}

describe('Scenario Page', () => {
    it('should render a preload scenario page', async () => {
        await renderPage()

        const image = screen.getByAltText(IMAGE_ALT_TEXT)

        expect(image).toHaveAttribute('src', CH1TableImg)
    })

    describe('when have last scenario', () => {
        it('should render the last scene', async () => {
            const lastScenario = generateLastScenario()
            const scene = generateScene(lastScenario.scenarioType)

            await renderPage({
                lastScenario
            })

            await waitFor(() => {
                const text = screen.getByText(scene.text)
                expect(text).toBeInTheDocument()
            })

            await waitFor(() => {
                const decisionsText = screen.queryAllByRole('button').map(x => x.textContent)
                expect(decisionsText).toEqual(scene.decisionsText)
            })

            const image = screen.getByAltText(IMAGE_ALT_TEXT)
            expect(image).toHaveAttribute('src', scene.image)
        })

        describe('and when is finished', () => {
            it('should call navigate function to decisions rating page', async () => {
                const lastScenarioFinished = generateLastScenario({ finished: true })

                await renderPage({
                    lastScenario: lastScenarioFinished
                })

                expect(mockNavigate).toHaveBeenCalledTimes(1)
                expect(mockNavigate).toHaveBeenCalledWith(DefaultRoutePathEnum.DecisionsRating)
            })
        })
    })

    describe('when no last scenario', () => {
        it('should render the initial scene', async () => {
            const scene = generateScene(ScenarioTypeEnum.CH1_ACT2_DEC)

            await renderPage()

            await waitFor(() => {
                const text = screen.getByText(scene.text)
                expect(text).toBeInTheDocument()
            })

            await waitFor(() => {
                const decisionsText = screen.queryAllByRole('button').map(x => x.textContent)
                expect(decisionsText).toEqual(scene.decisionsText)
            })

            const image = screen.getByAltText(IMAGE_ALT_TEXT)
            expect(image).toHaveAttribute('src', scene.image)
        })
    })

    describe('when have decisions', () => {
        describe('and when click on one of the decision options', () => {
            it('should call setScenarioStorage function', async () => {
                await renderPage({
                    selectFirstDecisionToNextScene: true
                })

                expect(mockSetScenarioStorage).toHaveBeenCalledTimes(2)
            })

            it('should advance the scene', async () => {
                const nextScene = generateScene(ScenarioTypeEnum.CH2_ACT1)

                await renderPage({
                    selectFirstDecisionToNextScene: true
                })

                await waitFor(() => {
                    const text = screen.getByText(nextScene.text)
                    expect(text).toBeInTheDocument()
                })

                await waitFor(() => {
                    const decisionsText = screen.queryAllByRole('button').map(x => x.textContent)
                    expect(decisionsText).toEqual(nextScene.decisionsText)
                })

                const image = screen.getByAltText(IMAGE_ALT_TEXT)
                expect(image).toHaveAttribute('src', nextScene.image)
            })
        })
    })

    describe('when no decisions', () => {
        describe('and when click on the text container', () => {
            it('should call setScenarioStorage function', async () => {
                const nextScene = generateScene(ScenarioTypeEnum.CH2_ACT1)

                await renderPage({
                    selectFirstDecisionToNextScene: true,
                    clickInTextToNextScene: nextScene.text
                })

                expect(mockSetScenarioStorage).toHaveBeenCalledTimes(3)
            })

            it('should advance the scene', async () => {
                const nextScene = generateScene(ScenarioTypeEnum.CH2_ACT1)
                const nextNextScene = generateScene(ScenarioTypeEnum.CH2_ACT2)

                await renderPage({
                    selectFirstDecisionToNextScene: true,
                    clickInTextToNextScene: nextScene.text
                })

                await waitFor(() => {
                    const text = screen.getByText(nextNextScene.text)
                    expect(text).toBeInTheDocument()
                })

                await waitFor(() => {
                    const decisionsText = screen.queryAllByRole('button').map(x => x.textContent)
                    expect(decisionsText).toEqual(nextNextScene.decisionsText)
                })

                const image = screen.getByAltText(IMAGE_ALT_TEXT)
                expect(image).toHaveAttribute('src', nextNextScene.image)
            })
        })
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ScoreCard from "."
import { ScoreViewModel } from "../../../hooks/api/score"
import { DecisionTypeEnum, getDecisionTypeEnumValue } from "../../../types/enums/decisionType"
import { HeroTypeEnum, getHeroTypeEnumValue } from "../../../types/enums/heroType"
import { RatingTypeEnum, getRatingTypeEnumValue } from "../../../types/enums/ratingType"

const generateScore = (options?: {
    hasUserName?: boolean,
    hasNoDecisions?: boolean
}): ScoreViewModel => {
    return {
        scoreId: 1,
        creationDate: "12:07 25/01/2024",
        heroType: HeroTypeEnum.Warrior,
        heroTypeValue: getHeroTypeEnumValue(HeroTypeEnum.Warrior),
        ratingType: RatingTypeEnum.D,
        ratingTypeValue: getRatingTypeEnumValue(RatingTypeEnum.D),
        decisions: options?.hasNoDecisions ? [] : [
            {
                decisionType: DecisionTypeEnum.CH1_ACT2_DEC_Warrior,
                decisionTypeValue: getDecisionTypeEnumValue(DecisionTypeEnum.CH1_ACT2_DEC_Warrior)
            },
            {
                decisionType: DecisionTypeEnum.CH3_ACT1_DEC_Back,
                decisionTypeValue: getDecisionTypeEnumValue(DecisionTypeEnum.CH3_ACT1_DEC_Back)
            },
            {
                decisionType: DecisionTypeEnum.CH5_ACT2_DEC_Right,
                decisionTypeValue: getDecisionTypeEnumValue(DecisionTypeEnum.CH5_ACT2_DEC_Right)
            },
            {
                decisionType: DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Sword,
                decisionTypeValue: getDecisionTypeEnumValue(DecisionTypeEnum.CH8_ROT_WAR_AC2_DEC_Sword)
            }
        ],
        userName: options?.hasUserName ? 'User name' : ''
    }
}

const SCORE = generateScore()
const mockOnSave = jest.fn()
const mockOnDelete = jest.fn()

const renderComponent = (options?: {
    scoreData?: ScoreViewModel,
    hasOnSave?: boolean,
    hasOnDelete?: boolean
}) => {
    render(<ScoreCard
        data={options?.scoreData ? options.scoreData : SCORE}
        onSave={options?.hasOnSave ? mockOnSave : undefined}
        onDelete={options?.hasOnDelete ? mockOnDelete : undefined}
    />)
}

describe('ScoreCard Comp', () => {
    it('should render a default card', () => {
        renderComponent()

        const header = screen.queryByRole('heading')
        const removeButton = screen.queryByRole('deletion')
        const saveButton = screen.queryByRole('button', { name: 'Salvar' })
        const scoreRating = screen.getByText(SCORE.ratingTypeValue)
        const scoreHero = screen.getByText(SCORE.heroTypeValue)
        const scoreDate = screen.getByText(SCORE.creationDate)
        const decisionsPreview = screen.getByText(`\u2022 ${SCORE.decisions[0].decisionTypeValue}..`)

        expect(header).toBeNull()
        expect(removeButton).toBeNull()
        expect(saveButton).toBeNull()
        expect(scoreRating).toBeInTheDocument()
        expect(scoreHero).toBeInTheDocument()
        expect(scoreDate).toBeInTheDocument()
        expect(decisionsPreview).toBeInTheDocument()
    })

    it('should render a save card', () => {
        renderComponent({
            hasOnSave: true,
            hasOnDelete: true
        })

        const saveHeader = screen.getByRole('heading', { name: 'Pontuação da última aventura' })
        const removeButton = screen.getByRole('deletion')
        const saveButton = screen.getByRole('button', { name: 'Salvar' })
        const userNameHeader = screen.queryByRole('heading', { name: SCORE.userName })

        expect(saveHeader).toBeInTheDocument()
        expect(removeButton).toBeInTheDocument()
        expect(saveButton).toBeInTheDocument()
        expect(userNameHeader).toBeNull()
    })

    it('should render a card with username', () => {
        const scoreData = generateScore({ hasUserName: true })

        renderComponent({
            scoreData
        })

        const userNameHeader = screen.getByRole('heading', { name: scoreData.userName })
        const saveHeader = screen.queryByRole('heading', { name: 'Pontuação da última aventura' })
        const removeButton = screen.queryByRole('deletion')
        const saveButton = screen.queryByRole('button', { name: 'Salvar' })

        expect(userNameHeader).toBeInTheDocument()
        expect(saveHeader).toBeNull()
        expect(removeButton).toBeNull()
        expect(saveButton).toBeNull()
    })

    it('should prioritize render a card with username over a save card', () => {
        const scoreData = generateScore({ hasUserName: true })

        renderComponent({
            scoreData,
            hasOnSave: true
        })

        const userNameHeader = screen.getByRole('heading', { name: scoreData.userName })
        const saveHeader = screen.queryByRole('heading', { name: 'Pontuação da última aventura' })
        const removeButton = screen.queryByRole('deletion')
        const saveButton = screen.queryByRole('button', { name: 'Salvar' })

        expect(userNameHeader).toBeInTheDocument()
        expect(saveHeader).toBeNull()
        expect(removeButton).toBeNull()
        expect(saveButton).toBeNull()
    })

    describe('when no decisions', () => {
        it('should not render a preview list of decisions', () => {
            const scoreData = generateScore({ hasNoDecisions: true })

            renderComponent({
                scoreData
            })

            const preview = screen.queryByRole('listitem')

            expect(preview).toBeNull()
        })
    })

    describe('when details is open', () => {
        it('should render a full list of decisions', async () => {
            const texts = SCORE.decisions.map(x => `\u2022 ${x.decisionTypeValue}`)

            renderComponent()

            const previewItens = screen.getAllByRole('listitem')

            expect(previewItens).toHaveLength(1)

            const toggle = screen.getByRole('switch')
            await userEvent.click(toggle)

            const preview = screen.queryByText(`\u2022 ${SCORE.decisions[0].decisionTypeValue}..`)
            const decisionTexts = screen.getAllByRole('listitem').map(x => x.textContent)

            expect(preview).toBeNull()
            expect(decisionTexts).toEqual(texts)
        })

        describe('and when no decisions', () => {
            it('should not render a full list of decisions', async () => {
                const scoreData = generateScore({ hasNoDecisions: true })

                renderComponent({
                    scoreData
                })

                const toggle = screen.getByRole('switch')
                await userEvent.click(toggle)

                const decisions = screen.queryAllByRole('listitem')

                expect(decisions).toHaveLength(0)
            })
        })
    })

    describe('when click to save', () => {
        it('should call onSave function', async () => {
            renderComponent({
                hasOnSave: true
            })

            const button = screen.getByRole('button', { name: 'Salvar' })
            await userEvent.click(button)

            expect(mockOnSave).toHaveBeenCalledTimes(1)
        })
    })

    describe('when click to delete', () => {
        it('should call onDelete function', async () => {
            renderComponent({
                hasOnDelete: true
            })

            const button = screen.getByRole('deletion')
            await userEvent.click(button)

            expect(mockOnDelete).toHaveBeenCalledTimes(1)
        })
    })
})
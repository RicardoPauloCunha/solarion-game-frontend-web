import { FormHandles, SubmitHandler } from "@unform/core"
import { Form } from "@unform/web"
import { useEffect, useRef, useState } from "react"
import * as Yup from 'yup'
import Button from "../../components/Buttons/Button"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import BarChart from "../../components/Charts/BarChart"
import LineChart from "../../components/Charts/LineChart"
import PieChart from "../../components/Charts/PieChart"
import VerticalGroup from "../../components/Groups/VerticalGroup"
import Input from "../../components/Inputs/Input"
import Select from "../../components/Inputs/Select"
import LoadingText from "../../components/Loadings/LoadingText"
import PageContainer from "../../components/PageContainer"
import Toggle from "../../components/Toggle"
import { getSchemaError } from "../../config/validator/methods"
import { endDateSchema, startDateSchema } from "../../config/validator/schemas"
import { GetScoreIndicatorsApi, GetScoreIndicatorsParams, ScoreIndicatorsViewModel } from "../../hooks/api/score"
import { LastMonthsTypeEnum, listLastMonthsTypeOptions } from "../../types/enums/lastMonthsType"

interface DashboardFilterFormData {
    lastMonths: number
    startDate: Date | null
    endDate: Date | null
}

const ADVENTURE_COLORS = [
    'var(--color-wine)'
]
const HERO_COLORS = [
    'var(--color-gray)',
    'var(--color-light-wine)',
    'var(--color-green)',
]
const RATING_COLORS = [
    'var(--color-yellow)',
    'var(--color-pink)',
    'var(--color-blue)',
    'var(--color-cyan)',
]

const Dashboard = () => {
    const formRef = useRef<FormHandles>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)
    const [hasDateInput, setHasDateInput] = useState(false)
    const [hasData, setHasData] = useState(true)
    const [indicatorsFilter, setIndicatorsFilter] = useState<GetScoreIndicatorsParams>({})
    const [scoreIndicators, setScoreIndicators] = useState<ScoreIndicatorsViewModel | undefined>(undefined)

    const lastMonthsOptions = listLastMonthsTypeOptions()

    useEffect(() => {
        getIndicatorsData()
    }, [])

    const getIndicatorsData = async (filter?: GetScoreIndicatorsParams) => {
        setIsLoading(true)

        if (!filter)
            filter = indicatorsFilter

        if (filter.lastMonths === LastMonthsTypeEnum.Custom && !hasDateInput)
            filter.lastMonths = undefined

        await GetScoreIndicatorsApi(filter).then(response => {
            let hasValue = response.adventuresChart?.totalValue !== 0

            setScoreIndicators(response)

            setHasData(hasValue)
            setIndicatorsFilter(filter as GetScoreIndicatorsParams)
            setIsLoading(false)
        }).catch(() => { })
    }

    const submitFilterForm: SubmitHandler<DashboardFilterFormData> = async (data) => {
        try {
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                lastMonths: Yup.string()
            })

            await shema.validate(data, { abortEarly: false })

            if (hasDateInput) {
                const subShema = Yup.object().shape({
                    startDate: Yup.date()
                        .default(null)
                        .nullable()
                        .concat(startDateSchema())
                        .required(),
                    endDate: Yup.date()
                        .default(null)
                        .nullable()
                        .concat(endDateSchema(data.startDate))
                        .required(),
                })

                await subShema.validate(data, { abortEarly: false })
            }

            data.lastMonths = data.lastMonths ? Number(data.lastMonths) : 0

            await getIndicatorsData({
                lastMonths: data.lastMonths,
                startDate: data.startDate,
                endDate: data.endDate
            })
        } catch (error) {
            let schemaError = getSchemaError(error)

            formRef.current?.setErrors(schemaError.errors)
            setWarning(schemaError.warning)
            setIsLoading(false)
        }
    }

    const handleCleanFilter = () => {
        setHasDateInput(false)
        formRef.current?.reset()

        getIndicatorsData({})
    }

    const handleSelectLastMonths = (value: string) => {
        let hasDate = value === `${LastMonthsTypeEnum.Custom}`

        setHasDateInput(hasDate)
    }

    const handleOpenFilter = () => {
        setTimeout(() => {
            formRef.current?.setData({
                lastMonths: `${indicatorsFilter.lastMonths}`,
                startDate: indicatorsFilter.startDate,
                endDate: indicatorsFilter.endDate
            })
        }, 300)
    }

    return (
        <PageContainer>
            <section>
                <h1>Dashboard</h1>

                <Toggle
                    text="Filtros"
                    onOpen={handleOpenFilter}
                >
                    <Form
                        ref={formRef}
                        onSubmit={submitFilterForm}
                    >
                        <Select
                            name="lastMonths"
                            label="Período"
                            placeholder="Escolha um período"
                            options={lastMonthsOptions}
                            onChangeValue={handleSelectLastMonths}
                        />

                        {hasDateInput && <>
                            <Input
                                name="startDate"
                                label="Data inicial"
                                type="date"
                                placeholder="Coloque a data inicial"
                            />

                            <Input
                                name="endDate"
                                label="Data final"
                                type="date"
                                placeholder="Coloque a data final"
                            />
                        </>}

                        {warning && <WarningCard {...warning} />}

                        {!isLoading && <VerticalGroup>
                            <Button
                                text="Filtrar"
                                type="submit"
                                isLoading={isLoading}
                            />

                            <Button
                                text="Limpar filtro"
                                variant="outline"
                                onClick={handleCleanFilter}
                            />
                        </VerticalGroup>}
                    </Form>
                </Toggle>

                <LoadingText
                    isLoading={isLoading}
                    loadingText="Carregando indicadores..."
                />
            </section>

            {scoreIndicators && hasData
                ? <>
                    {scoreIndicators.adventuresChart && <section>
                        <h2>Quantidade de aventuras</h2>

                        <LineChart
                            colors={ADVENTURE_COLORS}
                            chart={scoreIndicators.adventuresChart}
                        />
                    </section>}

                    {scoreIndicators.heroCharts.length !== 0 && <section>
                        <h2>Seleção de classes</h2>

                        <PieChart
                            colors={HERO_COLORS}
                            charts={scoreIndicators.heroCharts}
                        />
                    </section>}

                    {scoreIndicators.ratingCharts.length !== 0 && <section>
                        <h2>Pontuações obtidas</h2>

                        <BarChart
                            colors={RATING_COLORS}
                            charts={scoreIndicators.ratingCharts}
                        />
                    </section>}
                </>
                : <>
                    {!isLoading && <article className="list-cards">
                        <WarningCard
                            title="Nenhum dado encontrado"
                            message="Nenhum dado sobre as pontuações dos usuários foi encontrado."
                            variant="info"
                        />
                    </article>}
                </>
            }
        </PageContainer>
    )
}

export default Dashboard
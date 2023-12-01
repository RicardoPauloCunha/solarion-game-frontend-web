import { FormHandles, SubmitHandler } from "@unform/core"
import { Form } from "@unform/web"
import { useEffect, useRef, useState } from "react"
import * as Yup from 'yup'
import Button from "../../components/Buttons/Button"
import ScoreCard from "../../components/Cards/ScoreCard"
import WarningCard, { WarningData } from "../../components/Cards/WarningCard"
import Checkbox, { OptionData } from "../../components/Inputs/Checkbox"
import Input from "../../components/Inputs/Input"
import Select from "../../components/Inputs/Select"
import LoadingText from "../../components/Loading/LoadingText"
import PageContainer from "../../components/PageContainer"
import Toggle from "../../components/Toggle"
import Link from "../../components/Typographies/Link"
import { getSchemaError } from "../../config/validator/methods"
import { endDateSchema, startDateSchema } from "../../config/validator/schemas"
import { ListAllScoresParams, ScoreViewModel, listAllScoresApi } from "../../hooks/api/score"
import { GroupInColumn } from "../../styles/components"
import { listHeroTypeOptions } from "../../types/enums/heroType"
import { listRatingTypeOptions } from "../../types/enums/ratingType"
import { DefaultRoutePathEnum } from "../../types/enums/routePath"

enum LoadingEnum {
    None = 0,
    Get = 1,
}

interface ScoreFilterFormData {
    ratingTypes: number[]
    heroTypes: number[]
    lastMonths: number
    startDate: Date | null
    endDate: Date | null
}

const CUSTOM_PERIOD_VALUE = 0

const Scores = () => {
    const formRef = useRef<FormHandles>(null)

    const [isLoading, setIsLoading] = useState(LoadingEnum.None)
    const [warning, setWarning] = useState<WarningData | undefined>(undefined)
    const [hasMore, setHasMore] = useState(false)
    const [hasDateInput, setHasDateInput] = useState(false)
    const [scores, setScores] = useState<ScoreViewModel[]>([])
    const [scoreFilter, setScoreFilter] = useState<ListAllScoresParams>({})

    const ratingTypesOptions = listRatingTypeOptions()
    const heroTypesOptions = listHeroTypeOptions()
    const lastMonthsOptions: OptionData[] = [
        { label: 'No último mês', value: '1' },
        { label: 'Nos últimos 3 meses', value: '3' },
        { label: 'Nos últimos 6 meses', value: '6' },
        { label: 'Nos últimos 12 meses', value: '12' },
        { label: 'Personalizado (data)', value: `${CUSTOM_PERIOD_VALUE}` },
    ]

    useEffect(() => {
        getScoresData()
    }, [])

    const getScoresData = async (filter?: ListAllScoresParams, reset?: boolean) => {
        setIsLoading(LoadingEnum.Get)

        if (!filter)
            filter = scoreFilter

        if (filter.lastMonths === CUSTOM_PERIOD_VALUE && !hasDateInput)
            filter.lastMonths = undefined

        filter.page = reset ? 0 : scores[scores.length - 1]?.scoreId

        await listAllScoresApi(filter).then(response => {
            setScores(reset ? [...response] : [...scores, ...response])

            let more = response.length !== 0 && response.length % 10 === 0

            setHasMore(more)
            setScoreFilter(filter as ListAllScoresParams)
            setIsLoading(LoadingEnum.None)
        }).catch(() => { })
    }

    const submitFilterForm: SubmitHandler<ScoreFilterFormData> = async (data) => {
        try {
            setIsLoading(LoadingEnum.Get)
            setWarning(undefined)
            formRef.current?.setErrors({})

            const shema = Yup.object().shape({
                ratingTypes: Yup.array()
                    .of(Yup.string()),
                heroTypes: Yup.array()
                    .of(Yup.string()),
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

            data.ratingTypes = data.ratingTypes.map(x => Number(x))
            data.heroTypes = data.heroTypes.map(x => Number(x))
            data.lastMonths = data.lastMonths ? Number(data.lastMonths) : 0

            await getScoresData({
                ratingTypes: data.ratingTypes,
                heroTypes: data.heroTypes,
                lastMonths: data.lastMonths,
                startDate: data.startDate,
                endDate: data.endDate
            }, true)
        } catch (error) {
            let schemaError = getSchemaError(error)

            formRef.current?.setErrors(schemaError.errors)
            setWarning(schemaError.warning)
            setIsLoading(LoadingEnum.None)
        }
    }

    const handleCleanFilter = () => {
        setScoreFilter({})

        formRef.current?.reset()
    }

    const handleSelectLastMonths = (value: string) => {
        let hasDate = value === `${CUSTOM_PERIOD_VALUE}`

        setHasDateInput(hasDate)
    }

    return (
        <PageContainer>
            <section>
                <h1>Todas as pontuações</h1>

                <Toggle
                    text="Filtros"
                    closeOnChange={isLoading === LoadingEnum.None}
                >
                    <Form
                        ref={formRef}
                        onSubmit={submitFilterForm}
                        initialData={{
                            ratingTypes: scoreFilter.ratingTypes?.map(x => `${x}`),
                            heroTypes: scoreFilter.heroTypes?.map(x => `${x}`),
                            lastMonths: `${scoreFilter.lastMonths}`,
                            startDate: scoreFilter.startDate,
                            endDate: scoreFilter.endDate
                        }}
                    >
                        <Checkbox
                            name="ratingTypes"
                            label="Escolha as notas"
                            options={ratingTypesOptions}
                        />

                        <Checkbox
                            name="heroTypes"
                            label="Escolha as classes"
                            options={heroTypesOptions}
                        />

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

                        <GroupInColumn>
                            <Button
                                text="Filtrar"
                                type="submit"
                                isLoading={isLoading === LoadingEnum.Get}
                            />

                            {isLoading === LoadingEnum.None && <Button
                                text="Limpar filtro"
                                variant="outline"
                                onClick={handleCleanFilter}
                            />}
                        </GroupInColumn>
                    </Form>
                </Toggle>

                <LoadingText
                    defaultText=""
                    loadingText="Carregando lista de pontuações..."
                    isLoading={isLoading === LoadingEnum.Get}
                />
            </section>

            <article className="list-cards">
                {scores.map(x => (
                    <ScoreCard
                        key={x.scoreId}
                        data={x}
                    />
                ))}

                {scores.length === 0 && isLoading !== LoadingEnum.Get && <WarningCard
                    title="Nenhuma pontuação encontrada"
                    message="Nenhuma pontuação dos usuários foram encontradas."
                    variant="info"
                />}
            </article>

            {hasMore && <section>
                <LoadingText
                    defaultText=""
                    loadingText="Carregando mais pontuações..."
                    isLoading={isLoading === LoadingEnum.Get}
                />

                {isLoading !== LoadingEnum.Get && <Link
                    text="Exibir mais"
                    to={DefaultRoutePathEnum.Scores}
                    onClick={() => getScoresData()}
                />}
            </section>}
        </PageContainer>
    )
}

export default Scores
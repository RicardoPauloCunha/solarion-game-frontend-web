import { Bar, BarChart as BaseBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartViewModel } from '../../../hooks/api/score'
import { formatNumberToPercentage } from '../../../utils/number'

type BarChartProps = {
    colors: string[]
    charts: ChartViewModel[]
}

const BarChart = ({
    colors,
    charts
}: BarChartProps) => {
    return (
        <ResponsiveContainer
            width="100%"
            height={300}
        >
            <BaseBarChart
                data={charts[0]?.values?.map((x, index) => {
                    let data: any = { name: x.column }

                    charts.map(y => y.values ? y.values[index] : undefined).forEach((y, i) => {
                        data = {
                            ...data,
                            [`value${i}`]: y ? y.value : 0
                        }
                    })

                    return data
                })}
                margin={{
                    left: 16,
                }}
            >
                <XAxis
                    dataKey="name"
                />

                <YAxis
                    tickFormatter={formatNumberToPercentage}
                    tickCount={5}
                    domain={[0, () => 100]}
                />

                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <Tooltip
                    formatter={formatNumberToPercentage}
                    separator=": "
                />

                <Legend
                    verticalAlign="bottom"
                    align="center"
                />

                {charts.map((x, index) => (
                    <Bar
                        key={x.description}
                        name={x.description}
                        dataKey={`value${index}`}
                        fill={colors[index]}
                    />
                ))}
            </BaseBarChart>
        </ResponsiveContainer>
    )
}

export default BarChart
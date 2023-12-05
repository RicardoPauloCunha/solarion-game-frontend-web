import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartViewModel } from '../../../hooks/api/score'

type LineChartProps = {
    colors: string[]
    chart: ChartViewModel
}

const LineChart = ({
    colors,
    chart
}: LineChartProps) => {
    return (
        <ResponsiveContainer
            width="100%"
            height={300}
        >
            <AreaChart
                data={chart.values}
            >
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2} />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="column"
                />

                <YAxis
                    tickCount={5}
                    allowDecimals={false}
                />

                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <Tooltip
                    separator=": "
                />

                <Area
                    name={chart.description}
                    type="monotone"
                    dataKey="value"
                    stroke={colors[0]}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default LineChart
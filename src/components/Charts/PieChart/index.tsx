import { PieChart as BasePieChart, Cell, Pie, Tooltip } from "recharts"
import { ChartViewModel } from '../../../hooks/api/score'
import { formatNumberToPercentage } from "../../../utils/number"
import { Container } from "./styles"

interface PieChartProps {
    colors: string[]
    charts: ChartViewModel[]
}

const PieChart = ({
    colors,
    charts
}: PieChartProps) => {
    const total = charts.reduce((a, b) => a + b.totalValue, 0)

    const legends = charts.map(x => ({
        description: x.description,
        value: formatNumberToPercentage((x.totalValue / total) * 100)
    }))

    return (
        <Container>
            <BasePieChart
                width={200}
                height={200}
            >
                <Pie
                    dataKey="totalValue"
                    nameKey="description"
                    data={charts}
                    cx={95}
                    cy={95}
                    innerRadius={0}
                    outerRadius={95}
                >
                    {charts.map((x, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>

                <Tooltip
                    separator=": "
                />
            </BasePieChart>

            <ul>
                {legends.map((x, index) => (
                    <li key={index}>
                        <span style={{ backgroundColor: colors[index] }} />
                        {x.description}:
                        <strong>{x.value}</strong>
                    </li>
                ))}
            </ul>
        </Container>
    )
}

export default PieChart
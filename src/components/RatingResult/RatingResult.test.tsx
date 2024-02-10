import { render, screen } from "@testing-library/react"
import RatingResult from "."
import CatAImg from '../../assets/images/cat-a.png'
import CatBImg from '../../assets/images/cat-b.png'
import CatCImg from '../../assets/images/cat-c.png'
import CatDImg from '../../assets/images/cat-d.png'
import { RatingTypeEnum, getRatingTypeEnumValue } from "../../types/enums/ratingType"

const RATING_TYPE = RatingTypeEnum.A

const renderComponent = (options?: {
    ratingType?: RatingTypeEnum
}) => {
    render(<RatingResult
        size="small"
        ratingType={options?.ratingType ? options.ratingType : RATING_TYPE}
    />)
}

describe('RatingResult Comp', () => {
    it('should render a grade and an image', () => {
        renderComponent()

        const grade = screen.getByText(getRatingTypeEnumValue(RATING_TYPE))
        const image = screen.getByAltText('Reação do gato ao ver sua pontuação.')

        expect(grade).toBeInTheDocument()
        expect(image).toBeInTheDocument()
    })

    it.each([
        [RatingTypeEnum.A, CatAImg],
        [RatingTypeEnum.B, CatBImg],
        [RatingTypeEnum.C, CatCImg],
        [RatingTypeEnum.D, CatDImg],
    ])('should match the grade %p with the image %p', (ratingType, img) => {
        renderComponent({
            ratingType
        })

        const grade = screen.getByText(getRatingTypeEnumValue(ratingType))
        const image = screen.getByAltText('Reação do gato ao ver sua pontuação.')

        expect(grade).toBeInTheDocument()
        expect(image).toHaveAttribute('src', img)
    })
})
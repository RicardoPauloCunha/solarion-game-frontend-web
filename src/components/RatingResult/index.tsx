import CatAImg from '../../assets/images/cat-a.png'
import CatBImg from '../../assets/images/cat-b.png'
import CatCImg from '../../assets/images/cat-c.png'
import CatDImg from '../../assets/images/cat-d.png'
import { RatingTypeEnum, getRatingTypeEnumValue } from "../../types/enums/ratingType"
import { Container } from "./styles"

export interface RatingResultProps {
    size: 'small' | 'large'
    ratingType: RatingTypeEnum
}

const RatingResult = ({
    size,
    ratingType
}: RatingResultProps) => {
    const defineCatImg = () => {
        switch (ratingType) {
            case RatingTypeEnum.A:
                return CatAImg
            case RatingTypeEnum.B:
                return CatBImg
            case RatingTypeEnum.C:
                return CatCImg
            case RatingTypeEnum.D:
                return CatDImg
            default:
                return ''
        }
    }

    const rating = getRatingTypeEnumValue(ratingType)
    const img = defineCatImg()

    return (
        <Container
            size={size}
            $ratingType={ratingType}
        >
            <span>{rating}</span>

            <img src={img} alt="Reação do gato ao ver sua pontuação." />
        </Container>
    )
}

export default RatingResult
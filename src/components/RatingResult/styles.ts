import styled, { css, keyframes } from "styled-components";
import { RatingTypeEnum } from "../../types/enums/ratingType";

interface ContainerProps {
    size: 'small' | 'large'
    $ratingType: RatingTypeEnum
}

const RatingInAnimation = keyframes`
    0%, 30% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
`;

const ImageInAnimation = keyframes`
    0%, 49%, 50%, 65% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
`

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    >span, >img {
        border-radius: 0.5rem;
        border: solid 0.15rem var(--color-wine);
    }

    >span {
        color: var(--color-white);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;

        ${({ $ratingType }) => $ratingType === RatingTypeEnum.A && css`
            background-color: var(--color-yellow);
        `}

        ${({ $ratingType }) => $ratingType === RatingTypeEnum.B && css`
            background-color: var(--color-pink);
        `}

        ${({ $ratingType }) => $ratingType === RatingTypeEnum.C && css`
            background-color: var(--color-blue);
        `}

        ${({ $ratingType }) => $ratingType === RatingTypeEnum.D && css`
            background-color: var(--color-cyan);
        `}
    }

    ${({ size }) => size === 'small' ? css`
        gap: 1rem;

        >span, >img {
            width: 5rem;
            height: 5rem;
        }
        
        >span {
            font-size: calc(5rem * 0.5);
        }
    ` : css`
        gap: 2rem;

        >span, >img {
            width: calc(100vw - 2rem);
            height: calc(100vw - 2rem);
            max-width: 16rem;
            max-height: 16rem;
            border-width: 0.25rem;
        }

        >span {
            animation: ${RatingInAnimation} 1000ms normal 1 ease-in;
            font-size: calc(16rem * 0.5);
        }

        >img {
            animation: ${ImageInAnimation} 2000ms normal 1 ease-in;
        }
    `}

    @media(max-width: 768px) {
        justify-content: space-around;

        ${({ size }) => size === 'small' ? css`
            >span, >img {
                width: 7rem;
                height: 7rem;
            }
            
            >span {
                font-size: calc(7rem * 0.5);
            }
        ` : css`
            flex-wrap: wrap;

            >span, >img {
                max-width: 12rem;
                max-height: 12rem;
                border-width: 0.25rem;
            }

            >span {
                font-size: calc(12rem * 0.5);
            }
        `}
    }

    @media(max-width: 450px) {
        ${({ size }) => size === 'large' && css`
            >span, >img {
                max-width: 8rem;
                max-height: 8rem;
            }

            >span {
                font-size: calc(8rem * 0.5);
            }
        `}
    }

    @media(max-width: 320px) {
        ${({ size }) => size === 'large' && css`
            >span, >img {
                max-width: calc(100vw - 2rem);
                max-height: calc(100vw - 2rem);
            }

            >span {
                font-size: calc(100vw * 0.5);
            }
        `}
    }
`
import styled, { css } from "styled-components";
import { RatingTypeEnum } from "../../types/enums/ratingType";

export interface ContainerProps {
    size: 'small' | 'large'
    $ratingType: RatingTypeEnum
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    >img, >span {
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

        >img, >span {
            width: 5rem;
            height: 5rem;
        }
        
        >span {
            font-size: calc(5rem * 0.5);
        }
    ` : css`
        gap: 2rem;

        >img, >span {
            width: calc(100vw - 2rem);
            height: calc(100vw - 2rem);
            max-width: 16rem;
            max-height: 16rem;
            border-width: 0.25rem;
        }

        >span {
            font-size: calc(16rem * 0.5);
        }
    `}

    @media(max-width: 768px) {
        justify-content: space-around;

        ${({ size }) => size === 'small' ? css`
            >img, >span {
                width: 7rem;
                height: 7rem;
            }
            
            >span {
                font-size: calc(7rem * 0.5);
            }
        ` : css`
            flex-wrap: wrap;

            >img, >span {
                max-width: 12rem;
                max-height: 12rem;
            }

            >img, >span {
                border-width: 0.25rem;
            }

            >span {
                font-size: calc(12rem * 0.5);
            }
        `}
    }

    @media(max-width: 450px) {
        ${({ size }) => size === 'large' && css`
            >img, >span {
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
            >img, >span {
                max-width: calc(100vw - 2rem);
                max-height: calc(100vw - 2rem);
            }

            >span {
                font-size: calc(100vw * 0.5);
            }
        `}
    }
`
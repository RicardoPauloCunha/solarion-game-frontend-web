import styled, { css, keyframes } from "styled-components";

export const enum ImageAnimationEnum {
    None = 0,
    Out = 1,
    OutToIn = 2,
}

interface ImageProps {
    $imageAnimation: ImageAnimationEnum
}

const imageOutAnimation = keyframes`
    0% {
        opacity: 1;
    }

    70%, 100% {
        opacity: 0;
    }
`;

export const Image = styled.img<ImageProps>`
    ${({ $imageAnimation }) => $imageAnimation === ImageAnimationEnum.Out && css`
        animation: ${imageOutAnimation} 1000ms normal 1 forwards ease-out;
    `}

    ${({ $imageAnimation }) => $imageAnimation === ImageAnimationEnum.OutToIn && css`
        animation: ${imageOutAnimation} 1000ms alternate 2 ease-out;
    `}
`

export const enum TextAnimationEnum {
    None = 0,
    Out = 1,
    In = 2,
}

interface SectionProps {
    $textAnimation: TextAnimationEnum
}

const textOutAnimation = keyframes`
    0% {
        display: flex;
    }

    100% {
        display: none;
    }
`;

const TextInAnimation = keyframes`
    0% {
        display: none;
        transform: scale(0.3);
    }

    100% {
        display: flex;
        transform: scale(1);
    }
`;

export const Section = styled.section<SectionProps>`
    ${({ $textAnimation }) => $textAnimation === TextAnimationEnum.Out && css`
        animation: ${textOutAnimation} 200ms normal 1 forwards ease-out;
    `}

    ${({ $textAnimation }) => $textAnimation === TextAnimationEnum.In && css`
        animation: ${TextInAnimation} 500ms normal 1 forwards ease-out;
    `}
`
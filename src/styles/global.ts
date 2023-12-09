import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        --color-white: #FFFFFF;
        --color-black: #101010;
        --color-dark-gray: #282828;
        --color-gray: #999999;
        --color-light-gray: #BFBFBF;
        --color-light-orange: #F3B266;
        --color-light-wine: #993D33;
        --color-wine: #5B191E;
        --color-red: #B22222;
        --color-green: #345B4D;
        --color-yellow: #F79824;
        --color-pink: #DC6BAD;
        --color-blue: #228CDB;
        --color-cyan: #02C39A;
    }

    body {
        background-color: var(--color-dark-gray);
        color: var(--color-black);
        font-family: 'Inter', sans-serif;
        width: 100%;
        height: 100%;
        padding: 1rem;

        >div#root >div.App {
            gap: 4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 2rem;

            >img {
                width: 100%;
                max-width: 600px;
                margin: 0 1rem;
                line-height: 300px;
                text-align: center;
            }
        }
    }

    h1 {
        width: 100%;
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0;
        text-align: center;
    }

    h2 {
        width: 100%;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0;
    }

    h3 {
        width: 100%;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0;
    }

    p {
        width: 100%;
        font-size: 1.25rem;
        margin-bottom: 0;

        >strong {
            font-size: 1.25rem;
        }
    }

    small, strong, span {
        font-size: 1rem;
    }

    section {
        border: 0.25rem solid var(--color-light-wine);
        box-shadow:
            0px 0px 0px 0.25rem var(--color-wine),
            0px 0px 0px 0.25rem var(--color-wine) inset;
        border-radius: 0.5rem;
        padding: 1.5rem;
        background-color: var(--color-light-orange);
        width: 100%;
        max-width: 768px;
        margin: 0 1rem;
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        &.select-cursor-pointer {
            cursor: pointer;
        }
    }

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        >button, >fieldset + div {
            margin-top: 1rem;
        }
    }

    img {
        background-color: var(--color-gray);
    }

    .modal-content {
        border: 0.25rem solid var(--color-light-wine);
        box-shadow:
            0px 0px 0px 0.25rem var(--color-wine),
            0px 0px 0px 0.25rem var(--color-wine) inset;
        border-radius: 0.5rem;
        padding: 1.5rem;
        background-color: var(--color-light-orange);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .stylized-margin {
        border: 0.25rem solid var(--color-light-wine);
        box-shadow:
            0px 0px 0px 0.25rem var(--color-wine),
            0px 0px 0px 0.25rem var(--color-wine) inset;
        border-radius: 0.5rem;
    }

    .click-animation {
        transition-duration: 300ms;
        cursor: pointer;

        &:hover {
            opacity: 0.75;
        }

        &:active {
            transform: scale(0.975);
        }
    }

    .list-cards {
        width: 100%;
        max-width: 768px;
        margin: 0 1rem;
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    @media(max-width: 768px) {
        body >div#root >div.App {
            gap: 4rem;
            margin-bottom: 4rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        h2 {
            font-size: 1.25rem;
        }

        h3 {
            font-size: 1.15rem;
        }

        p {
            font-size: 1rem;

            >strong {
                font-size: 1rem;
            }
        }
    }
`
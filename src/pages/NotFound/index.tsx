import NotFoundImg from '../../assets/images/not-found.png'
import PageContainer from "../../components/PageContainer"

const NotFound = () => {
    return (
        <PageContainer>
            <img
                className="stylized-margin"
                src={NotFoundImg}
                alt="Reação da Raeliana ao receber a informação (The Reason Why Raeliana Ended Up at the Duke's Mansion)."
            />

            <section>
                <h2>...</h2>

                <p>Parece que a página não foi encontrada.</p>
            </section>
        </PageContainer>
    )
}

export default NotFound
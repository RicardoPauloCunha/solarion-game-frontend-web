import NotFoundImg from '../../assets/images/not-found.png'
import PageContainer from "../../components/PageContainer"

const NotFound = () => {
    return (
        <PageContainer>
            <img
                className="stylized-margin"
                src={NotFoundImg}
                alt="Usuário: '?', Servidor: '...', Imagem para amenizar a página não encontrada."
            />

            <section>
                <h2>...</h2>

                <p>Parece que a página não foi encontrada.</p>
            </section>
        </PageContainer>
    )
}

export default NotFound
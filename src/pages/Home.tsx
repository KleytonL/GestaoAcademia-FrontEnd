import academiaImg from '../assets/academia.jpg'

function Home() {
    return (
        <section className="hero" style={{ backgroundImage: `linear-gradient(to right, #F56C23, #F56C235A, #F56C2300), url(${academiaImg})`}}>
            <div className="overlay">
                <h1>VIVA A ADRENALINA!<br/>SINTA A MUDANÇA!</h1>
                <p>Bem-vindo ao sistema de gerenciamento de alunos e mensalidade</p>
            </div>
        </section>
    )
}

export default Home
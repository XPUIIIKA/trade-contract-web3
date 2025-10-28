import logo from '../assets/Hi.webp';

function Home() {

  return (
    <div className="div flex-div">
      <h1>Hi friend!</h1>
      <img src={logo} alt="Hi friend!"/>
      <div className='wrapper-70'>
        <h3>Did you know that using this app you can sell or buy anything?
           Just click the "Seller" or "Customer" buttons at the top.</h3>
      </div>
    </div>
  )
}

export default Home
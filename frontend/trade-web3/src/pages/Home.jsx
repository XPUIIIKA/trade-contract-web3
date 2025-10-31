import img from "../assets/hi.webp";

function Home() {
  return (
    <div className="div flex-div mt-10">
      <h1>Hi friend!</h1>
      <img src={img} alt="Hi friend!" />
      <div className="wrapper-70">
        <h3>
          Did you know that using this app you can sell or buy anything? Just click
        </h3>
        <h2>"Seller" or "Customer"</h2>
        <h3>buttons at the top.</h3>
      </div>
    </div>
  );
}

export default Home;

import img from '../assets/sad.webp';

function NotFound() {

  return (
    <div className="div flex-div mt-10">
      <h1>There's nothing here</h1>
      <img src={img} alt="There's nothing here"/>
    </div>
  )
}

export default NotFound
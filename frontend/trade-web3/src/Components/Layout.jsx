import { Outlet, useNavigate } from "react-router-dom"

function Layout() {
  const navigate = useNavigate();

  const homeBtnHandler = () => {
    navigate("/");
  }
  const sellerBtnHandler = () => {
    navigate("/seller");
  }
  const customerBtnHandler = () => {
    navigate("/customer");
  }
  return (
    <div className="container">
      <header>
        <button onClick={homeBtnHandler}>
          <p>Home</p>
        </button>
        <button onClick={sellerBtnHandler}>
          <p>Seller</p>
        </button>
        <button onClick={customerBtnHandler}>
          <p>Customer</p>
        </button>
      </header>
      <Outlet />
    </div>
  )
}

export default Layout
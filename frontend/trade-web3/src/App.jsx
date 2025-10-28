import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./сomponents/Layout";
import Customer from "./pages/Customer";
import Seller from "./pages/Seller";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="seller" element={<Seller />} />
        <Route path="customer" element={<Customer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

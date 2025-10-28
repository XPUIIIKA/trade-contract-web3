import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./сomponents/Layout";
import Customer from "./сomponents/Customer";
import Seller from "./сomponents/Seller";
import NotFound from "./сomponents/NotFound";
import Home from "./сomponents/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="seller" element={<Seller />} />
        <Route path="customer" element={<Customer />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

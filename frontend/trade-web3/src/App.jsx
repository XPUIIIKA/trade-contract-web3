import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Customer from "./Components/Customer";
import Seller from "./Components/Seller";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home";

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

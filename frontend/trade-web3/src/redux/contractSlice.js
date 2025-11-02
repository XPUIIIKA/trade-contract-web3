import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractAddress: "",
  status: "I don't know ¯\\_(ツ)_/¯",
  products: [],
  seller: "",
  customer: "",
  loading: false,
  orderedProduct: { product: "", price: 0 },
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContractAddress(state, action) {
      state.contractAddress = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSeller(state, action) {
      state.seller = action.payload;
    },
    setCustomer(state, action) {
      state.customer = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setOrderedProduct(state, action) {
      state.orderedProduct.product = action.payload.product;
      state.orderedProduct.price = action.payload.price;
    },
  },
});

export const {
  setContractAddress,
  setStatus,
  setProducts,
  setSeller,
  setCustomer,
  setLoading,
  setOrderedProduct,
} = contractSlice.actions;

export default contractSlice.reducer;

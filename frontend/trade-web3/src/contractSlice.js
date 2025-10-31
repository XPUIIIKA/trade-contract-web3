import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractAddress: "",
  status: "",
  products: [],
  seller: "",
  customer: "",
  loading: false
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContractAddress(state, action) {
      state.address = action.payload;
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
    }
  }
});

export const {
  setContractAddress,
  setStatus,
  setProducts,
  setSeller,
  setCustomer,
  setLoading
} = contractSlice.actions;

export default contractSlice.reducer;

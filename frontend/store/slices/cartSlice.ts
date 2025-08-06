import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  sku: string;
  variant?: {
    size?: string;
    color?: string;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => 
          item._id === action.payload._id && 
          JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action: PayloadAction<{ _id: string; variant?: { size?: string; color?: string } }>) => {
      state.items = state.items.filter(
        item => 
          !(item._id === action.payload._id && 
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant))
      );

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action: PayloadAction<{ 
      _id: string; 
      quantity: number; 
      variant?: { size?: string; color?: string } 
    }>) => {
      const item = state.items.find(
        item => 
          item._id === action.payload._id && 
          JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      );

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            item => 
              !(item._id === action.payload._id && 
                JSON.stringify(item.variant) === JSON.stringify(action.payload.variant))
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },

    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadCart 
} = cartSlice.actions;

export default cartSlice.reducer; 
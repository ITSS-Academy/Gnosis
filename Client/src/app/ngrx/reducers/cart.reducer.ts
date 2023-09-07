import { createReducer, on } from '@ngrx/store';
import { CartState } from '../states/cart.state';
import * as CartAction from '../actions/cart.actions';

export const initualState: CartState = {
  cartList: [],
  courseList: [],
  total: 0,
};

export const CartReducer = createReducer(
  initualState,
  on(CartAction.addCourseToCart, (state, action) => {
    console.log(action.type);
    const cartList = [...state.cartList, action.course];
    //console.log(cartList);
    const total = state.total + action.course.price;
    let newState: CartState = {
      ...state,
      cartList,
      total,
    };
    return newState;
  }),

  on(CartAction.removeCourseFromCart, (state, action) => {
    console.log(action.type);
    let newState: CartState = {
      ...state,
      cartList: state.cartList.filter(
        (course) => course._id !== action.course._id
      ),
      // total: state.total - action.course.price,\
      total: parseFloat((state.total - action.course.price).toFixed(3)),
    };
    return newState;
  }),

  on(CartAction.clearAllCart, (state, action) => {
    console.log(action.type);
    const productList = state.courseList.map((course) => {
      return {
        ...course,
      };
    });
    return {
      ...state,
      productList,
      cartList: [],
      total: 0,
    };
  })
);

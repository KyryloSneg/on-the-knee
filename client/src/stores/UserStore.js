import { makeAutoObservable } from "mobx";
import { MOCK_USER } from "../utils/mobxStoresConsts";

class UserStore {
  constructor() {
    this._isAuth = true;
    // TODO: change it to {} when I implement user authentication logic
    this._user = MOCK_USER;
    this._cart = {};
    this._cartDeviceCombinations = [];

    this._cartDataFetching = null;
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  setCart(cart) {
    this._cart = cart;
  }

  setCartDeviceCombinations(cartDeviceCombinations) {
    this._cartDeviceCombinations = cartDeviceCombinations;
  }

  setCartDataFetching(fn) {
    this._cartDataFetching = fn;
  }

  get isAuth() {
    return this._isAuth;
  }
  
  get user() {
    return this._user;
  }

  get cart() {
    return this._cart;
  }

  get cartDeviceCombinations() {
    return this._cartDeviceCombinations;
  }

  get cartDataFetching() {
    return this._cartDataFetching;
  }
}

export default UserStore;
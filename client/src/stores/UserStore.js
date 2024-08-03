import { makeAutoObservable } from "mobx";
import { MOCK_USER } from "../utils/mobxStoresConsts";

class UserStore {
  constructor() {
    this._isAuth = false;
    // TODO: change it to {} when I'll implement user authentication logic
    this._user = {};
    this._cart = {};
    this._cartDeviceCombinations = [];
    this._cartSelectedAdditionalServices = {};

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

  setCartSelectedAdditionalServices(cartSelectedAdditionalServices) {
    this._cartSelectedAdditionalServices = cartSelectedAdditionalServices;
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

  get cartSelectedAdditionalServices() {
    return this._cartSelectedAdditionalServices;
  }

  get cartDataFetching() {
    return this._cartDataFetching;
  }
}

export default UserStore;
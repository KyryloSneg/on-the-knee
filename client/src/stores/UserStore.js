import { makeAutoObservable } from "mobx";
import { isAuthFetch, login, registerUser } from "../http/UserAPI";

class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._userAddress = {};
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

  setUserAddress(userAddress) {
    this._userAddress = userAddress;
  }

  async register(name, surname, password, email, phoneNumber, ip) {
    try {
      const data = await registerUser({ name, surname, password, email, phoneNumber, ip });
      localStorage.setItem("token", data.accessToken);

      this.setIsAuth(true);
      this.setUser(data.user);
      this.setUserAddress(data.address);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async login(address, password, ip) {
    try {
      const data = await login({ address, password, ip });
      localStorage.setItem("token", data.accessToken);

      this.setIsAuth(true);
      this.setUser(data.user);
      this.setUserAddress(data.address);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  // logout will remove "token" item from the localStorage when the method will be created

  async checkIsAuth() {
    try {
      const data = await isAuthFetch();
      localStorage.setItem("token", data.accessToken);

      this.setIsAuth(true);
      this.setUser(data.user);
      this.setUserAddress(data.address);
    } catch(e) {
      console.log(e.response);
      console.log(e.response?.data?.message);
    }
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

  get userAddress() {
    return this._userAddress;
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
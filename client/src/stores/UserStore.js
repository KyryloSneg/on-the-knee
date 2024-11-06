import { makeAutoObservable } from "mobx";
import { changeUserEmail, changeUserNameSurname, changeUserPassword, changeUserPhoneNumber, getUserEmailsToConfirm, isAuthFetch, login, logout, registerUser } from "../http/UserAPI";

class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._userAddress = {};
    this._userEmailsToConfirm = [];
    this._isEmailActivated = false;

    this._cart = {};
    this._cartDeviceCombinations = [];
    this._cartSelectedAdditionalServices = {};

    this._desiredList = {};
    this._desiredListDevices = [];

    this._viewedDevicesList = {};
    this._viewedDevices = [];

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

  setUserEmailsToConfirm(userEmailsToConfirm) {
    this._userEmailsToConfirm = userEmailsToConfirm;
  }

  setIsEmailActivated(isEmailActivated) {
    this._isEmailActivated = isEmailActivated;
  }

  async register(name, surname, password, email, phoneNumber, ip) {
    try {
      const data = await registerUser({ name, surname, password, email, phoneNumber, ip });
      localStorage.setItem("token", data.accessToken);

      this.setIsAuth(true);
      this.setUser(data.user);
      this.setUserAddress(data.address);
      this.setIsEmailActivated(data.activationInfo.isActivated);
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
      this.setIsEmailActivated(data.activationInfo.isActivated);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async logout() {
    try {
      await logout();
      localStorage.removeItem("token");

      this.setIsAuth(false);
      this.setUser({});
      this.setUserAddress({});
      this.setIsEmailActivated(false);
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
      this.setUserEmailsToConfirm(data.emailsToConfirm);
      this.setIsEmailActivated(data.activationInfo.isActivated);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async changeNameSurname(name, surname) {
    try {
      const data = await changeUserNameSurname(name, surname);
      this.setUser(data);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      await changeUserPassword(currentPassword, newPassword);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async changePhoneNumber(phoneNumber) {
    try {
      const data = await changeUserPhoneNumber(phoneNumber);
      this.setUserAddress(data);
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async changeEmail(email) {
    try {
      const emailsToConfirm = await changeUserEmail(email);
      return emailsToConfirm;
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
    }
  }

  async getEmailsToConfirm() {
    try {
      const emailsToConfirm = await getUserEmailsToConfirm();
      return emailsToConfirm;
    } catch(e) {
      console.log(e.response?.data?.message);
      return e;
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

  setDesiredList(desiredList) {
    this._desiredList = desiredList;
  }

  setDesiredListDevices(desiredListDevices) {
    this._desiredListDevices = desiredListDevices;
  }

  setViewedDevicesList(viewedDevicesList) {
    this._viewedDevicesList = viewedDevicesList;
  }

  setViewedDevices(viewedDevices) {
    this._viewedDevices = viewedDevices;
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

  get userEmailsToConfirm() {
    return this._userEmailsToConfirm;
  }

  get isEmailActivated() {
    return this._isEmailActivated;
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

  get desiredList() {
    return this._desiredList;
  }

  get desiredListDevices() {
    return this._desiredListDevices;
  }

  get viewedDevicesList() {
    return this._viewedDevicesList;
  }

  get viewedDevices() {
    return this._viewedDevices;
  }

  get cartDataFetching() {
    return this._cartDataFetching;
  }
}

export default UserStore;
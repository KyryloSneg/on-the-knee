import { makeAutoObservable } from "mobx";
import { MOCK_USER } from "../utils/mobxStoresConsts";

class UserStore {
  constructor() {
    this._isAuth = true;
    // TODO: change it to {} when I implement user authentication logic
    this._user = MOCK_USER;
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }
  
  get user() {
    return this._user;
  }
}

export default UserStore;
import setAuthentificationModalVisibility from "./setAuthentificationModalVisibility";

export default function onAccountBtnClick(isAuth, app, btnRef = null) {
  if (!isAuth) {
    setAuthentificationModalVisibility(true, app);
    if (btnRef) app.setAuthentificationModalBtnRef(btnRef);
  }
};
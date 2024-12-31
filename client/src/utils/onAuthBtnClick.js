import setAuthentificationModalVisibility from "./setAuthentificationModalVisibility";

// auth btn is a btn, a link etc. which logic requires authentification
export default function onAuthBtnClick(isAuth, app, btnRef = null) {
  if (!isAuth) {
    setAuthentificationModalVisibility(true, app);
    if (btnRef) app.setAuthentificationModalBtnRef(btnRef);
  }
};
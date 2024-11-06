import "./styles/UserPersonalPageBtnGroup.css";
import { useContext, useRef } from "react";
import UIButton from "./UI/uiButton/UIButton";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import useNavigateToEncodedURL from "hooks/useNavigateToEncodedURL";
import { ROOT_ROUTE } from "utils/consts";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import setUserChangePasswordModalVisibility from "utils/setUserChangePasswordModalVisibility";

const UserPersonalPageBtnGroup = observer(() => {
  const { app, user } = useContext(Context);
  const navigate = useNavigateToEncodedURL();

  const changePasswordBtnRef = useRef(null);
  const logoutBtnRef = useRef(null);

  async function onPasswordChangeClick() {
    app.setUserChangePasswordModalBtnRef(changePasswordBtnRef);
    setUserChangePasswordModalVisibility(true, app);
  }

  async function onLogoutClick() {
    try {
      await user.logout();
      navigate(ROOT_ROUTE);
    } catch {
      const errorModalInfoChildren = (
        <p className="logout-error-modal">
          Unfortunately, log out has leaded to fail. Try a bit later
        </p>
      );

      app.setErrorModalInfo({ children: errorModalInfoChildren, id: "logout-error-modal", className: "" });
      app.setErrorModalBtnRef(logoutBtnRef);
      setErrorModalVisibility(true, app);
    }
  }

  return (
    <div className="user-personal-page-btn-group">
      <UIButton variant="primary3" children="Change password" onClick={onPasswordChangeClick} ref={changePasswordBtnRef} />
      <UIButton variant="primary3" children="Log out" onClick={onLogoutClick} ref={logoutBtnRef} />
    </div>
  );
});

export default UserPersonalPageBtnGroup;

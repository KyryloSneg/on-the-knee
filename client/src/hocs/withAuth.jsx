import { useContext, useEffect, useRef, useState } from "react";
import LocalStorageActions from "../utils/LocalStorageActions";
import { Context } from "../Context";

const withAuth = (Component) => {
  const AuthentificatedComponent = (props) => {
    const { user } = useContext(Context);

    const isSettedRefreshToken = !!LocalStorageActions.getItem("token", true, false)
    // there's no need in checking is user authentificated if there's no refresh token
    const [isCheckedAuth, setIsCheckedAuth] = useState(!isSettedRefreshToken);
    const isAlreadyInvokedCheck = useRef(false);

    useEffect(() => {
      if (!isCheckedAuth) {
        async function callback() {
          isAlreadyInvokedCheck.current = true;
  
          await user.checkIsAuth();
          setIsCheckedAuth(true);
        }

        if (!isAlreadyInvokedCheck.current) {
          callback();
        }
      }
      // the hook must be called only once
      // eslint-disable-next-line
    }, []);
    
    if (!isCheckedAuth) return;
    
    return <Component {...props} />;
  }

  return AuthentificatedComponent;
}

export default withAuth;

import { useContext, useEffect } from "react";
import setCategoriesModalVisibility from "../utils/setCategoriesModalVisibility";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";
import { Context } from "../Context";
import setMenuVisibility from "../utils/setMenuVisibility";
import setFiltersSidebarVisibility from "../utils/setFiltersSidebarVisibility";
import setUsedFiltersBarVisibility from "../utils/setUsedFiltersBarVisibility";
import { useLocation } from "react-router-dom";
import setSearchFormVisibility from "../utils/setSearchFormVisibility";
import setSelectUserLocationVisibility from "../utils/setSelectUserLocationModalVisibility";
import setDeviceFeedbackModalVisibility from "../utils/setDeviceFeedbackModalVisibility";
import setReplyModalVisibility from "../utils/setReplyModalVisibility";
import setQuestionCommentModalVisibility from "../utils/setQuestionCommentModalVisibility";
import setAnswerModalVisibility from "../utils/setAnswerModalVisibility";
import setAskSellerModalVisibility from "../utils/setAskSellerModalVisibility";
import setCommentGalleryModalVisibility from "../utils/setCommentGalleryModalVisibility";
import setSelfDeliveryModalVisibility from "../utils/setSelfDeliveryModalVisibility";
import setCartModalVisibility from "../utils/setCartModalVisibility";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";
import setWrongCartComboAmountsModalVisibility from "../utils/setWrongCartComboAmountsVisibility";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";

function useClosingAllWindows() {
  const location = useLocation();
  const { app } = useContext(Context);

  // TODO: close every new modal window / sidebar / maybe even new menu that causes dark bg appearing
  useEffect(() => {
    setCategoriesModalVisibility(false, app);
    setCategoriesMenuVisibility(false, app);
    setSelectUserLocationVisibility(false, app);
    setSelfDeliveryModalVisibility(false, app);
    setMenuVisibility(false, app);
    setFiltersSidebarVisibility(false, app);
    setUsedFiltersBarVisibility(false, app);
    setSearchFormVisibility(false, app);

    setDeviceFeedbackModalVisibility(false, app);
    setReplyModalVisibility(false, app);
    setQuestionCommentModalVisibility(false, app);
    setAnswerModalVisibility(false, app);
    setCommentGalleryModalVisibility(false, app);
    setAskSellerModalVisibility(false, app);
    setCartModalVisibility(false, app);

    setErrorModalVisibility(false, app);
    setWrongCartComboAmountsModalVisibility(false, app);
    setAuthentificationModalVisibility(false, app);

    app.setDarkBgVisible(false, app);
    app.setIsBlockedScroll(false, app);
  }, [app, location]);
}

export default useClosingAllWindows;
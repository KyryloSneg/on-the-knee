import { useContext, useEffect } from "react";
import "./styles/UserDevicesFeedbacksPage.css";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";
import { Context } from "Context";
import { observer } from "mobx-react-lite";

const UserDevicesFeedbacksPage = observer(({ userDeviceFeedbacksObjArray }) => {
  const { app, user } = useContext(Context);
  if (!userDeviceFeedbacksObjArray?.length) return <div aria-hidden="true" />;

  useEffect(() => {
    app.setCommentModalGetCommentsQueryParamsStr(`&userId=${user.user.id}`)

    return () => {
      app.setCommentModalGetCommentsQueryParamsStr("");
    };
  }, [app, user.user]);

  return (
    <RemainSellerDevFeedback propsDevCombosFeedbacksObjArray={userDeviceFeedbacksObjArray} />
  );
});

export default UserDevicesFeedbacksPage;

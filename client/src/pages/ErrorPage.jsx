import "./styles/ErrorPage.css";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import UIButton from "components/UI/uiButton/UIButton";
import { useRouteError } from "react-router-dom";
import App from "App";
import NotFoundPage from "./NotFoundPage";
import ApiError from "utils/ApiError";

const ErrorPage = () => {
  useSettingDocumentTitle("Something has gone wrong");
  const error = useRouteError();

  if (error instanceof ApiError && error?.status === 404) {
    return <App isToRenderPageFromTheRouter={false} children={<NotFoundPage />} />;
  }

  return (
    <main className="error-page">
      <section>
        <h1>
          Error!
        </h1>
        <p>
          Oops... Something has gone terribly wrong.<br /> 
          Check out the other pages or, if they bring you back here, visit the site later.
        </p>
        <UIButton isLink={true} to="/">
          Return to the main page
        </UIButton>
      </section>
    </main>
  );
};

export default ErrorPage;

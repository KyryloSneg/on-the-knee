import "./styles/NotFoundPage.css";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import UIButton from "components/UI/uiButton/UIButton";

/**
  * a page that appears when user has navigated to url that returns invalid dynamic params
  */
const NotFoundPage = () => {
  useSettingDocumentTitle("Have not found such a page");

  return (
    <main className="error-page not-found-page">
      <section>
        <h2>
          404 Error
        </h2>
        <p>
          <span>Have not found such a page.</span>
          Ensure that you've entered the correct URL or check out the other pages.
        </p>
        <UIButton isLink={true} to="/">
          Return to the main page
        </UIButton>
      </section>
    </main>
  );
}

export default NotFoundPage;

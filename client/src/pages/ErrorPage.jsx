import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const ErrorPage = () => {
  useSettingDocumentTitle("Something has gone wrong");

  return (
    <div>
      ErrorPage
    </div>
  );
};

export default ErrorPage;

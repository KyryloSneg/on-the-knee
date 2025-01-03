import "./styles/MainPage.css";
import MainPageAside from "components/MainPageAside";
import MainPageMainContent from "components/MainPageMainContent";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const MainPage = () => {
  useSettingDocumentTitle("On the knee");

  return (
    <div className="main-page">
      <MainPageAside /> 
      <MainPageMainContent />
    </div>
  );
};

export default MainPage;

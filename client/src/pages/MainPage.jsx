import "./styles/MainPage.css";
import MainPageAside from "components/MainPageAside";
import MainPageMainContent from "components/MainPageMainContent";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import { META_MAIN_PAGE_DESCRIPTION, META_MAIN_PAGE_KEYWORDS } from "utils/consts";

const MainPage = () => {
  useSettingDocumentTitle("On the knee");

  return (
    <div className="main-page">
      <MetaTagsInPublicRoute description={META_MAIN_PAGE_DESCRIPTION} keywords={META_MAIN_PAGE_KEYWORDS} />
      <MainPageAside /> 
      <MainPageMainContent />
    </div>
  );
};

export default MainPage;

import "./styles/MainPage.css";
import MainPageAside from "components/MainPageAside";
import MainPageMainContent from "components/MainPageMainContent";

const MainPage = () => {
  return (
    <div className="main-page">
      <MainPageAside /> 
      <MainPageMainContent />
    </div>
  );
};

export default MainPage;

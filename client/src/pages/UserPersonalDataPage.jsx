import "./styles/UserPersonalDataPage.css";
import UserPersonalPageBtnGroup from "components/UserPersonalPageBtnGroup";
import UserPersonalPageDetailsList from "components/UserPersonalPageDetailsList";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const UserPersonalDataPage = () => {
  useSettingDocumentTitle("Personal data");

  return (
    <section className="user-page-section user-personal-data-page">
      <h2>
        Personal data
      </h2>
      <UserPersonalPageDetailsList />
      <UserPersonalPageBtnGroup />
    </section>
  );
}

export default UserPersonalDataPage;
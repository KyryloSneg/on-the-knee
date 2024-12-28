import "./styles/UserPersonalDataPage.css";
import UserPersonalPageBtnGroup from "components/UserPersonalPageBtnGroup";
import UserPersonalPageDetailsList from "components/UserPersonalPageDetailsList";

const UserPersonalDataPage = () => {
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
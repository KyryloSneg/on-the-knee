import "./styles/UserPersonalPageDetailsList.css";
import UserPersonalPageAddressesDetails from "./UserPersonalPageAddressesDetails";
import UserPersonalPageNameDetails from "./UserPersonalPageNameDetails";

const UserPersonalPageDetailsList = () => {
  return (
    <ul className="user-personal-page-details-list">
      <li>
        <UserPersonalPageNameDetails />
      </li>
      <li>
        <UserPersonalPageAddressesDetails />
      </li>
    </ul>
  );
}

export default UserPersonalPageDetailsList;

import "./styles/NavDesiredListBtn.css"
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import desiredListIcon from "../assets/favorite.svg";
import { USER_DESIRED_LIST_ROUTE } from "../utils/consts";

const NavDesiredListBtn = () => {
  return (
    <NavIconBtn 
      src={desiredListIcon} 
      alt="Desired list"
      isLink="true" 
      route={USER_DESIRED_LIST_ROUTE}
      aria-label="Your desired list"
      className="desired-list-btn"
    />
  );
}

export default NavDesiredListBtn;

import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import desiredListIcon from "../assets/favorite.svg";
import { DESIRED_LIST_ROUTE } from "../utils/consts";
import "./styles/NavDesiredListBtn.css"

const NavDesiredListBtn = () => {
  return (
    <NavIconBtn src={desiredListIcon} alt="Desired list"
                isLink="true" route={DESIRED_LIST_ROUTE}
                aria-label="Your desired list"
                className="desired-list-btn"
    />
  );
}

export default NavDesiredListBtn;

import cartBtnIcon from "../assets/show-cart-button.svg";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";

const NavCartBtn = () => {

  function onClick() {
    // open cart modal
  }

  return (
    <NavIconBtn src={cartBtnIcon} alt="Product cart" aria-label="Product cart" onClick={onClick} />
  );
}

export default NavCartBtn;

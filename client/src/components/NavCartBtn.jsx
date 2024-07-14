import { useContext } from "react";
import cartBtnIcon from "../assets/show-cart-button.svg";
import setCartModalVisibility from "../utils/setCartModalVisibility";
import NavIconBtn from "./UI/navIconBtn/NavIconBtn";
import { Context } from "../Context";

const NavCartBtn = () => {
  const { app } = useContext(Context);

  function onClick() {
    // open cart modal
    setCartModalVisibility(true, app);
  }

  return (
    <NavIconBtn src={cartBtnIcon} alt="Product cart" aria-label="Product cart" onClick={onClick} />
  );
}

export default NavCartBtn;

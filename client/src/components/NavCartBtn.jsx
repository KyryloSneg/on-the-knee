import cartBtnIcon from "../assets/show-cart-button.svg";

const NavCartBtn = () => {
  return (
    <button className="show-cart-button nav-mini-button" aria-label="Product cart">
      <img src={cartBtnIcon} className="no-select" draggable="false" alt="Product cart" />
    </button>
  );
}

export default NavCartBtn;

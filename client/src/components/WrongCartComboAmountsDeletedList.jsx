import "./styles/WrongCartComboAmountsDeletedList.css";
import WrongCartComboAmountsDeletedListItem from "./WrongCartComboAmountsDeletedListItem";

const WrongCartComboAmountsDeletedList = ({ deletedCartCombos }) => {
  return (
    <ul className="wrong-cart-combo-amounts-deleted-list">
      {deletedCartCombos?.map(combo =>
        <li key={combo.id}>
          <WrongCartComboAmountsDeletedListItem deletedCombo={combo} />
        </li>
      )}
    </ul>
  );
}

export default WrongCartComboAmountsDeletedList;

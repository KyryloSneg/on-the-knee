import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

const UserPersonalAddressesBtnChild = observer(({ isExpanded }) => {
  const { user } = useContext(Context);

  return (
    <div className="user-personal-details-btn-child">
      <h3>Your addresses</h3>
      {!isExpanded && <p>{user.userAddress?.phoneNumber} {user.userAddress?.email}</p>}
    </div>
  );
});

export default UserPersonalAddressesBtnChild;

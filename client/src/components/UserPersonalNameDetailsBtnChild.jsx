import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext } from 'react';

const UserPersonalNameDetailsBtnChild = observer(({ isExpanded }) => {
  const { user } = useContext(Context);

  return (
    <div className="user-personal-details-btn-child">
      <h3>Your name</h3>
      {!isExpanded && <p>{user.user?.name} {user.user?.surname}</p>}
    </div>
  );
});

export default UserPersonalNameDetailsBtnChild;

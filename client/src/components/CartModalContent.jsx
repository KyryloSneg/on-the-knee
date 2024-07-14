import { useContext } from 'react';
import { Context } from '../Context';
import useGettingCartData from '../hooks/useGettingCartData';
import { observer } from 'mobx-react-lite';

const CartModalContent = observer(({ closeModal }) => {
  const { user } = useContext(Context);
  useGettingCartData(user.cart?.id, null, user);

  if (!user.cart) return <div />;

  return (
    <div>
      {user.cartDeviceCombinations.map(combo => <p key={combo.id}>{combo.device.name}</p>)}
    </div>
  );
});

export default CartModalContent;

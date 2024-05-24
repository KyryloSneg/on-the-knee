import { useContext } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import SelectUserLocationModalContent from './SelectUserLocationModalContent';
import { observer } from 'mobx-react-lite';
import setSelectUserLocationVisibility from '../utils/setSelectUserLocationModalVisibility';

const SelectUserLocationModal = observer(() => {
  const { app } = useContext(Context);

  function setIsSelectUserLocationVisible(isVisible) {
    setSelectUserLocationVisibility(isVisible, app);
  }

  return (
    <ModalWindow 
      isVisible={app.isVisibleUserLocationModal}
      setIsVisible={setIsSelectUserLocationVisible}
      children={<SelectUserLocationModalContent />}
      headerText="Choose your location"
      id="select-user-location-modal"
    />
  );
});

export default SelectUserLocationModal;

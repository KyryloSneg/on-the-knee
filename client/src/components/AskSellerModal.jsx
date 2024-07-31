import ModalWindow from './UI/modalWindow/ModalWindow';
import CommentModalContent from './CommentModalContent';
import setAskSellerModalVisibility from '../utils/setAskSellerModalVisibility';
import { Context } from '../Context';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';

const AskSellerModal = observer(() => {
  const { app } = useContext(Context);

  function setIsAskSellerModalVisible(isVisible) {
    setAskSellerModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleAskSellerModal}
      setIsVisible={setIsAskSellerModalVisible}
      children={
        <CommentModalContent 
          type="askSeller" 
          closeModal={() => setIsAskSellerModalVisible(false)}
        />
      }
      headerText="Ask a question"
      propsClassName="create-comment-modal"
      id="ask-seller-modal"
      triggerElemRef={app.askSellerModalBtnRef}
    />
  );
});

export default AskSellerModal;

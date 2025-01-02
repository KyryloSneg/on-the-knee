import { Context } from "Context";
import useClosingCategoriesMenuWidth from "hooks/useClosingCategoriesMenuWidth";
import useClosingCategoriesModalWidth from "hooks/useClosingCategoriesModalWidth";
import useClosingFiltersBarEmptyValue from "hooks/useClosingFiltersBarEmptyValue";
import useClosingFiltersSidebarWidth from "hooks/useClosingFiltersSidebarWidth";
import useClosingUsedFiltersBarValue from "hooks/useClosingUsedFiltersBarValue";
import useClosingUsedFiltersBarWidth from "hooks/useClosingUsedFiltersBarWidth";
import useWindowWidth from "hooks/useWindowWidth";
import { observer } from "mobx-react-lite";
import { useCallback, useContext } from 'react';
import setCategoriesModalVisibility from "utils/setCategoriesModalVisibility";
import setFiltersSidebarVisibility from "utils/setFiltersSidebarVisibility";
import setMenuVisibility from "utils/setMenuVisibility";
import setUsedFiltersBarVisibility from "utils/setUsedFiltersBarVisibility";
import Sidebar from "./UI/sidebar/Sidebar";
import Menu from "./Menu";
import FilterCategories from "./FilterCategories";
import UsedFilters from "./UsedFilters";
import CategoriesModalContent from "./CategoriesModalContent";
import SelectUserLocationModal from "./SelectUserLocationModal";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import SelfDeliveryModal from "./SelfDeliveryModal";
import DeviceFeedbackModal from "./DeviceFeedbackModal";
import ReplyModal from "./ReplyModal";
import QuestionCommentModal from "./QuestionCommentModal";
import AnswerModal from "./AnswerModal";
import AskSellerModal from "./AskSellerModal";
import CommentGalleryModal from "./CommentGalleryModal";
import CartModal from "./CartModal";
import ErrorModal from "./ErrorModal";
import WrongCartComboAmountsModal from "./WrongCartComboAmountsModal";
import AuthentificationModal from "./AuthenticationModal";
import ReportOrderProblemModal from "./ReportOrderProblemModal";
import RemainASellerOrDeviceFeedbackModal from "./RemainASellerOrDeviceFeedbackModal";
import UserChangePasswordModal from "./UserChangePasswordModal";

const AppTopLevelModalsAndSidebars = observer(() => {
  const { app, user } = useContext(Context);
  const windowWidth = useWindowWidth();

  const closeFiltersSidebar = useCallback(() => {
    setFiltersSidebarVisibility(false, app)
  }, [app]);

  const closeUsedFiltersSidebar = useCallback(() => {
    setUsedFiltersBarVisibility(false, app);
  }, [app]);

  function setIsCategoriesModalVisible(isVisible) {
    setCategoriesModalVisibility(isVisible, app);
  }

  function closeMenuSidebar() {
    setMenuVisibility(false, app);
  }

  useClosingFiltersSidebarWidth(windowWidth, app.isVisibleFiltersSidebar, closeFiltersSidebar);
  useClosingUsedFiltersBarWidth(windowWidth, app.isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar);
  useClosingCategoriesMenuWidth(windowWidth, app.isVisibleCategoriesMenu, app);
  useClosingCategoriesModalWidth(windowWidth, app.isVisibleCategoriesModal, app);

  useClosingFiltersBarEmptyValue(
    app.filtersRelatedSidebarsStoreToUse?.filters, app.isVisibleFiltersSidebar, closeFiltersSidebar
  );
  
  useClosingUsedFiltersBarValue(
    app.filtersRelatedSidebarsStoreToUse?.usedFilters, app.isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar
  );

  return (
    <>
      {app.isVisibleMenu &&
        <Sidebar
          children={<Menu />}
          closeSidebar={closeMenuSidebar}
          shortcutRef={app.menuShortcutRef}
          headerText="Menu"
          id="menu-sidebar"
        />
      }
      {app.isVisibleFiltersSidebar &&
        <Sidebar
          children={
            <FilterCategories 
              storeToUse={app.filtersRelatedSidebarsStoreToUse} 
              areInitiallyVisible={false} 
              isSidebarVersion={true} 
            />
          }
          closeSidebar={closeFiltersSidebar}
          shortcutRef={app.filtersShortcutRef}
          headerText="Filters"
          id="filter-categories-sidebar"
        />
      }
      {app.isVisibleUsedFiltersSidebar &&
        <Sidebar
          children={<UsedFilters storeToUse={app.filtersRelatedSidebarsStoreToUse} isSidebarVersion={true} />}
          closeSidebar={closeUsedFiltersSidebar}
          shortcutRef={app.usedFiltersShortcutRef}
          headerText="Used filters"
          id="used-filters-sidebar"
        />
      }
      {app.isVisibleCategoriesModal &&
        <ModalWindow
          isVisible={app.isVisibleCategoriesModal} 
          setIsVisible={setIsCategoriesModalVisible}
          children={<CategoriesModalContent />}
          headerText="Categories"
          id="categories-modal"
          triggerElemRef={app.menuCategoriesBtnRef}
        />
      }
      {app.isVisibleUserLocationModal && <SelectUserLocationModal />}
      {app.isVisibleSelfDeliveryModal && <SelfDeliveryModal />}
      {app.isVisibleDeviceFeedbackModal && <DeviceFeedbackModal />}
      {app.isVisibleReplyModal && <ReplyModal />}
      {app.isVisibleQuestionCommentModal && <QuestionCommentModal />}
      {app.isVisibleAnswerModal && <AnswerModal />}
      {app.isVisibleAskSellerModal && <AskSellerModal />}
      {app.isVisibleCommentGalleryModal && <CommentGalleryModal />}
      {app.isVisibleCartModal && <CartModal />}
      {app.isVisibleErrorModal && <ErrorModal />}
      {app.isVisibleWrongCartComboAmountsModal && <WrongCartComboAmountsModal />}
      {app.isVisibleAuthentificationModal && <AuthentificationModal />}
      {(app.isVisibleReportOrderProblemModal && user.isAuth) && <ReportOrderProblemModal />}
      {(app.isVisibleRemainSellerDeviceFeedbackModal && user.isAuth) && <RemainASellerOrDeviceFeedbackModal />}
      {(app.isVisibleUserChangePasswordModal && user.isAuth) && <UserChangePasswordModal />}
    </>
  );
});

export default AppTopLevelModalsAndSidebars;

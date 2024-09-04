import { makeAutoObservable } from "mobx";

class AppStore {
  constructor() {
    this._darkBgVisible = false;
    this._isBlockedScroll = false;
    this._isGlobalLoading = false;
    this._isCartModalLoading = false;
    this._modalVisible = false;

    this._isVisibleMenu = false;
    this._isVisibleFiltersSidebar = false;
    this._isVisibleUsedFiltersSidebar = false;
    this._isVisibleCategoriesMenu = false;
    this._isVisibleCategoriesModal = false;
    this._isVisibleUserLocationModal = false;
    this._isVisibleSelfDeliveryModal = false;
    this._isVisibleDeviceFeedbackModal = false;
    this._isVisibleReplyModal = false;
    this._isVisibleQuestionCommentModal = false;
    this._isVisibleAnswerModal = false;
    this._isVisibleAskSellerModal = false;
    this._isVisibleCommentGalleryModal = false;
    this._isVisibleCartModal = false;
    this._isFocusedSearchForm = false;

    // contains the last element's ref from which was opened a modal window, a sidebar etc.
    this._lastWindowBtnRef = null;
    // using this to prevent redundant setting of lastWindowBtnRef state
    // (useful in reply modal opened from comment gallery one for example)
    this._isToSetLastBtnRefInCurrWindow = true;

    this._hintSearchResults = []
    // some important app refs below are used to skip a big amount of props passing
    // or to use in modals / sidebars etc.
    this._pageRef = null;
    this._deviceSectionRef = null;
    this._filtersAsideRef = null;
    this._headerRef = null;

    this._menuShortcutRef = null;
    this._menuCategoriesBtnRef = null;

    this._filtersShortcutRef = null;
    this._usedFiltersShortcutRef = null;
    this._navBtnGroupRef = null;

    this._userLocationBtnRef = null;
    this._selfDeliveryModalBtnRef = null;
    this._cartModalBtnRef = null;
    
    this._commentGalleryModalBtnRef = null;
    this._answerModalBtnRef = null;
    this._deviceFeedbackModalBtnRef = null;
    this._questionCommentModalBtnRef = null;
    this._replyModalBtnRef = null;
    this._askSellerModalBtnRef = null;

    this._userLocation = null;
    this._allLocations = [];
    this._isToShowUserLocationNotification = false;
    this._isUserLocationDeterminedCorrectly = true;

    // we use these states in modals that are related to the info below
    this._commentGalleryModalType = "deviceFeedbacks";
    this._commentGallerySelectedImageId = null;

    this._storePickupPoints = [];
    this._selectedStorePickupPointIdValues = {};
    this._deliveries = [];
    this._selectedDeliveryIdValues = {};

    this._isToShowDeliveryChangeMessageValues = {};
    this._isToShowDeliverySectionRadiogroup = false;

    // states that are used to handle multiple delivery sections in the checkout page
    this._hasElevatorValues = {};
    this._isToLiftOnTheFloorValues = {};
    this._selectedCourierScheduleIdValues = {};
    this._selectedCourierScheduleShiftValues = {};
    this._receiventPhoneInputsValues = {};

    // i think we should support non-checkout-page's self delivery modals, because we could possibly use them in the future 
    this._selfDeliveryModalType = "default";
    this._selfDeliveryModalDefaultSelectedPointId = null;
    this._selfDeliveryModalSelectedPointValueId = null;
    this._selfDeliveryModalOnSelectCb = null;

    this._isToShowAsideDeliveryPrice = false;

    makeAutoObservable(this);
  }

  setDarkBgVisible(bool) {
    this._darkBgVisible = bool;
  }

  setIsBlockedScroll(bool) {
    this._isBlockedScroll = bool;
  }

  setIsGlobalLoading(bool) {
    this._isGlobalLoading = bool;
  }

  setIsCartModalLoading(bool) {
    this._isCartModalLoading = bool;
  }

  setModalVisible(bool) {
    this._modalVisible = bool;
  }

  setIsVisibleFiltersSidebar(bool) {
    this._isVisibleFiltersSidebar = bool;
  }

  setIsVisibleMenu(bool) {
    this._isVisibleMenu = bool;
  }

  setIsVisibleUsedFiltersSidebar(bool) {
    this._isVisibleUsedFiltersSidebar = bool;
  }

  setIsVisibleCategoriesMenu(bool) {
    this._isVisibleCategoriesMenu = bool;
  }

  setIsVisibleCategoriesModal(bool) {
    this._isVisibleCategoriesModal = bool;
  }

  setIsVisibleUserLocationModal(bool) {
    this._isVisibleUserLocationModal = bool;
  }

  setIsVisibleSelfDeliveryModal(bool) {
    this._isVisibleSelfDeliveryModal = bool;
  }

  setIsVisibleDeviceFeedbackModal(bool) {
    this._isVisibleDeviceFeedbackModal = bool;
  }

  setIsVisibleReplyModal(bool) {
    this._isVisibleReplyModal = bool;
  }

  setIsVisibleQuestionCommentModal(bool) {
    this._isVisibleQuestionCommentModal = bool;
  }

  setIsVisibleAnswerModal(bool) {
    this._isVisibleAnswerModal = bool;
  }

  setIsVisibleAskSellerModal(bool) {
    this._isVisibleAskSellerModal = bool;
  }

  setIsVisibleCommentGalleryModal(bool) {
    this._isVisibleCommentGalleryModal = bool;
  }

  setIsVisibleCartModal(bool) {
    this._isVisibleCartModal = bool;
  }

  setIsFocusedSearchForm(bool) {
    this._isFocusedSearchForm = bool;
  }

  setLastWindowBtnRef(bool) {
    this._lastWindowBtnRef = bool;
  }

  setIsToSetLastBtnRefInCurrWindow(bool) {
    this._isToSetLastBtnRefInCurrWindow = bool;
  }

  setPageRef(ref) {
    this._pageRef = ref;
  }

  setDeviceSectionRef(ref) {
    this._deviceSectionRef = ref;
  }

  setFiltersAsideRef(ref) {
    this._filtersAsideRef = ref;
  }

  setHeaderRef(ref) {
    this._headerRef = ref;
  }

  setMenuShortcutRef(ref) {
    this._menuShortcutRef = ref;
  }

  setMenuCategoriesBtnRef(ref) {
    this._menuCategoriesBtnRef = ref;
  }

  setFiltersShortcutRef(ref) {
    this._filtersShortcutRef = ref;
  }

  setUsedFiltersShortcutRef(ref) {
    this._usedFiltersShortcutRef = ref;
  }

  setNavBtnGroupRef(ref) {
    this._navBtnGroupRef = ref;
  }

  setUserLocationBtnRef(ref) {
    this._userLocationBtnRef = ref;
  }

  setSelfDeliveryModalBtnRef(ref) {
    this._selfDeliveryModalBtnRef = ref;
  }

  setCartModalBtnRef(ref) {
    this._cartModalBtnRef = ref;
  }

  setCommentGalleryModalBtnRef(ref) {
    this._commentGalleryModalBtnRef = ref;
  }

  setAnswerModalBtnRef(ref) {
    this._answerModalBtnRef = ref;
  }

  setDeviceFeedbackModalBtnRef(ref) {
    this._deviceFeedbackModalBtnRef = ref;
  }

  setQuestionCommentModalBtnRef(ref) {
    this._questionCommentModalBtnRef = ref;
  }

  setReplyModalBtnRef(ref) {
    this._replyModalBtnRef = ref;
  }

  setAskSellerModalBtnRef(ref) {
    this._askSellerModalBtnRef = ref;
  }

  setHintSearchResults(results) {
    this._hintSearchResults = results;
  }

  setUserLocation(userLocation) {
    this._userLocation = userLocation;
  }
  
  setAllLocations(allLocations) {
    this._allLocations = allLocations;
  }

  setIsToShowUserLocationNotification(isToShowUserLocationNotification) {
    this._isToShowUserLocationNotification = isToShowUserLocationNotification;
  }

  setIsUserLocationDeterminedCorrectly(isUserLocationDeterminedCorrectly) {
    this._isUserLocationDeterminedCorrectly = isUserLocationDeterminedCorrectly;
  }

  setCommentGalleryModalType(commentGalleryModalType) {
    this._commentGalleryModalType = commentGalleryModalType;
  }

  setCommentGallerySelectedImageId(commentGallerySelectedImageId) {
    this._commentGallerySelectedImageId = commentGallerySelectedImageId;
  }

  setStorePickupPoints(storePickupPoints) {
    this._storePickupPoints = storePickupPoints;
  }

  setSelectedStorePickupPointIdValues(selectedStorePickupPointIdValues) {
    this._selectedStorePickupPointIdValues = selectedStorePickupPointIdValues;
  }
  
  setDeliveries(deliveries) {
    this._deliveries = deliveries;
  }

  setSelectedDeliveryIdValues(selectedDeliveryIdValues) {
    this._selectedDeliveryIdValues = selectedDeliveryIdValues;
  }

  setIsToShowDeliveryChangeMessageValues(isToShowDeliveryChangeMessageValues) {
    this._isToShowDeliveryChangeMessageValues = isToShowDeliveryChangeMessageValues;
  }

  setIsToShowDeliverySectionRadiogroup(isToShowDeliverySectionRadiogroup) {
    this._isToShowDeliverySectionRadiogroup = isToShowDeliverySectionRadiogroup;
  }

  setHasElevatorValues(hasElevatorValues) {
    this._hasElevatorValues = hasElevatorValues;
  }

  setIsToLiftOnTheFloorValues(isToLiftOnTheFloorValues) {
    this._isToLiftOnTheFloorValues = isToLiftOnTheFloorValues;
  }

  setSelectedCourierScheduleIdValues(selectedCourierScheduleIdValues) {
    this._selectedCourierScheduleIdValues = selectedCourierScheduleIdValues;
  }

  setSelectedCourierScheduleShiftValues(selectedCourierScheduleShiftValues) {
    this._selectedCourierScheduleShiftValues = selectedCourierScheduleShiftValues;
  }

  setReceiventPhoneInputsValues(receiventPhoneInputsValues) {
    this._receiventPhoneInputsValues = receiventPhoneInputsValues;
  }

  setSelfDeliveryModalType(selfDeliveryModalType) {
    this._selfDeliveryModalType = selfDeliveryModalType;
  }

  setSelfDeliveryModalDefaultSelectedPointId(selfDeliveryModalDefaultSelectedPointId) {
    this._selfDeliveryModalDefaultSelectedPointId = selfDeliveryModalDefaultSelectedPointId;
  }

  setSelfDeliveryModalSelectedPointValueId(selfDeliveryModalSelectedPointValueId) {
    this._selfDeliveryModalSelectedPointValueId = selfDeliveryModalSelectedPointValueId;
  }

  setSelfDeliveryModalOnSelectCb(selfDeliveryModalOnSelectCb) {
    this._selfDeliveryModalOnSelectCb = selfDeliveryModalOnSelectCb;
  }
  
  setIsToShowAsideDeliveryPrice(isToShowAsideDeliveryPrice) {
    this._isToShowAsideDeliveryPrice = isToShowAsideDeliveryPrice;
  }

  get darkBgVisible() {
    return this._darkBgVisible;
  }

  get isBlockedScroll() {
    return this._isBlockedScroll;
  }

  get isGlobalLoading() {
    return this._isGlobalLoading;
  }

  get isCartModalLoading() {
    return this._isCartModalLoading;
  }

  get modalVisible() {
    return this._modalVisible;
  }

  get isVisibleMenu() {
    return this._isVisibleMenu;
  }

  get isVisibleFiltersSidebar() {
    return this._isVisibleFiltersSidebar;
  }

  get isVisibleUsedFiltersSidebar() {
    return this._isVisibleUsedFiltersSidebar;
  }

  get isVisibleCategoriesMenu() {
    return this._isVisibleCategoriesMenu;
  }

  get isVisibleCategoriesModal() {
    return this._isVisibleCategoriesModal;
  }

  get isVisibleUserLocationModal() {
    return this._isVisibleUserLocationModal;
  }

  get isVisibleSelfDeliveryModal() {
    return this._isVisibleSelfDeliveryModal;
  }

  get isVisibleDeviceFeedbackModal() {
    return this._isVisibleDeviceFeedbackModal;
  }

  get isVisibleReplyModal() {
    return this._isVisibleReplyModal;
  }

  get isVisibleQuestionCommentModal() {
    return this._isVisibleQuestionCommentModal;
  }

  get isVisibleAnswerModal() {
    return this._isVisibleAnswerModal;
  }

  get isVisibleAskSellerModal() {
    return this._isVisibleAskSellerModal;
  }

  get isVisibleCommentGalleryModal() {
    return this._isVisibleCommentGalleryModal;
  }

  get isVisibleCartModal() {
    return this._isVisibleCartModal;
  }

  get isFocusedSearchForm() {
    return this._isFocusedSearchForm;
  }
  
  get lastWindowBtnRef() {
    return this._lastWindowBtnRef;
  }

  get isToSetLastBtnRefInCurrWindow() {
    return this._isToSetLastBtnRefInCurrWindow;
  }
  
  get pageRef() {
    return this._pageRef;
  }

  get deviceSectionRef() {
    return this._deviceSectionRef;
  }

  get filtersAsideRef() {
    return this._filtersAsideRef;
  }

  get headerRef() {
    return this._headerRef;
  }

  get menuShortcutRef() {
    return this._menuShortcutRef;
  }

  get menuCategoriesBtnRef() {
    return this._menuCategoriesBtnRef;
  }

  get filtersShortcutRef() {
    return this._filtersShortcutRef;
  }

  get usedFiltersShortcutRef() {
    return this._usedFiltersShortcutRef;
  }

  get navBtnGroupRef() {
    return this._navBtnGroupRef;
  }

  get userLocationBtnRef() {
    return this._userLocationBtnRef;
  }

  get selfDeliveryModalBtnRef() {
    return this._selfDeliveryModalBtnRef;
  }

  get cartModalBtnRef() {
    return this._cartModalBtnRef;
  }

  get commentGalleryModalBtnRef() {
    return this._commentGalleryModalBtnRef;
  }

  get answerModalBtnRef() {
    return this._answerModalBtnRef;
  }

  get deviceFeedbackModalBtnRef() {
    return this._deviceFeedbackModalBtnRef;
  }

  get questionCommentModalBtnRef() {
    return this._questionCommentModalBtnRef;
  }

  get replyModalBtnRef() {
    return this._replyModalBtnRef;
  }

  get askSellerModalBtnRef() {
    return this._askSellerModalBtnRef;
  }

  get hintSearchResults() {
    return this._hintSearchResults;
  }

  get userLocation() {
    return this._userLocation;
  }

  get allLocations() {
    return this._allLocations;
  }

  get isToShowUserLocationNotification() {
    return this._isToShowUserLocationNotification;
  }

  get isUserLocationDeterminedCorrectly() {
    return this._isUserLocationDeterminedCorrectly;
  }

  get commentGalleryModalType() {
    return this._commentGalleryModalType;
  }

  get commentGallerySelectedImageId() {
    return this._commentGallerySelectedImageId;
  }

  get storePickupPoints() {
    return this._storePickupPoints;
  }

  get selectedStorePickupPointIdValues() {
    return this._selectedStorePickupPointIdValues;
  }

  get deliveries() {
    return this._deliveries;
  }

  get selectedDeliveryIdValues() {
    return this._selectedDeliveryIdValues;
  }

  get isToShowDeliveryChangeMessageValues() {
    return this._isToShowDeliveryChangeMessageValues;
  }

  get isToShowDeliverySectionRadiogroup() {
    return this._isToShowDeliverySectionRadiogroup;
  }

  get hasElevatorValues() {
    return this._hasElevatorValues;
  }

  get isToLiftOnTheFloorValues() {
    return this._isToLiftOnTheFloorValues;
  }

  get selectedCourierScheduleIdValues() {
    return this._selectedCourierScheduleIdValues;
  }

  get selectedCourierScheduleShiftValues() {
    return this._selectedCourierScheduleShiftValues;
  }

  get receiventPhoneInputsValues() {
    return this._receiventPhoneInputsValues;
  }

  get selfDeliveryModalType() {
    return this._selfDeliveryModalType;
  }

  get selfDeliveryModalDefaultSelectedPointId() {
    return this._selfDeliveryModalDefaultSelectedPointId;
  }

  get selfDeliveryModalSelectedPointValueId() {
    return this._selfDeliveryModalSelectedPointValueId;
  }

  get selfDeliveryModalOnSelectCb() {
    return this._selfDeliveryModalOnSelectCb;
  }

  get isToShowAsideDeliveryPrice() {
    return this._isToShowAsideDeliveryPrice;
  }

}

export default AppStore;
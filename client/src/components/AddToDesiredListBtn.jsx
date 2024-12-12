import "./styles/AddToDesiredListBtn.css";
import { observer } from "mobx-react-lite";
import desiredListIcon from "../assets/favorite_24x24_7373ff.svg";
import desiredListFilledIcon from "../assets/favorite_filled_24x24_7373ff.svg";
import { useCallback, useContext, useRef, useState } from "react";
import { Context } from "../Context";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";
import { createDesiredListDevice, deleteDesiredListDevice, getOneDesiredListDevices } from "../http/DesiredListAPI";
import { v4 } from "uuid";
import Loader from "./UI/loader/Loader";
import deleteFetchWithTryCatch from "utils/deleteFetchWithTryCatch";

const AddToDesiredListBtn = observer(({ deviceId, deviceCombinationId }) => {
  const { app, user } = useContext(Context);
  const btnRef = useRef(null);
  const isAlreadyAddingRemovingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const addDeleteDesiredListDev = useCallback(async () => {
    if (isAlreadyAddingRemovingRef.current) return;

    isAlreadyAddingRemovingRef.current = true;
    // (a similar example here: https://github.com/facebook/react/issues/30605)
    // we can use setters of isLoading here that invoke 2 sequential re-renders instead of 1,
    // because of how react batching handles both async and sync operations in the same function:
    
    // let's call a stack of state updates that goes one after each other a BATCH STACK
    setIsLoading(true); // BATCH STACK: [setIsLoading(true)]

    try {
      if (deviceId === null || deviceId === undefined) throw new Error("deviceId can't be null or undefined");
      if (deviceCombinationId === null || deviceCombinationId === undefined) {
        throw new Error("deviceCombinationId can't be null or undefined");
      };

      const existingDesiredListDev =
        user.desiredListDevices?.find(listDevice => listDevice["device-combinationId"] === deviceCombinationId);

      // after the first async operation the BATCH STACK is empty and invokes a re-render
      if (existingDesiredListDev) {
        await deleteFetchWithTryCatch(async () => await deleteDesiredListDevice(existingDesiredListDev.id));
      } else {
        const desiredListCombo = {
          "id": v4(),
          "desired-listId": user.desiredList.id,
          "deviceId": deviceId,
          "device-combinationId": deviceCombinationId,
          "date": (new Date()).toISOString(),
        };

        await createDesiredListDevice(desiredListCombo);
      }

      const updatedListDevices = await getOneDesiredListDevices(user.desiredList?.id);
      user.setDesiredListDevices(updatedListDevices);
    } catch (e) {
      console.log(e.message);
    } finally {
      isAlreadyAddingRemovingRef.current = false;
      setIsLoading(false); // BATCH STACK: [setIsLoading(false)]
      // after the function end BATCH STACK is empty and invokes a re-render
    }
  }, [user, isAlreadyAddingRemovingRef, deviceId, deviceCombinationId])

  function onBtnClick() {
    if (!user.isAuth) {
      app.setAuthentificationModalBtnRef(btnRef);
      setAuthentificationModalVisibility(true, app);
    }

    addDeleteDesiredListDev();
  }

  const isAdded = !!user.desiredListDevices?.find(listDevice => {
    return listDevice["device-combinationId"] === deviceCombinationId
  });

  // i didn't set aria-label here because of the alt attribute of the img inside the btn
  return (
    <button className="add-to-desired-list" onClick={onBtnClick} ref={btnRef}>
      {isLoading
        ? <Loader className="add-to-desired-list-loader" />
        : (
          <img
            src={isAdded ? desiredListFilledIcon : desiredListIcon}
            alt={isAdded ? "Remove from desired list" : "Add to desired list"}
            draggable="false"
          />
        )
      }
    </button>
  );
});

export default AddToDesiredListBtn;

import "./styles/HeaderSendActivationEmail.css";
import { Context } from "Context";
import useLodashThrottle from "hooks/useLodashThrottle";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import UIButton from "./UI/uiButton/UIButton";

const BTN_DELAY_TIME = 60000;

const HeaderSendActivationEmail = observer(() => {
  const { user } = useContext(Context);

  const [error, setError] = useState("");
  const [remainedTime, setRemainedTime] = useState(0);
  const remainedTimeRef = useRef(remainedTime);

  const [isLoading, setIsLoading] = useState(false);
  const isAlreadySendingRef = useRef(null);

  // using ref to use it later in the clickCb
  // (because if we add remainedTime state there, there's no sense in the throttle)
  useEffect(() => {
    remainedTimeRef.current = remainedTime;
  }, [remainedTime]);

  const clickCb = useCallback(async () => {
    if (remainedTimeRef.current <= 0) {
      if (isAlreadySendingRef.current) return;
      isAlreadySendingRef.current = true;

      setIsLoading(true);

      try {
        const possibleError = await user.sendShortTermActivationEmail();

        setError(possibleError?.response?.data?.message || null);
        setRemainedTime(60);

        const intervalId = setInterval(() => setRemainedTime(currTime => currTime - 1), 1000);
        setTimeout(() => {
          clearInterval(intervalId);
          setRemainedTime(0);
        }, BTN_DELAY_TIME);
      } finally {
        isAlreadySendingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [user]);

  const throttledClickCb = useLodashThrottle(clickCb, 3000, { "trailing": false });
  function onClick() {
    throttledClickCb();
  }

  const isTimer = remainedTime > 0;

  return (
    <div className="header-send-activation-email">
      <UIButton variant="secondary1" onClick={onClick} disabled={isTimer} isLoading={isLoading}>
        {isTimer
          ? `${remainedTime} seconds before sending another one`
          : `Send an email to activate your account`
        }
      </UIButton>
      {error && <p>{error}</p>}
    </div>
  );
});

export default HeaderSendActivationEmail;

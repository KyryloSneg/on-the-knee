import { useEffect } from "react";
import useFetching from "./useFetching";
import { getUser } from "../http/UserAPI";

function useGettingOneUser(userId, setUser, isDto, additionalCondition = true) {
  async function fetchingFunc() {
    const user = await getUser(userId, isDto);
    setUser(user);
  }

  const [fetching] = useFetching(fetchingFunc);

  useEffect(() => {
    if (additionalCondition && (userId !== null && userId !== undefined)) fetching();
  }, [userId, setUser, isDto, additionalCondition, fetching]);

}

export default useGettingOneUser;
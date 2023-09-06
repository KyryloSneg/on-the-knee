import { useEffect } from "react";
import URLActions from "../utils/URLActions";

export default function useInitialDropdownValue(paramKey, paramValue, options, setValue, setSelectedId) {

  useEffect(() => {
    if (paramKey) {
      const decodedParamValue = decodeURIComponent(URLActions.getParamValue(paramKey));
      const option = options.find(opt => opt.value === decodedParamValue);
      const nextValue = option?.title || options[0].title;
      const nextSelectedId=  option?.id || options[0].id;

      setValue(nextValue);
      setSelectedId(nextSelectedId);
    }
  }, [options, paramKey, paramValue, setValue, setSelectedId]);

}
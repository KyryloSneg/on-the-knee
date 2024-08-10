import { useEffect } from "react";
import URLActions from "../utils/URLActions";

export default function useInitialDropdownValue(variant, paramKey, paramValue, options, setValue, setSelectedId, onSelectCb) {

  useEffect(() => {
    if (paramKey && variant === "sorting-filter") {
      const decodedParamValue = decodeURIComponent(URLActions.getParamValue(paramKey));
      const option = options.find(opt => opt.value === decodedParamValue);
      const nextValue = option?.title || options[0]?.title;
      const nextSelectedId=  option?.id || options[0]?.id;

      setValue(nextValue);
      setSelectedId(nextSelectedId);

      if (onSelectCb) onSelectCb(nextSelectedId);
    }
  }, [variant, options, paramKey, paramValue, setValue, setSelectedId, onSelectCb]);

}
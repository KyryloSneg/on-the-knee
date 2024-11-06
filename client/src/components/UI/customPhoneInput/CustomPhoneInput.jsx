import "./CustomPhoneInput.css";
import { PhoneInput } from "react-international-phone";
import { forwardRef, useEffect, useRef } from "react";

const CustomPhoneInput = forwardRef(({ 
  value, onChange, id, defaultCountry = "ua", hideDropdown = false, isInvalid, ...props 
}, ref) => {
  const inputRef = useRef(null);
  const refToUse = ref || inputRef;

  let inputClassName = "";
  if (props.className) {
    inputClassName = props.className;
    delete props.className;
  }

  useEffect(() => {
    // set id using ref
    if (refToUse.current) {
      refToUse.current.id = id;
    };
  }, [refToUse, id]);

  return (
    <PhoneInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      ref={ref}
      className={isInvalid ? "invalid" : ""}
      inputClassName={inputClassName}
      hideDropdown={hideDropdown}
      {...props}
    />
  );
});

export default CustomPhoneInput;

import "./CustomPhoneInput.css";
import { PhoneInput } from "react-international-phone";
import { forwardRef, useEffect, useRef } from "react";

const CustomPhoneInput = forwardRef(({ value, onChange, id, defaultCountry = "ua", ...props }, ref) => {
  const inputRef = useRef(null);
  const refToUse = ref || inputRef;

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
      {...props}
    />
  );
});

export default CustomPhoneInput;

import "./ReactHookFormTextarea.css";
import { forwardRef } from "react";

const ReactHookFormTextarea = forwardRef(({ 
  labelText, textareaName, errors, registerFnResult, 
  autoComplete = "off", isDisabled = false, isErrorCondition = null, 
  isToRenderErrorMsg = true, onChangeCaptureCb = null, ...props 
}, ref) => {
  const isInvalid = isErrorCondition ? !!isErrorCondition : !!errors[textareaName];

  let textareaClassName = isInvalid ? "invalid" : "";
  if (props.className) {
    textareaClassName += ` ${props.className}`;
    delete props.className;
  }

  return (
    <div className="react-hook-form-textarea">
      <label>
        {labelText}
        <textarea 
          autoComplete={autoComplete}
          disabled={isDisabled}
          className={textareaClassName} 
          aria-invalid={isInvalid}
          onChangeCapture={(e) => onChangeCaptureCb?.(e)}
          {...registerFnResult} 
          ref={(e) => {
            registerFnResult?.ref?.(e);
            if (ref?.current) ref.current = e;
          }}
          {...props}
        />
      </label>
      {(isInvalid && isToRenderErrorMsg) &&
        <p className="react-hook-form-textarea-error-msg" role="alert" aria-live="polite">
          {errors[textareaName]?.message || "Error!"}
        </p>
      }
    </div>
  );
})

export default ReactHookFormTextarea;

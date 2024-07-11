import "./FilePicker.css";
import UIButton from "../uiButton/UIButton";
import { useRef } from "react";

// if we use our own handle change, don't pass setFiles
// if we set isMultiple = false, do not pass files
const FilePicker = ({ files, setFiles, isMultiple = true, propsHandleChange = null, accept = ".png,.jpg,.gif" }) => {
  const inputFileRef = useRef(null);

  function handleChange(e) {
    if (propsHandleChange) {
      propsHandleChange(e);
      return;
    }

    // allFiles could be null || [File]
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (isMultiple) {
      setFiles(files.push(selectedFiles[0]));
    } else {
      setFiles(selectedFiles[0]);
    }
  }

  return (
    <div className="file-picker-btn-wrapper">
      <input
        type="file"
        className="visually-hidden"
        onChange={handleChange}
        accept={accept}
        multiple={isMultiple}
        ref={inputFileRef}
      />
      <UIButton
        variant="primary3"
        className="file-picker-btn"
        type="button"
        onClick={() => inputFileRef.current?.click()}
      >
        Pick a file
      </UIButton>
    </div>
  );
}

export default FilePicker;

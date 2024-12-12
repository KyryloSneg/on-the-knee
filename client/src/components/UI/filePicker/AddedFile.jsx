import "./AddedFile.css";
import _ from "lodash";
import fileIcon from "../../../assets/file_24x24_434343.svg";
import trashCanIcon from "../../../assets/delete_24x24_434343.svg";
import refreshIcon from "../../../assets/refresh_24x24_434343.svg";

const AddedFile = ({ file, filesArray, setFiles, isImage, isDisabled, setIsTooManyFilesError = null }) => {
  const fileIndex = filesArray.indexOf(file);

  function deleteFile() {
    if (isDisabled) return;

    let nextFiles = filesArray.filter(fileItem => fileItem !== file);
    setFiles(nextFiles);

    setIsTooManyFilesError?.(false);
  }

  function rotateFile() {
    if (isDisabled) return;

    let nextFiles = _.cloneDeep(filesArray);
    // 0 => 90 => 180 => 270 => 0 ...
    let nextRotateDegrees = 0;
    if (file.rotateDegrees !== 270) {
      nextRotateDegrees = file.rotateDegrees + 90;
    }

    nextFiles[fileIndex] = {
      ...file,
      rotateDegrees: nextRotateDegrees
    };

    setFiles(nextFiles);
  }

  const fileObj = isImage ? file.fileObj : file;

  let src = "#";
  try {
    // fileObj could be base64 format file sometimes
    // (for example, when using file picker in the editing user comment)
    src = isImage ? URL.createObjectURL(fileObj) : fileIcon;
  } catch (e) {
    src = isImage ? fileObj : fileIcon;
  }

  return (
    <div className="added-file">
      <div className="added-file-img-p">
        <img 
          src={src} 
          alt="" 
          draggable="false" 
          style={isImage ? { transform: `rotate(${file.rotateDegrees}deg)` } : {}} 
        />
        {!isImage && <p>{fileObj.name}</p>}
      </div>
      <div className="added-file-btn-group">
        <button type="button" onClick={deleteFile} aria-label="Delete image" disabled={isDisabled}>
          <img src={trashCanIcon} alt="" draggable="false" />
        </button>
        {isImage &&
          <button type="button" onClick={rotateFile} aria-label="Rotate image" disabled={isDisabled}>
            <img src={refreshIcon} alt="" draggable="false" />
          </button>
        }
      </div>
    </div>
  );
}

export default AddedFile;

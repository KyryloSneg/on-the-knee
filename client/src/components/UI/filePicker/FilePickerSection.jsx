import "./FilePickerSection.css";
import imageIcon from "../../../assets/image_24x24_434343.svg";
import FilePicker from "./FilePicker";
import { useState } from "react";
import AddedFile from "./AddedFile";
import useDragAndDrop from "../../../hooks/useDragAndDrop";

// the formats below we change from key to value (jpg we change to jpeg for instance)
// there are more formats like this one (but i have no need in implementing them rn)
const SPECIAL_FORMATS = { ".jpg": ".jpeg" };
const MAX_FILES_AMOUNT = 10;
const MAX_FILE_SIZE_BYTES = 5000000;

// IMPORTANT:

// MIMEType === "image"
//   ? [
//       {
//         fileObj: File,
//         rotateDegrees: 0
//       },
//       ...
//     ]
//   : [File];

// files can be a single file, not an array
const FilePickerSection = ({ 
  files, setFiles, isMultiple = true, accept = ".png,.jpg,.gif", 
  MIMEType = "image", isDisabled = false 
}) => {
  const [isFileError, setIsFileError] = useState(false);
  const [isTooManyFilesError, setIsTooManyFilesError] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const { onDragEnter, onDragLeave, onDragOver, onDrop } = useDragAndDrop(handleChange, isDragged, setIsDragged);
  const isImage = MIMEType === "image";

  function handleChange(e) {
    // allFiles could be null || [null] || [File]
    const selectedFiles = e.target.files || [...e.dataTransfer.files];
    if (!selectedFiles) return;
    if (selectedFiles[0] === null) return;

    const file = selectedFiles[0];
    if (!file) return;

    let isSupportedFormat = supportedMIMEFormats.includes(file.type);
    if (!isSupportedFormat) {
      // checking does accept prop include image/* format or other ones like this
      const formatType = file.type.split("/")[0];
      isSupportedFormat = accept.includes(`${formatType}/*`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES
      || !isSupportedFormat
    ) {
      if (!isFileError) setIsFileError(true);
      return;
    } else {
      if (isFileError) setIsFileError(false);
    };

    let nextFile = file;
    if (isImage) {
      nextFile = {
        fileObj: file,
        rotateDegrees: 0
      }
    }

    if (isMultiple) {
      let nextFiles = [...files, nextFile];
      if (nextFiles.length > MAX_FILES_AMOUNT) {
        setIsTooManyFilesError(true);
      } else {
        setIsTooManyFilesError(false);
        setFiles(nextFiles);
      }
    } else {
      setFiles(nextFile);
    }
  }

  let sectionClassName = "file-picker-section";
  if (isDragged) {
    sectionClassName += " dragged";
  }

  // image/* => image; .png => .png
  const supportedFormatsArray = accept.split(",").map(
    format => format.endsWith("/*") ? format.slice(0, format.length - 2) : format
  );
  const supportedFormatsInText = supportedFormatsArray.join(", ");
  // format.includes("/") means "is MIME type" (with the condition we can pass MIME types into accept prop)
  // .slice(1) deletes redundant for MIME type dot

  let supportedMIMEFormats = supportedFormatsArray.filter(format => !format.endsWith("/*"));
  supportedMIMEFormats = supportedFormatsArray.map(format => {
    const formatWithoutDot = format.slice(1);
    const formatInResult = SPECIAL_FORMATS[format]?.slice(1) || formatWithoutDot;

    const isMIME = format.includes("/");
    return isMIME ? format : `${MIMEType}/${formatInResult}`;
  });

  const wordIs = supportedFormatsArray.length > 1 ? "are" : "is";
  const formatWord = supportedFormatsArray.length > 1 ? "formats" : "format";

  let additionalInfoText;
  if (isMultiple) {
    // (size in bytes / 1000000) === (size in MB)
    additionalInfoText =
      `
        Drag file here or click the button. 
        Add up to ${MAX_FILES_AMOUNT} files in ${supportedFormatsInText} ${formatWord}, 
        maximum ${MAX_FILE_SIZE_BYTES / 1000000}MB size per each
      `;
  } else {
    additionalInfoText =
      `
        Drag file here or click the button. 
        ${formatWord} ${supportedFormatsInText} ${wordIs} supported,
        maximum ${MAX_FILE_SIZE_BYTES / 1000000}MB size
      `;
  }

  const sectionHandlers = isDisabled
    ? {}
    : {onDragEnter, onDragLeave, onDragOver, onDrop};

  return (
    <section 
      className={sectionClassName}
      {...sectionHandlers}
    >
      <div className="file-picker-section-main">
        <div className="file-picker-icon-add-info-wrap">
          <img src={imageIcon} alt="" draggable="false" />
          <div className="file-picker-additional-info">
            <h3>Add {isMultiple ? "files" : "file"}</h3>
            <p>{additionalInfoText}</p>
            {isFileError &&
              <p className="file-picker-error-msg" aria-live="polite">
                The file is too big or its format isn't supported
              </p>
            }
            {isTooManyFilesError &&
              <p className="file-picker-error-msg" aria-live="polite">
                Delete one of the files to add a new one
              </p>
            }
          </div>
        </div>
        <FilePicker
          propsHandleChange={handleChange}
          isMultiple={isMultiple}
          accept={accept}
          isDisabled={isDisabled}
        />
      </div>
      {isMultiple
        ? (
          !!files.length && (
            <ul className="file-picker-section-list">
              {files.map((file, index) =>
                <li key={index}>
                  <AddedFile
                    file={file}
                    filesArray={files}
                    setFiles={setFiles}
                    isImage={isImage}
                    setIsTooManyFilesError={setIsTooManyFilesError}
                  />
                </li>
              )}
            </ul>
          )
        )
        : (
          <AddedFile
            file={files}
            filesArray={files}
            setFiles={setFiles}
            isImage={isImage}
            setIsTooManyFilesError={setIsTooManyFilesError}
          />
        )
      }
    </section>
  );
}

export default FilePickerSection;

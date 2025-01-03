import { useEffect } from "react";

/**
  * hook that is used on each page to set the document's title
  * 
  * @param {string} title
  */
export default function useSettingDocumentTitle(title) {
  useEffect(() => {
    if (typeof title === "string") document.title = title;
  }, [title]);
}
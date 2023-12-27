import { useEffect } from "react";

export default function useClickOnTheDarkBg(func, darkBgVisible) {
  useEffect(() => {
    if (func) {
      function clickHandler(e) {
        if (e.target.id === "app-dark-bg") {
          func();
        }
      }
      
      if (darkBgVisible) {
        document.body.addEventListener("click", clickHandler);
      }    
  
      return () => {
        document.body.removeEventListener("click", clickHandler);
      }
    }
  }, [darkBgVisible, func])
}
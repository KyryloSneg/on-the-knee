import { useOutletContext } from "react-router-dom";

const ErrorPage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const pageRef = useOutletContext();
  
  return (
    <div>
      ErrorPage
    </div>
  );
};

export default ErrorPage;

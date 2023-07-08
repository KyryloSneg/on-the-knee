import { useOutletContext } from "react-router-dom";

const MainPage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const pageRef = useOutletContext();

  return (
    <div>
      MainPage
    </div>
  );
};

export default MainPage;

import { useOutletContext } from "react-router-dom";

const DevicePage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const pageRef = useOutletContext();

  return (
    <div>
      DevicePage
    </div>
  );
};

export default DevicePage;

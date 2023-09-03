import { useOutletContext } from "react-router-dom";

const DesiredListPage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const { pageRef } = useOutletContext();

  return (
    <div>
      DesiredListPage
    </div>
  );
}

export default DesiredListPage;

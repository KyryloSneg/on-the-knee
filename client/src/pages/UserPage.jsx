import { useOutletContext } from "react-router-dom";

const UserPage = () => {
  // temporary ignoring linter
  // eslint-disable-next-line
  const pageRef = useOutletContext();

  return (
    <div>
      UserPage
    </div>
  );
};

export default UserPage;

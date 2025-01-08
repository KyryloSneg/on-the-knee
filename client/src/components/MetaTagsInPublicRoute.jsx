import { Helmet } from "react-helmet";

const MetaTagsInPublicRoute = ({ description, keywords, isToRender = true }) => {
  if (!isToRender) return;

  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="follow,index" />
    </Helmet>
  );
}

export default MetaTagsInPublicRoute;

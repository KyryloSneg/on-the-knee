import { Context } from "Context";
import useCurrentPath from "hooks/useCurrentPath";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { PRIVATE_ROUTES } from "router/routes";
import { META_MAIN_PAGE_DESCRIPTION, META_MAIN_PAGE_KEYWORDS } from "utils/consts";

const MetaTagsInPrivateRoutes = observer(() => {
  const { user } = useContext(Context);
  const currentRoute = useCurrentPath();

  if (!user.isAuth) return;

  const privateRoutePaths = PRIVATE_ROUTES.map(route => route.path);
  const isCurrentRoutePrivate = privateRoutePaths.includes(currentRoute);

  if (!isCurrentRoutePrivate) return;

  return (
    <Helmet>
      <meta
        name="description"
        content={META_MAIN_PAGE_DESCRIPTION}
      />
      <meta name="keywords" content={META_MAIN_PAGE_KEYWORDS} />
      <meta name="robots" content="nofollow,noindex" />
    </Helmet>
  );
});

export default MetaTagsInPrivateRoutes;

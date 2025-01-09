import { Context } from "Context";
import useCurrentPath from "hooks/useCurrentPath";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { PRIVATE_ROUTES } from "router/routes";
import { CHECKOUT_ROUTE, META_MAIN_PAGE_DESCRIPTION, META_MAIN_PAGE_KEYWORDS, SELLER_WRITE_A_FEEDBACK_ROUTE } from "utils/consts";

// some public routes that shouldn't be analyzed by search engines
const ROUTE_EXCEPTIONS = [SELLER_WRITE_A_FEEDBACK_ROUTE, CHECKOUT_ROUTE];

const MetaTagsInPrivateRoutes = observer(() => {
  const { user } = useContext(Context);
  const currentRoute = useCurrentPath();

  const privateRoutePaths = PRIVATE_ROUTES.map(route => route.path);
  const isCurrentRoutePrivate = privateRoutePaths.includes(currentRoute);

  const isCurrentRouteException = ROUTE_EXCEPTIONS.includes(currentRoute);

  if (
    (!isCurrentRoutePrivate && !isCurrentRouteException)
    || (isCurrentRoutePrivate && !user.isAuth)
  ) return;

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

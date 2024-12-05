import "./styles/WriteSellerFeedbackPage.css";
import WriteSellerFeedbackForm from "components/WriteSellerFeedbackForm";
import { Context } from "Context";
import useOneSellerFeedbacksFetching from "hooks/useOneSellerFeedbacksFetching";
import useOneSellerFetching from "hooks/useOneSellerFetching";
import useOrdersListSellersFetching from "hooks/useOrdersListSellersFetching";
import useUpdatingFeedbacksCbs from "hooks/useUpdatingFeedbacksCbs";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import StringActions from "utils/StringActions";

const WriteSellerFeedbackPage = observer(() => {
  const { user } = useContext(Context);
  const { sellerIdSlug } = useParams();
  const [seller, setSeller] = useState(null);

  let [id, slug] = sellerIdSlug.split("--");

  useOneSellerFetching(id, setSeller, true, false);

  const [sellerFeedbacksFetching] = useOneSellerFeedbacksFetching(id, null, true, false);  
  const [userSellersFeedbacksFetching] = useOrdersListSellersFetching(user.orders, null, true, true, true);
  
  const { updateSellerFeedbacksCb } = useUpdatingFeedbacksCbs(
    null, id, false, null, sellerFeedbacksFetching, null, userSellersFeedbacksFetching
  );

  const sellerPlaceHolderName = StringActions.capitalize(StringActions.splitByHyphens(slug));

  return (
    <main className="write-seller-feedback-page">
      <header>
        <h2 className="top-h2">
          Rate {seller?.name || sellerPlaceHolderName}
        </h2>
      </header>
      <WriteSellerFeedbackForm 
        sellerId={id} 
        sellerSlug={slug} 
        updateSellerFeedbacksCb={updateSellerFeedbacksCb}
      />
    </main>
  );
});

export default WriteSellerFeedbackPage;

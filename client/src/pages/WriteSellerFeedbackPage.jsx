import "./styles/WriteSellerFeedbackPage.css";
import WriteSellerFeedbackForm from "components/WriteSellerFeedbackForm";
import useOneSellerFetching from "hooks/useOneSellerFetching";
import { useState } from "react";
import { useParams } from "react-router-dom";
import StringActions from "utils/StringActions";

const WriteSellerFeedbackPage = () => {
  const { sellerIdSlug } = useParams();
  const [seller, setSeller] = useState(null);

  let [id, slug] = sellerIdSlug.split("--");
  id = +id;

  useOneSellerFetching(id, setSeller, false);
  const sellerPlaceHolderName = StringActions.capitalize(StringActions.splitByHyphens(slug));

  return (
    <main className="write-seller-feedback-page">
      <header>
        <h2 className="top-h2">
          Rate {seller?.name || sellerPlaceHolderName}
        </h2>
      </header>
      <WriteSellerFeedbackForm sellerId={id} sellerSlug={slug} />
    </main>
  );
}

export default WriteSellerFeedbackPage;

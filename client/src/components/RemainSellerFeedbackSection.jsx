import RemainSellerFeedbackSectionItem from "./RemainSellerFeedbackSectionItem";

const RemainSellerFeedbackSection = ({ type, sellersFeedbacksObjArray }) => {
  return (
    <section className="remain-dev-feedback-section">
      <header>
        <h3>Rate a seller</h3>
      </header>
      {type === "modal"
        ? <RemainSellerFeedbackSectionItem type={type} sellerFeedbacksObj={sellersFeedbacksObjArray[0]} />
        : (
          <ul className="remain-seller-dev-feedback-list">
            {sellersFeedbacksObjArray?.map(sellerFeedbacksObj => {
              return (
                <li key={sellerFeedbacksObj.seller.id}>
                  <RemainSellerFeedbackSectionItem type={type} sellerFeedbacksObj={sellerFeedbacksObj} />
                </li>
              );
            })}
          </ul>
        )
      }
    </section>
  );
}

export default RemainSellerFeedbackSection;

import "./styles/MainSellerPage.css";

const MainSellerPage = ({ seller, feedbacks }) => {
  if (!seller || !feedbacks?.length) return <div />;

  return (
    <section className="main-seller-page">
      Main seller page
    </section>
  );
}

export default MainSellerPage;

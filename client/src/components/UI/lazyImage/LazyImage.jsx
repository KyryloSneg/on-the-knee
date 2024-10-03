// just an image that exists to be lazy-loaded
const LazyImage = ({ ...props }) => {
  return (
    // eslint-disable-next-line
    <img {...props} />
  );
}

export default LazyImage;

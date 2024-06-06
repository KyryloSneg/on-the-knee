export default function encodeUrl(url) {
  return url.replaceAll("%2C", ",");
}
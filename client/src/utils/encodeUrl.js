export default function encodeUrl(url) {
  return url.replaceAll("%2C", ",").replaceAll("%3B", ";");
}
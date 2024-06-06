function getPreparedForMockServerStr(str) {
  // these symbols are causing error on the mock server (idk about other ones)
  const preparedStr = str
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("?", "")
    .replaceAll("/", "")
    .replaceAll("=", "")
    .replaceAll("[", "")
    .replaceAll("]", "");

  return preparedStr;
}

export default getPreparedForMockServerStr;
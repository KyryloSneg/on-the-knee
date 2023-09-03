export default function findResultId(results, selectedId, type = "next") {
  const resultsArray = [...results.default, ...results.history, ...results.categories];

  let result;
  if (type === "next") {
    result = resultsArray.find(res => res.id > selectedId);
  } else if (type === "previous") {
    result = resultsArray.find(res => res.id < selectedId);
  }

  return result.id;
}
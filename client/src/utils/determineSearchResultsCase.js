export default function determineSearchResultsCase(results) {

  // theCase syntax: "+ - +" means that:
  // - results default and results categories aren't empty (first "+" and second one respectively);
  // - results history are empty ("-");
  let theCase = "- - -";

  if ((results.default.length && results.history.length && results.categories.length)) {
    theCase = "+ + +";
  } else if ((results.default.length && results.categories.length)) {
    theCase = "+ - +";
  } else if (results.history.length && results.categories.length) {
    theCase = "- + +";
  } else if (results.default.length && results.history.length) {
    theCase = "+ + -";
  } else if (results.default.length) {
    theCase = "+ - -";
  } else if (results.history.length) {
    theCase = "- + -";
  } else if (results.categories.length) {
    theCase = "- - +";
  }

  return theCase;

}
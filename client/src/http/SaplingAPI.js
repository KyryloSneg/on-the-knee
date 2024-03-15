import axios from "axios";
import applySpellCheckEdits from "../utils/applySpellCheckEdits";

// use with "useFetching" hook
async function spellCheck(text) {
  try {
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/spellcheck',
      {
        key: process.env.REACT_APP_SPELLCHECK_API_KEY,
        session_id: `session: ${text}`,
        text,
      },
    );

    const { data } = response;
    const spellCheckedText = applySpellCheckEdits(text, data.edits);

    return spellCheckedText;
  } catch (e) {
    const { msg } = e.response.data;
    console.log({ error: msg });
  }

}

export default spellCheck;
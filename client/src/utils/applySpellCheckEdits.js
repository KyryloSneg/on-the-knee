function applySpellCheckEdits(text, edits) {
  text = text.slice();
  const reversed = edits.sort((a, b) => b['sentence_start'] + b['start'] - a['sentence_start'] - a['start']);
  for (const edit of reversed) {
    const start = edit['sentence_start'] + edit['start'];
    const end = edit['sentence_start'] + edit['end'];
    if (start > text.length || end > text.length) {
      console.log(`Edit start:${start}/end:${end} outside of bounds of text:${text}`);
      continue;
    }
    text = text.slice(0, start) + edit['replacement'] + text.slice(end);
  }
  return text;
}

export default applySpellCheckEdits;
export function interpolateComment(
  id: number,
  comment: string,
  comments: (string | number)[],
) {
  for(const t of comments) {
    if (typeof t === "number" && t === id) {
      comments[comments.indexOf(t)] = comment;
    }
  }
}
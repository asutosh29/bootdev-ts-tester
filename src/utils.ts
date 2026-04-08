export function getTicketInfo(id: string | number) {
  if (typeof id == "string"){
    id = parseInt(id.split("-")[1], 10)
  }
  return `Processing ticket: ${id}`
}

export function ticketAdd() {
  return {
    type: 'TICKET_ADD',
  };
};

export function ticketSetTitle(value) {
  return {
    type: 'TICKET_SET_TITLE',
    value,
  };
};

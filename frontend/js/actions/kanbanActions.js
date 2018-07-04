export function cardDetail(column_index, card_index) {
  return {
    card_index,
    column_index,
    type: 'CARD_DETAIL',
  };
};

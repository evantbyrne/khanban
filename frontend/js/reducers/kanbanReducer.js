const initialState = {
  columns: [
    {
      title: 'To Do',
      tickets: [
        {
          description: 'The quick brown fox jumps over the lazy dog.',
          id: 1,
          tags: [
            {
              color: 'darkblue',
              title: 'Foobar',
            },
            {
              color: 'darkgreen',
              title: 'Baz',
            },
          ],
          title: 'Hello, World!',
        },
        {
          description: 'Second ticket description.',
          id: 2,
          tags: [],
          title: 'Lorem Ipsum Ticket',
        },
      ],
    },
    {
      title: 'In Progress',
      tickets: [
        {
          description: '',
          id: 3,
          tags: [],
          title: 'This ticket is in progress right now and has a long title',
        },
      ],
    },
    {
      title: 'Done',
      tickets: [
        {
          description: '',
          id: 4,
          tags: [],
          title: 'Plan Sprint 1',
        },
      ],
    },
  ],
  current_card: null,
};

export default function kanbanReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARD_DETAIL':
      return (() => {
        const current_card = state.columns[action.column_index].tickets[action.card_index];
        return Object.assign({}, state, {
          current_card,
        });
      })();
  }

  return state;
}
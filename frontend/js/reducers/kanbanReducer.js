const initialState = {
  columns: [
    {
      title: 'To Do',
      tickets: [
        {
          title: 'Hello, World!',
        },
        {
          title: 'Lorem Ipsum Ticket',
        },
      ],
    },
    {
      title: 'In Progress',
      tickets: [
        {
          title: 'This ticket is in progress right now',
        },
      ],
    },
    {
      title: 'Done',
      tickets: [
        {
          title: 'Plan Sprint 1',
        },
      ],
    },
  ],
};

export default function kanbanReducer(state = initialState, action) {
  switch (action.type) {
    case 'TICKET_ADD':
      return (() => {
        const tickets = state.tickets.concat([
          {
            title: '',
          }
        ]);
        return Object.assign({}, state, {
          tickets,
        });
      })();

    case 'TICKET_SET_TITLE':
      return (() => {
        const tickets = state.tickets.slice();
        tickets[action.index].title = action.value;
        return Object.assign({}, state, {
          tickets,
        });
      })();
  }

  return state;
}
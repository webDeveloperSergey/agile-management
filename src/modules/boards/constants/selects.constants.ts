const BOARD_SELECT = {
  board_id: true,
  name: true,
  description: true,
  owner: {
    select: {
      user_id: true,
      email: true,
    },
  },
  memberships: {
    select: {
      user_id: true,
      role: true,
    },
  },
  columns: {
    select: {
      column_id: true,
      name: true,
      order: true,
    },
    orderBy: { order: 'asc' },
  },
} as const

export { BOARD_SELECT }

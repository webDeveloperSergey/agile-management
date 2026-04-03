const USER_SELECT = {
  user_id: true,
  email: true,
  createdAt: true,
} as const

const USER_SELECT_WITH_PASSWORD = {
  ...USER_SELECT,
  password: true,
} as const

export { USER_SELECT, USER_SELECT_WITH_PASSWORD }

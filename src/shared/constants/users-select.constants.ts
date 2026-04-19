const USER_SELECT = {
  user_id: true,
  email: true,
  role: true,
  createdAt: true,
} as const

const USER_SELECT_WITH_PASSWORD = {
  ...USER_SELECT,
  password: true,
} as const

const USER_SELECT_WITH_REFRESH_TOKEN = {
  ...USER_SELECT,
  refresh_token: true,
} as const

export {
  USER_SELECT,
  USER_SELECT_WITH_PASSWORD,
  USER_SELECT_WITH_REFRESH_TOKEN,
}

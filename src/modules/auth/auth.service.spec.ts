describe('AuthService', () => {
  describe('signIn', () => {
    // Negative
    it('Should throw UnauthorizedException if user not founded', () => {})
    it('Should throw UnauthorizedException if password wrong', () => {})

    // Positive
    it('Should return tokens and user if credentials are valid', () => {})
  })

  describe('register', () => {
    // Negative
    it('Should throw BadRequestException if user already exists', () => {})

    // Positive
    it('Should return tokens and user if credentials valid', () => {})
  })
})

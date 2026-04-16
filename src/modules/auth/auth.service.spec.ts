import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  const mockUsersService = {
    createUser: jest.fn(),
    getOneUser: jest.fn(),
    updateRefreshToken: jest.fn(),
    getUserByEmail: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(),
  }

  let authService: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  describe('signIn', () => {
    // Negative
    it('Should throw UnauthorizedException if user not founded', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(null)

      await expect(
        authService.signIn({ email: 'test@mail.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('Should throw UnauthorizedException if password wrong', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: 'wrongPassword',
      })

      jest.spyOn(argon2, 'verify').mockResolvedValue(false)

      await expect(
        authService.signIn({ email: 'test@mail.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    // Positive
    it('Should return tokens and user if credentials are valid', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue({
        user_id: 1,
        email: 'test@mail.com',
        password: 'hashedPassword',
      })

      jest.spyOn(argon2, 'verify').mockResolvedValue(true)

      mockJwtService.sign.mockReturnValue('fake_token') // jwt генерирует токены
      mockConfigService.get.mockReturnValue('7') // configService возвращает expire

      await expect(
        authService.signIn({ email: 'test@mail.com', password: '123456' }),
      ).resolves.toEqual({
        access_token: 'fake_token',
        refresh_token: 'fake_token',
        user: {
          user_id: 1,
          email: 'test@mail.com',
        },
      })
    })
  })

  describe('register', () => {
    // Negative
    it('Should throw BadRequestException if user already exists', async () => {
      mockUsersService.createUser.mockRejectedValue(new BadRequestException())

      await expect(
        authService.register({ email: 'test@mail.com', password: '123456' }),
      ).rejects.toThrow(BadRequestException)
    })

    // Positive
    it('Should return tokens and user if credentials valid', async () => {
      mockUsersService.createUser.mockResolvedValue({
        user_id: 1,
        email: 'test@mail.com',
      })

      mockJwtService.sign.mockReturnValue('fake_token')
      mockConfigService.get.mockReturnValue('7')

      await expect(
        authService.register({ email: 'test@mail.com', password: '123456' }),
      ).resolves.toEqual({
        access_token: 'fake_token',
        refresh_token: 'fake_token',
        user: {
          user_id: 1,
          email: 'test@mail.com',
        },
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { BoardsService } from './boards.service'
import { BoardsRepository } from './boards.repository'
import { ConflictException, NotFoundException } from '@nestjs/common'

describe('BoardsService', () => {
  let boardService: BoardsService

  const mockBoardsRepository = {
    findAllBoards: jest.fn(),
    getBoard: jest.fn(),
    getBoardByOwner: jest.fn(),
    createBoard: jest.fn(),
    updateBoard: jest.fn(),
    deleteBoard: jest.fn(),
    addMember: jest.fn(),
    findMember: jest.fn(),
    deleteMember: jest.fn(),
  }

  const mockBoard = {
    board_id: '1',
    name: 'Test Board',
    description: 'This is a test board',
    owner: {
      user_id: '1',
      email: 'user1@example.com',
    },
    memberships: [
      { user_id: '1', role: 'MEMBER' },
      { user_id: '2', role: 'MEMBER' },
    ],
  }

  const mockCreateBoardDto = {
    name: 'Test Board',
    description: 'This is a test board',
    memberships: ['1', '2'],
  }

  const mockBoardMember = {
    board_id: '1',
    user_id: '2',
    role: 'MEMBER',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: BoardsRepository, useValue: mockBoardsRepository },
      ],
    }).compile()

    boardService = module.get<BoardsService>(BoardsService)
  })

  it('findAllBoards should return all boards with BOARD_SELECT fields', async () => {
    mockBoardsRepository.findAllBoards.mockResolvedValue([mockBoard])
    await expect(boardService.findAllBoards('1')).resolves.toEqual([mockBoard])
  })

  describe('getBoardById', () => {
    it('should return 404 Not Found if board is not found', async () => {
      mockBoardsRepository.getBoard.mockResolvedValue(null)
      await expect(boardService.getBoardById('1', '1')).rejects.toThrow(
        NotFoundException,
      )
    })
    it('should return board with BOARD_SELECT fields if board is found', async () => {
      mockBoardsRepository.getBoard.mockResolvedValue(mockBoard)
      await expect(boardService.getBoardById('1', '1')).resolves.toEqual(
        mockBoard,
      )
    })
  })

  it('createBoard should return created board with BOARD_SELECT fields', async () => {
    mockBoardsRepository.createBoard.mockResolvedValue(mockBoard)
    await expect(
      boardService.createBoard(mockCreateBoardDto, '1'),
    ).resolves.toEqual(mockBoard)
  })

  describe('updateBoard', () => {
    it('should return 404 Not Found if updatedBoard return {count: 0}', async () => {
      mockBoardsRepository.updateBoard.mockResolvedValue({ count: 0 })
      await expect(
        boardService.updateBoard('1', '1', { name: 'Updated Board' }),
      ).rejects.toThrow(NotFoundException)
    })
    it('should return updated board if count is greater than 0', async () => {
      mockBoardsRepository.updateBoard.mockResolvedValue({ count: 1 })
      await expect(
        boardService.updateBoard('1', '1', { name: 'Updated Board' }),
      ).resolves.toEqual(mockBoard)
    })
  })

  describe('deleteBoardById', () => {
    it('should return 404 Not Found if deleteBoard returns {count: 0}', async () => {
      mockBoardsRepository.deleteBoard.mockResolvedValue({ count: 0 })
      await expect(boardService.deleteBoardById('1', '1')).rejects.toThrow(
        NotFoundException,
      )
    })
    it('should delete the board if deleteBoard returns {count: 1}', async () => {
      mockBoardsRepository.deleteBoard.mockResolvedValue({ count: 1 })
      await expect(
        boardService.deleteBoardById('1', '1'),
      ).resolves.toBeUndefined()
    })
  })

  // ====================================== members ======================================
  describe('Members', () => {
    describe('addMember', () => {
      it('should throw 404 Not Found if user is not the board owner (checkOwner)', async () => {
        mockBoardsRepository.getBoardByOwner.mockResolvedValue(null)
        await expect(boardService.addMember('1', '2', '1')).rejects.toThrow(
          NotFoundException,
        )
      })
      it('should throw 409 Conflict if member already exists (checkMemberExists)', async () => {
        mockBoardsRepository.getBoardByOwner.mockResolvedValue(mockBoard) // ← владелец найден
        mockBoardsRepository.findMember.mockResolvedValue({ user_id: '2' }) // ← участник уже есть

        await expect(boardService.addMember('1', '2', '1')).rejects.toThrow(
          ConflictException,
        )
      })
      it('should add member successfully', async () => {
        mockBoardsRepository.getBoardByOwner.mockResolvedValue(mockBoard)
        mockBoardsRepository.findMember.mockResolvedValue(null)
        mockBoardsRepository.addMember.mockResolvedValue(mockBoardMember)

        await expect(
          boardService.addMember('1', '2', '1'),
        ).resolves.toBeUndefined()
      })
    })

    describe('deleteMember', () => {
      it('should throw 404 Not Found if user is not the board owner (checkOwner)', async () => {
        mockBoardsRepository.getBoardByOwner.mockResolvedValue(null)

        await expect(boardService.deleteMember('1', '2', '1')).rejects.toThrow(
          NotFoundException,
        )
      })
      it('should delete member successfully', async () => {
        mockBoardsRepository.getBoardByOwner.mockResolvedValue(mockBoard)

        await expect(
          boardService.deleteMember('1', '2', '1'),
        ).resolves.toBeUndefined()
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

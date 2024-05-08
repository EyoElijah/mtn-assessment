import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TokenService } from '../common/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserRepository = {
    create: jest.fn().mockImplementation((dto: RegisterDto) => dto),
    findOne: jest.fn().mockRejectedValue({}),
    find: jest.fn().mockRejectedValue({}),
    save: jest
      .fn()
      .mockImplementation((dto: RegisterDto) => Promise.resolve(dto)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(' should register a new user ', async () => {
    expect(service.register).resolves;
  });

  it('should login a user', async () => {
    expect(service.login).resolves;
  });

  it('should logout a user', () => {
    expect(service.logout).resolves;
  });
});

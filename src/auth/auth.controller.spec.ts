import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { AuthGuard } from '../guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest
      .fn()
      .mockImplementation((dto: RegisterDto) => Promise.resolve(dto)),
    login: jest.fn().mockImplementation((dto: LoginDto) => {
      return Promise.resolve(dto);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', () => {
    const dto: RegisterDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    expect(controller.register(dto)).resolves;
  });

  it('should login a user', async () => {
    const dto: LoginDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    expect(controller.login(dto)).resolves;
  });
});

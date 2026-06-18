import {
  BaseService,
  inject,
  JWSTokenService,
  BindingKeys,
  BindingNamespaces,
  IJWTTokenPayload,
} from '@venizia/ignis';
import { getError } from '@venizia/ignis-helpers';
import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcrypt';

export class AuthService extends BaseService {
  constructor(
    @inject({ key: 'repositories.UserRepository' })
    private userRepository: UserRepository,
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.SERVICE,
        key: JWSTokenService.name,
      }),
    })
    private tokenService: JWSTokenService,
  ) {
    super({ scope: AuthService.name });
  }

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.userRepository.createUser(email, hashed);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw getError({ statusCode: 401, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw getError({ statusCode: 401, message: 'Invalid credentials' });
    }

    const payload: IJWTTokenPayload = {
      userId: String(user.id),
      roles: [{ id: 1, identifier: user.role ?? 'user', priority: 1 }],
    };

    const token = await this.tokenService.generate({ payload });
    return { token };
  }

  async getMe(userId: number) {
    return this.userRepository.findUserById(userId);
  }
}
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserDocument, UserRole } from '../users/users.schema';
import { Types } from 'mongoose';

interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}

interface AuthResponse {
  access_token: string;
}

type UserWithId = Omit<UserDocument, 'password'> & {
  _id: Types.ObjectId;
};

/**
 * Service responsible for handling authentication and user validation
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials
   * @param email - The user's email
   * @param password - The user's password
   * @returns Promise with the user object (without password)
   * @throws {UnauthorizedException} When credentials are invalid
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Generates a JWT token for a validated user
   * @param user - The user object to generate token for
   * @returns Promise with the access token
   */
  async login(user: UserWithId): Promise<AuthResponse> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

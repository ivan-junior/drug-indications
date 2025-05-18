import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for managing users in the system
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user with hashed password
   * @param createUserDto - The user data to create
   * @returns Promise with the created user's email
   * @throws {ConflictException} When email is already registered
   */
  async create(createUserDto: CreateUserDto): Promise<{ email: string }> {
    const existing = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return { email: user.email };
  }

  /**
   * Finds a user by their email address
   * @param email - The email to search for
   * @returns Promise with the user document or null if not found
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Finds a user by their ID
   * @param id - The ID of the user to find
   * @returns Promise with the user document
   * @throws {NotFoundException} When user is not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

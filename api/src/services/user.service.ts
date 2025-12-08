import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(createUserDto: CreateUserDto): User {
    return this.userRepository.save({
      ...createUserDto,
      accountStatus: 'ACTIVE',
      lastLogin: new Date(),
    });
  }

  getUserInfo(userId: number): User {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  }

  updateName(userId: number, name: string): User {
    const user = this.getUserInfo(userId);
    return this.userRepository.save({ ...user, name });
  }

  updateEmail(userId: number, email: string): User {
    const user = this.getUserInfo(userId);
    return this.userRepository.save({ ...user, email });
  }

  updateUser(userId: number, updateUserDto: UpdateUserDto): User {
    const user = this.getUserInfo(userId);
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  deactivateAccount(userId: number): void {
    this.userRepository.updateStatus(userId, 'INACTIVE');
  }

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }
}

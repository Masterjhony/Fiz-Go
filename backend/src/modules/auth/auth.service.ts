import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || UserRole.CLIENT,
    });

    await this.userRepository.save(user);

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    delete user.password;

    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last active
    user.lastActiveAt = new Date();
    await this.userRepository.save(user);

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    delete user.password;

    return { user, token };
  }

  async socialLogin(socialLoginDto: SocialLoginDto): Promise<{ user: User; token: string }> {
    const { email, firstName, lastName, provider, providerId, avatar } = socialLoginDto;

    // Check if user exists
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        email,
        firstName,
        lastName,
        avatar,
        [`${provider}Id`]: providerId,
      });
    } else {
      // Update social ID and avatar
      user[`${provider}Id`] = providerId;
      if (avatar) user.avatar = avatar;
    }

    // Update last active
    user.lastActiveAt = new Date();
    await this.userRepository.save(user);

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    delete user.password;

    return { user, token };
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
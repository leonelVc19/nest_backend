import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

import { RegisterUserDto, CreateUserDto, UpdateUserDto, LoginDTO} from './dto';

import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  //inyectando la db
  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto):  Promise<User> {

    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync( password, 10 ),
        ...userData
      });
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      console.log('ERROR',error);
      if ( error.code === 11000 ) {
        throw new BadRequestException(`${createUserDto.email} already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!!')
    }
  };

  async register(registerTDO: RegisterUserDto): Promise<LoginResponse>{
    const user = await this.create(registerTDO);
     return {
      user,
      token: this.getJwtToken({ id: user._id })
    };
  };

  async login( loginDTO: LoginDTO ): Promise<LoginResponse> {
    const { email, password } = loginDTO;
    const user = await this.userModel.findOne({ email })
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException(' Not valid credentials - password ');
    };

    const { password:_, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    };
  };

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  findOne(id: number): Promise<User>{
    console.log(id);
    
    return this.userModel.findById( id );
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  };

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }
}

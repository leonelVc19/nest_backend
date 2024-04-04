import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDTO } from './dto/login.dto';

import { User } from './entities/user.entity';
import { Model } from 'mongoose';


import { JwtPayload } from './interfaces/jwt-payload';


@Injectable()
export class AuthService {

  //inyectando la db
  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto):  Promise<User> {

    // const newUser = new this.userModel( createUserDto );
    // return newUser.save();
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync( password, 10 ),
        ...userData
      });
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON()
      return user;
    } catch (error) {
      console.log('ERROR',error);
      if ( error.code === 11000 ) {
        throw new BadRequestException(`${createUserDto.email} already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!!')
    }
  };

  async login( loginDTO: LoginDTO ) {
    const { email, password } = loginDTO;
    const user = await this.userModel.findOne({ email })
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException(' Not valid credentials - password ');
    };

    const { password:_, ...rest } = user.toJSON();
    // User { _id, name, email, roles... }
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    }
    /**
     * User { _id, name, email, roles... }
     * Token -> 89SDNSND.DNDJDJDJD.DKDNDND
     */
  };

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
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

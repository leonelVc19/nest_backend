import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, CreateUserDto, UpdateUserDto, LoginDTO} from './dto';
import { AuthGuard } from './guards/auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  };

  @Post('/login')
  login( @Body() loginDTO: LoginDTO ) {
    return this.authService.login( loginDTO );
  };

  @Post('/register')
  register( @Body() registerTDO: RegisterUserDto ) {
    return this.authService.register( registerTDO );
  };

  @UseGuards( AuthGuard )
  @Get()
  findAll() {
    return this.authService.findAll();
  };

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    
    return this.authService.findOne(+id);
  };

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  };

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  };
};

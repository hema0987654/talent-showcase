import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { UserRole } from 'src/users/Entity/user.entity';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/decorator/roles/roles.guard';

export interface JwtRequest extends Request {
  user: { id: number; email: string; role: UserRole };
}

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get('test')
    @UseGuards(JwtAuthGuard)
  @Role(UserRole.ARTIST)
  async send(){
    console.log("hjk");
    
  }

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(UserRole.ARTIST)
  async create(@Body() createWorkDto: CreateWorkDto, @Req() req: JwtRequest) {
    const artistId = req.user.id;    
    return this.worksService.create(createWorkDto, artistId);
  }

  @Get()
  async findAll() {
    return this.worksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.worksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(UserRole.ARTIST)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkDto: UpdateWorkDto,
    @Req() req: JwtRequest,
  ) {
    const artistId = req.user.id;
    return this.worksService.update(id, updateWorkDto, artistId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(UserRole.ARTIST,UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: JwtRequest) {
    const artistId = req.user.id;
    return this.worksService.remove(id, artistId);
  }
}

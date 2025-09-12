import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsDateString, IsPhoneNumber } from 'class-validator';
import { Department, Position } from '../../enums/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Иванов' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Иванович', required: false })
  @IsOptional()
  @IsString()
  patronymic?: string;

  @ApiProperty({ example: 'ivan@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+79211234567', required: false })
  @IsOptional()
  @IsPhoneNumber('RU')
  phone?: string;

  @ApiProperty({ enum: Position, example: Position.DEVELOPER })
  @IsEnum(Position)
  position: Position;

  @ApiProperty({ enum: Department, example: Department.TECHNICAL })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  hireDate: string;

  @ApiProperty({ example: '1990-05-20', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'], default: 'active' })
  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';

  @ApiProperty({ example: 'Дополнительные заметки', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
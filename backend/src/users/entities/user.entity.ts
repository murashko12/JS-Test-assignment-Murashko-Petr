import { ApiProperty } from '@nestjs/swagger'
import { Department, Position } from '../../enums/enums'

export class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Иван' })
  firstName: string;

  @ApiProperty({ example: 'Иванов' })
  lastName: string;

  @ApiProperty({ example: 'Иванович', required: false })
  patronymic?: string;

  @ApiProperty({ example: 'ivan@mail.com' })
  email: string;

  @ApiProperty({ example: '+79211234567', required: false })
  phone?: string;

  @ApiProperty({ enum: Position, example: Position.DEVELOPER })
  position: Position;

  @ApiProperty({ enum: Department, example: Department.TECHNICAL })
  department: Department;

  @ApiProperty({ example: 'IT-отдел', required: false })
  groupName?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  hireDate: string;

  @ApiProperty({ example: '1990-05-20T00:00:00.000Z', required: false })
  birthDate?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @ApiProperty({ example: 'Дополнительные заметки', required: false })
  notes?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  updatedAt: string;
}
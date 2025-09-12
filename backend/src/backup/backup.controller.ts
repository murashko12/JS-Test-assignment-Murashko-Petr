import { Controller, Post, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('backup')
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создать бэкап пользователей' })
  @ApiResponse({ status: 201, description: 'Бэкап успешно создан' })
  @ApiResponse({ status: 500, description: 'Ошибка при создании бэкапа' })
  async createBackup() {
    const filename = await this.backupService.createBackup();
    return {
      message: 'Backup created successfully',
      filename,
      timestamp: new Date().toISOString()
    };
  }

  @Post('restore/:filename')
  @ApiOperation({ summary: 'Восстановить данные из бэкапа' })
  @ApiParam({ name: 'filename', description: 'Имя файла бэкапа' })
  @ApiResponse({ status: 200, description: 'Данные успешно восстановлены' })
  @ApiResponse({ status: 404, description: 'Файл бэкапа не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка при восстановлении' })
  async restoreBackup(@Param('filename') filename: string) {
    const result = await this.backupService.restoreFromBackup(filename);
    return {
      message: 'Data restored successfully',
      usersRestored: result.restored,
      timestamp: new Date().toISOString()
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'Получить список доступных бэкапов' })
  @ApiResponse({ status: 200, description: 'Список бэкапов' })
  async getBackupsList() {
    const backups = await this.backupService.getBackupsList();
    return {
      backups,
      count: backups.length
    };
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Скачать файл бэкапа' })
  @ApiParam({ name: 'filename', description: 'Имя файла бэкапа' })
  @ApiResponse({ status: 200, description: 'Файл бэкапа' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async downloadBackup(@Param('filename') filename: string, @Res() res: Response) {
    const filepath = join(process.cwd(), 'backups', filename);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = createReadStream(filepath);
    fileStream.pipe(res);
  }
}
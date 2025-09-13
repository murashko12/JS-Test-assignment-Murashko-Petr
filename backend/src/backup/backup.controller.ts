import { Controller, Post, Get, Param, Res, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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

  @Post('restore/upload')
  @ApiOperation({ summary: 'Восстановить данные из загруженного CSV файла' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV файл для восстановления данных',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Данные успешно восстановлены' })
  @ApiResponse({ status: 400, description: 'Ошибка в формате файла' })
  @ApiResponse({ status: 500, description: 'Ошибка при восстановлении' })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only CSV files are allowed'), false);
      }
    },
  }))
  async restoreBackupFromFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
        throw new BadRequestException('File is required');
    }

    const result = await this.backupService.restoreFromUploadedFile(file);
    return {
        message: 'Data restored successfully from uploaded file',
        usersRestored: result.restored,
        filename: file.originalname,
        timestamp: new Date().toISOString()
    };
}
}
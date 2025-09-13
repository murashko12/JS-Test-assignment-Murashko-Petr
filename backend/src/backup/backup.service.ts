import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as csv from 'csv-parser';
import { stringify } from 'csv-stringify';

@Injectable()
export class BackupService {
  private readonly backupDir = join(process.cwd(), 'backups');

  constructor(private prisma: PrismaService) {
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Создание бэкапа
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.csv`;
    const filepath = join(this.backupDir, filename);

    // Получаем всех пользователей
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'asc' }
    });

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filepath);
      const stringifier = stringify({
        header: true,
        columns: {
          id: 'ID',
          firstName: 'First Name',
          lastName: 'Last Name',
          patronymic: 'Patronymic',
          email: 'Email',
          phone: 'Phone',
          position: 'Position',
          department: 'Department',
          groupName: 'Group Name',
          hireDate: 'Hire Date',
          birthDate: 'Birth Date',
          status: 'Status',
          notes: 'Notes',
          createdAt: 'Created At',
          updatedAt: 'Updated At'
        }
      });

      stringifier.pipe(writeStream);

      users.forEach(user => {
        stringifier.write(user);
      });

      stringifier.end();

      writeStream.on('finish', () => {
        resolve(filename);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  // Восстановление из бэкапа
  async restoreFromBackup(filename: string): Promise<{ restored: number }> {
    const filepath = join(this.backupDir, filename);
    
    if (!existsSync(filepath)) {
      throw new Error(`Backup file ${filename} not found`);
    }

    const users: any[] = [];

    return new Promise((resolve, reject) => {
      createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => {
          // Преобразуем данные обратно в правильные типы
          const user = {
            id: parseInt(data.ID),
            firstName: data['First Name'],
            lastName: data['Last Name'],
            patronymic: data.Patronymic || null,
            email: data.Email,
            phone: data.Phone || null,
            position: data.Position,
            department: data.Department,
            groupName: data['Group Name'] || null,
            hireDate: new Date(data['Hire Date']),
            birthDate: data['Birth Date'] ? new Date(data['Birth Date']) : null,
            status: data.Status,
            notes: data.Notes || null,
            createdAt: new Date(data['Created At']),
            updatedAt: new Date(data['Updated At'])
          };
          users.push(user);
        })
        .on('end', async () => {
          try {
            // Очищаем текущие данные и восстанавливаем из бэкапа
            await this.prisma.user.deleteMany();
            
            for (const user of users) {
              await this.prisma.user.create({
                data: user
              });
            }

            resolve({ restored: users.length });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Восстановление из загруженного файла - УБЕДИТЕСЬ ЧТО ЭТОТ МЕТОД ТОЛЬКО ОДИН!
  async restoreFromUploadedFile(file: Express.Multer.File): Promise<{ restored: number }> {
    if (!file.buffer) {
      throw new BadRequestException('Invalid file');
    }

    const users: any[] = [];
    const content = file.buffer.toString('utf8');

    return new Promise((resolve, reject) => {
      // Создаем виртуальный stream из buffer
      const { Readable } = require('stream');
      const stream = Readable.from(content);

      stream
        .pipe(csv())
        .on('data', (data) => {
          try {
            const user = {
              id: parseInt(data.ID),
              firstName: data['First Name'],
              lastName: data['Last Name'],
              patronymic: data.Patronymic || null,
              email: data.Email,
              phone: data.Phone || null,
              position: data.Position,
              department: data.Department,
              groupName: data['Group Name'] || null,
              hireDate: new Date(data['Hire Date']),
              birthDate: data['Birth Date'] ? new Date(data['Birth Date']) : null,
              status: data.Status,
              notes: data.Notes || null,
              createdAt: new Date(data['Created At']),
              updatedAt: new Date(data['Updated At'])
            };
            users.push(user);
          } catch (error) {
            reject(new BadRequestException('Invalid CSV format'));
          }
        })
        .on('end', async () => {
          try {
            if (users.length === 0) {
              throw new BadRequestException('No valid data found in CSV');
            }

            // Очищаем текущие данные и восстанавливаем из бэкапа
            await this.prisma.user.deleteMany();
            
            for (const user of users) {
              await this.prisma.user.create({
                data: user
              });
            }

            resolve({ restored: users.length });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(new BadRequestException('Error parsing CSV file'));
        });
    });
  }

  // Получить список доступных бэкапов
  async getBackupsList(): Promise<string[]> {
    const fs = require('fs').promises;
    try {
      const files = await fs.readdir(this.backupDir);
      return files.filter(file => file.endsWith('.csv'));
    } catch (error) {
      return [];
    }
  }
}
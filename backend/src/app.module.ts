import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [UsersModule, BackupModule],
  providers: [PrismaService],
})
export class AppModule {}
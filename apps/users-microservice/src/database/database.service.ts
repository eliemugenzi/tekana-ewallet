import { INestMicroservice, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestMicroservice) {
        this.$on('beforeExit' as never, async ()=> {
            await app.close();
        })
    }
}

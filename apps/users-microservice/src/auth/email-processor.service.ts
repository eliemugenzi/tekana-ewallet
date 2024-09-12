import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpStatus, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '@sendgrid/mail';

@Processor('email')
export class EmailProcessor extends WorkerHost {
    private sendGrid: MailService = new MailService();
    private logger: Logger;
    constructor() {
        super();
        this.sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.logger = new Logger(EmailProcessor.name);

    }

    async process(job: Job): Promise<any> {
        try {
            const mailResponse = await this.sendGrid.send({
                to: job?.data?.email,
                from: {
                    email: process.env.EMAIL_SENDER,
                    name: process.env.EMAIL_SENDER_NAME,
                },
                subject: job?.data?.subject,
                text: job?.data?.message,
                replyTo: 'reply@elieweb.dev',
                html: job?.data?.message,
            });
    
            this.logger.log(`Email successfully dispatched to ${JSON.stringify(mailResponse, null, 2)}`);
            return {
                status: HttpStatus.OK
            }
        } catch(error) {
            this.logger.log('MAIL ERROR', JSON.stringify(error?.response?.body, null, 2));
        }  

    }
}

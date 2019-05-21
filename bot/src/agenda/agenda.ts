import * as Agenda from 'agenda';
import * as mongoose from 'mongoose';
import { lookForImage, sendDaily } from './jobs';

export enum AgendaJobs {
    LOOK_FOR_IMAGE = 'look for image',
    SEND_DAILY     = 'send daily',
}

export function getAgenda(): Agenda {
    return new Agenda()
        .mongo(mongoose.connection.db, process.env.AGENDA_COLLECTION);
}

export async function initAgenda(): Promise<void> {
    const agenda = getAgenda();

    // Defines de tasks
    agenda.define(AgendaJobs.LOOK_FOR_IMAGE, lookForImage);
    agenda.define(AgendaJobs.SEND_DAILY, sendDaily);

    // Starting
    await agenda.start();

    // Agendando tasks
    agenda.jobs({ name: AgendaJobs.LOOK_FOR_IMAGE }).then(jobs => {
        if (jobs.length == 0) {
            const job = agenda.create(AgendaJobs.LOOK_FOR_IMAGE);
            job.schedule('8:30am');
            job.repeatAt('8:30am');
            job.save();
        }
    });
}

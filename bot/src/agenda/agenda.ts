import * as Agenda from 'agenda';
import * as mongoose from 'mongoose';

export enum AgendaJobs {
    LOOK_FOR_IMAGE = 'look for image'
}

export async function initAgenda(): Promise<Agenda> {
    const agenda = new Agenda()
        .mongo(mongoose.connection.db, process.env.AGENDA_COLLECTION);

    // Defines de tasks
    agenda.define(AgendaJobs.LOOK_FOR_IMAGE, lookForImage)

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

    return agenda;
}

const lookForImage = async (job: Agenda.Job, done: (err?: Error) => void): Promise<void> => {
    console.log('Procurando imagem nova');
    setTimeout(done, 5000);
}
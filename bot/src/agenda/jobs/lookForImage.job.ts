import * as Agenda from 'agenda';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';

import { Stream } from 'stream';

import { recognize, CardapioService } from '../../providers';

const cardapioService = new CardapioService();

export async function lookForImage(job: Agenda.Job, done: (err?: Error) => void): Promise<void> {
    console.log('Checando novo cardapio');
    const dataRequisicao = new Date();
    getImageUrl()
        .then(async url => {
            const ultimoSalvo = await cardapioService.findLatest();

            return {
                nova: url,
                banco: (!!ultimoSalvo) ? ultimoSalvo.url : null,
            };
        })
        .then(({ nova, banco }) => {
            if (banco && nova == banco) {
                done();
                return Promise.resolve();
            } else
                return downloadImage(nova, '/usr/src/app/assets/cardapio.png')
                    .then(recognize)
                    .then(separateDays)
                    .then(dias => {
                        const dataInicio = pegarUltimaSegunda(dataRequisicao);
                        const dataFim = pegarProximaSexta(dataRequisicao);
                        const textos = dias.map(tratarErros);

                        cardapioService.create({
                            url: nova,
                            dataRequisicao,
                            textos, dataInicio, dataFim,
                        })
                        .then(() => console.log('Cardapio salvo com sucesso'))
                        .then(_ => done());

                    });
        })
        .catch(err => {
            console.error('Erro ao conseguir o cardapio');
            job.fail(err);
            job.save();
        });
}

function getImageUrl(): Promise<string> {
    return axios.get('http://www.uel.br/ru/pages/cardapio.php')
        .then(resp => cheerio.load(resp.data)('#conteudo2CT > p:nth-child(7) > img')[0] )
        .then(imgCardapio => imgCardapio.attribs.src);
}

function downloadImage(imageUrl, filePath: string): Promise<string> {
    return new Promise(resolve => {
        axios.get(imageUrl, { responseType: 'stream' })
            .then(response => {
                (<Stream>response.data).pipe(fs.createWriteStream(filePath))
                    .on('close', () => resolve(filePath));
            });
    });
}

function separateDays(todosDias: string): string[] {
    const dias = todosDias.split('\n\n')
        .map(dia => dia.replace('\n', ' '));
    dias.pop();
    return dias;
}

function pegarUltimaSegunda(date: Date) {
    const day = date.getDay()
    const diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function pegarProximaSexta(date: Date) {
    const day = date.getDay()
    const diff = date.getDate() + 5 - day + (day == 6 ? 7 : 0);
    return new Date(date.setDate(diff));
}

function tratarErros(dia: string): string {
    const ano = new Date().getFullYear().toString();
    return dia
        .toUpperCase()
        .replace('FEUÃO', 'FEIJÃO')
        .replace('FEI RA', 'FEIRA')
        .replace('GRELHADAI', 'GRELHADA /')
        .replace(' I ', ' / ')
        .replace(ano + ' ', ano + '\n');
}

import * as Agenda from 'agenda';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';

import { Stream } from 'stream';
import { recognize } from '../../providers/ocr/ocr.service';

export async function lookForImage(job: Agenda.Job, done: (err?: Error) => void): Promise<void> {
    console.log('Procurando imagem nova');
    setTimeout(done, 5000);
}

function getImageUrl(): Promise<string> {
    return axios.get('http://www.uel.br/ru/pages/cardapio.php')
        .then(resp => cheerio.load(resp.data)('#conteudo2CT > p:nth-child(7) > img')[0] )
        .then(imgCardapio => imgCardapio.attribs.src);
}

function downloadImage(filePath: string): Promise<string> {
    return new Promise(resolve => {
        getImageUrl()
            .then(imageUrl => axios.get(imageUrl, { responseType: 'stream' }))
            .then(response => {
                (<Stream>response.data).pipe(fs.createWriteStream(filePath))
                    .on('close', () => resolve(filePath));
            });
    });
}

export function getImageFromRu() {
    // downloadImage('./cardapio.png')
    Promise.resolve('./cardapio.png')
        .then(recognize)
        .then(result => console.log(result.text))
}
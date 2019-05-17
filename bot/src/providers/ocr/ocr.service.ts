import * as Tesseract from "tesseract.js";
const { TesseractWorker } = Tesseract;
import * as path from 'path';

const worker = new TesseractWorker({
    langPath: path.join(__dirname, '..', '..', '..', 'assets', 'lang-data')
});

export function recognize(filename: string): Promise<{ text: string }> {
    return worker.recognize(filename, 'por')
        .progress(p => console.log('progress ', p));
}

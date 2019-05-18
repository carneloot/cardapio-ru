import { Typegoose, prop, arrayProp } from "typegoose";

export enum EDiasSemana {
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
}

export class Cardapio extends Typegoose {
    @prop()
    dataRequisicao: Date;

    @prop()
    dataInicio: Date;
    
    @prop()
    dataFim: Date;

    @prop()
    url: string;

    @arrayProp({ items: String })
    textos: string[];
}
import { Model } from "mongoose";
import { Cardapio } from "./cardapio.model";
import { InstanceType } from "typegoose";
import { CreateCardapioDto } from "./create-cardapio.dto";
import { throws } from "assert";

export class CardapioService {
    private cardapioModel: Model<InstanceType<Cardapio>, {}>;

    constructor() {
        this.cardapioModel = new Cardapio().getModelForClass(Cardapio);
    }

    create(createCardapioDto: CreateCardapioDto): Promise<Cardapio> {
        return new this.cardapioModel(createCardapioDto).save();
    }

    findLatest(): Promise<Cardapio> {
        return this.cardapioModel.find()
            .sort({ dataRequisicao: -1 })
            .limit(1)
            .exec()
            .then(vetor => (vetor.length) ? vetor[0] : null);
    }

    findDateInBetween(data: Date): Promise<Cardapio> {
        return this.cardapioModel.find({
            $and: [
                { dataInicio: { $lt: data } },
                { dataFim:    { $gt: data } },
            ],
        })
        .sort({ dataRequisicao: -1 })
        .limit(1)
        .exec()
        .then(vetor => (vetor.length)
                ? vetor[0]
                : Promise.reject(Error('Não há cardápio para essa data')))
    }
}
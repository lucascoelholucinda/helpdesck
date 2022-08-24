import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const produto = new Schema({
    NomedoProduto: {
        type: String,
        required: true
    },

    Foto: {
        type: Object,
        required: true
    },

    Valor: {
        type: String,
        required: true
    },
    Quantidade: {
        type: Number,
        required: true
    },

    DatadeCadastro: {
        type: Date,
        default: Date.now,
        required: true
    },

    Cadastrador: {
        type: String,
        required: true
    }


})

mongoose.model("produtos", produto)
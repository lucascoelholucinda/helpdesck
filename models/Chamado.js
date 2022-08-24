import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const chamado = new Schema({
    Produto: {
        type: String,
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

    Processo: {
        type: String,
        required: true
    },

    Setor: {
        type: String,
        required: true
    },

    Destinatario: {
        type: String,
        required: true
    },

    Procedimento: {
        type: String,
        required: true
    },

    Origem: {
        type: String,
        required: true
    },

    Empresa: {
        type: String,
        required: true,
    },
    Representante: {
        type: String,
        required: true,
    },

    Telefone: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },


    Titulo: {
        type: String,
        required: true
    },

    Descricao: {
        type: String,
        required: true
    },
    Manutencao: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    Tempoestimado: {
        type: Date,
        required: true
    },

    Criadordochamado: {
        type: String,
        required: true,
    },
    Nomedofuncionario: {
        type: String,
        required: true,
    },
    Foto: {
        type: Object,
        required: true
    },

})

mongoose.model("chamados", chamado)
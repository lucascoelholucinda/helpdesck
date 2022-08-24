import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const funcionario = new Schema({
    Nome: {
        type: String,
        required: true
    },

    Cargo: {
        type: String,
        required: true
    },
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios", 
        require: true

    },
})

mongoose.model("funcionarios", funcionario)
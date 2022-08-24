import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const usuario = new Schema({
    login: {
        type: String,
        required: true
    },
    senha: {
        type: Number,
        required: true
    },
    
})

mongoose.model("usuarios", usuario)
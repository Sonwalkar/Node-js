const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
    longURL:{
        type: String,
        required: true
    },
    shortURL:{
        type: String,
        required: true
    }

}, {timestamps:true})

const ShortURL = mongoose.model("URLS", urlSchema)

module.exports = ShortURL
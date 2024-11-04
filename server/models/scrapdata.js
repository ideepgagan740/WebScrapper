const mongoose = require('mongoose');

const ScrapData = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    description : {
        type: String,
        default: "",
    },
    cmpLogo : {
        type: String,
        default: "",
    },
    url : {
        type: String,
        required: true,
    },
    fbUrl : {
        type: String,
        default: "",
    },
    linkedInUrl : {
        type: String,
        default: "",
    },
    twitterUrl : {
        type: String,
        default: "",
    },
    instaUrl : {
        type: String,
        default: "",
    },
    address : {
        type: String,
        default: "",
    },
    phnNumber : {
        type: String,
        default:"0000000000" ,
    },
    email : {
        type: String,
        default: "",
    },
    screenshot:{
        type: String,
        default: "",}

});

module.exports = mongoose.model('ScrapData', ScrapData);
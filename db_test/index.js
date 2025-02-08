const express = require('express');
const mongoose = require('mongoose');

MONGO_URI = "mongodb://Mehul:dcbfaafa5ab9@localhost:30005"


mongoose.connect(MONGO_URI).then(()=>{
    console.log("We got IT!")
})


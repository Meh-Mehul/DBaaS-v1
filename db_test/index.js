const express = require('express');
const mongoose = require('mongoose');

MONGO_URI = "MONGO_URI"


mongoose.connect(MONGO_URI).then(()=>{
    console.log("We got IT!")
})


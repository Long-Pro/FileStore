var express = require('express')
var router = express.Router()
var File =require('../models/file')
var upload=require('../configMulter')
var path = require('path');

//Uploading a file
router.post('/upload', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  
  let link=`https://${req.host}/fileServer/${req.file.filename}`
  res.send(`<a href='${link}' target='_blank'>${link}</a>`)
})

//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files.length) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  let str=files.reduce((a,b)=>{
    let link=`https://${req.host}/fileServer/${b.filename}`
    return a+`<a href='${link}' target='_blank'>${link}</a> <br/>`
  },'')
  res.send(str)
})
router.get('/:name',function (req, res){
  let {name}=req.params
  res.sendFile(path.join(`${__dirname}/../uploads/${name}`));
})
module.exports = router
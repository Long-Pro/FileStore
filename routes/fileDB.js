var express = require('express')
var router = express.Router()
var File =require('../models/file')
var upload=require('../configMulter')
var path = require('path');
const fs = require('fs');

//Uploading a file
router.post('/upload', upload.single('myFile'), async (req, res, next) => {
  if (!req.file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log(req.file)
  let file=new File()
  let pathFile=`${__dirname}/../uploads/${req.file.filename}`
  var fileX = fs.readFileSync(pathFile);
  var encodeFile = fileX.toString('base64');
  file.name=req.file.filename
  file.fileExtension=req.file.originalname.split('.')[1]
  file.contentType=req.file.mimetype
  file.data=encodeFile
  await file.save();
  fs.unlinkSync(pathFile);
  let link=`https://${req.host}/fileDB/${req.file.filename}`
  res.send(`<a href='${link}' target='_blank'>${link}</a>`)
})

//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log(files)
  let str=files.reduce((a,b)=>{
    let link=`https://${req.host}/fileDB/${b.filename}`
    return a+`<a href='${link}' target='_blank'>${link}</a> <br/>`
  },'')
  res.send(str)
})
router.get('/:name',async function (req, res){
  let {name}=req.params
  let x=await File.findOne({ name: name }).exec();
  let file=new Buffer(x.data,'base64')
  res.contentType('image/jpeg')
  res.send(file)


  // var img = fs.readFileSync(`${__dirname}/../uploads/${name}`);
  // var encode_image = img.toString('base64');
  // let image=  new Buffer(encode_image, 'base64')
  // //res.contentType('image/jpeg');
  // //res.contentType('application/pdf')
  // res.send(image)
  // //res.sendFile(path.join(`${__dirname}/../uploads/${name}`));
})
module.exports = router
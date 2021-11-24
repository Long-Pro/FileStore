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
  let file=new File()
  let pathFile=path.join(`${__dirname}/../uploads/${req.file.filename}`)
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
router.post('/uploadmultiple', upload.array('myFiles', 12), async (req, res, next) => {
  const files = req.files
  console.log(files)
  if (files.length==0) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  //console.log(files)
  let str=''

  for(const item of files) {
    let file=new File()
    let pathFile=path.join(`${__dirname}/../uploads/${item.filename}`)
    var fileX = fs.readFileSync(pathFile);
    var encodeFile = fileX.toString('base64');
    file.name=item.filename
    file.fileExtension=item.originalname.split('.')[1]
    file.contentType=item.mimetype
    file.data=encodeFile
    await file.save();
    fs.unlinkSync(pathFile);
    let link=`https://${req.host}/fileDB/${item.filename}`
    str+=`<a href='${link}' target='_blank'>${link}</a> <br/>`
  }
  res.send(str)
})
router.get('/deleteAll',async function (req, res){
  File.deleteMany({ }, function (err,docs) {
    if (err) return handleError(err);
    console.log(docs)
    res.send(`${docs.deletedCount} records deleted`)
    // deleted at most one tank document
  });
})
router.get('/:name',async function (req, res){
  let {name}=req.params
  let x=await File.findOne({ name: name }).exec();
  let file=new Buffer(x.data,'base64')
  res.contentType('image/jpeg')
  res.send(file)
})

module.exports = router
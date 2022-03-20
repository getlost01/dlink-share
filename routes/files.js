const router=require('express').Router();
const multer=require('multer')
const path=require('path')
const { v4: uuidv4 } = require('uuid');

const File=require('../models/file.js')

let storage = multer.diskStorage({
    destination:(res,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
       const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
       cb(null,uniqueName)
    }
})

let upload = multer({
    storage,
    limit:{filesize:1024*1024*100}
}).single('myfile');


router.post('/',(req,res)=>{
   
   //store file
     upload(req,res,async(err)=>{

         //validate request
   if(!req.file){
    return res.json({error:'All values are required.'})
       }

          if(err)
           return res.status(500).send({error:err.message})
   
        //store into database
       const file =new File ({
       filename: req.file.filename,
       uuid: uuidv4() ,
       path: req.file.path,
       size: req.file.size
      })
      
      const response=await file.save()
      return res.json({file:`${process.env.App_BASE_URL}/files/${response.uuid}`})


     })

})

router.post('/send',async(req,res)=>{
   
   const{uuid,emailTo,emailFrom} = req.body
   //validate request
   if(!uuid || !emailTo  ||!emailFrom)
        return res.status(422).send({error:'All field are requied'})
   
   // get data from data base
   try {
   const file =await File.findOne({uuid: uuid})
   if(file.sender){
      return res.status(422).send({error:'Email already sent.'})
   }
   file.sender = emailFrom
   file.reciver= emailTo
   const response =await file.save()
   
   //send email
   const sendMail =require('../services/emailservice')
   sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailtemp')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: (parseInt(file.size)/1024).toFixed(2) +'KB',
                expires: '24 hours'
      })
   }).then(() => {
      return res.json({success: true})
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    })
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}
})

module.exports=router

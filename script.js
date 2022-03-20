const File = require('./models/file')
const fs =require('fs')
const connectdb =require('./config/db')
connectdb()

async function fetchd(){
    const dlimit = 24*60*60*1000
    const pastdate = new Date(Date.now() - dlimit)
    const files=await File.find({createdAt:{$lt:pastdate}})
    if(files.length){
        for(const file of files)
        {
            try
            {
            fs.unlinkSync(file.path)
            await file.remove()
            console.log(`Succesfully file ${file.filename} deleted after 24hrs `)
            } catch(err){
                console.log(`Error while deleting file ${err}`)
            }
        }
        console.log('Job of deletion done!')   
    }
}


fetchd().then(()=>{
    process.exit()
})
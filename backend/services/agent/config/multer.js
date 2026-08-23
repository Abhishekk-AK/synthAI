import path from "path"
import fs from "fs"
import multer from "multer"

const uploadDir=path.resolve("./config/temp")
//console.log(uploadDir)

if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage=multer.diskStorage({
    destination(req,file,callBack) {
        callBack(null,uploadDir)
    },
    filename(req,file,callback) {
        callback(null,`${Date.now()}-${file.originalname}`)
    }
})

//fiter to accept only image, pdf
const fileFilter=(req,file,callback)=> {
    if(file.mimetype=="application/pdf" || file.mimetype.startsWith("image/")) {
        callback(null,true)
    }
    else {
        callback(new Error("Only Pdf and Images are allowed."))
    }
}

export default multer({
    storage,
    fileFilter,
    limits:{
        fileSize:20*1024*1024
    }
})
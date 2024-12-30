// multer is used for creating the middleware
import multer from 'multer'

// there are two ways of storing 
// one is the disk storage
// second is memory storage 

// here we arre using the disk storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // the public we made to store all our files 
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' 
      + Math.round(Math.random() * 1E9)
      // there are various methods which are provided by the file 
      cb(null , file.originalname)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ 
    storage,
  })
import multer from "multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images"')
    },
    filename: function (req, file, cb) {
        let date=new Date()
        let filename = date.getTime() + "_" + file.originalname
        req.body.imageFilename=imageFilename
      cb(null, imageFilename)
    }
  })
  
  export const bodyPaser = multer({ storage: storage }).any()


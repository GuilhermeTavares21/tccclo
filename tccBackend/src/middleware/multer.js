const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('aws-sdk/clients/s3')
const crypto = require('crypto')

const storageS3 = new s3({
    accessKeyId: "AKIAV5W6NBTXQOYVFVOC",
    secretAccessKey: "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",
    region: "sa-east-1"
})
module.exports = multer({
    storage: multerS3({
      s3: storageS3,
      bucket: "clobrechos",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) {
            cb(err, file.fieldname)
          }
          const key = `${hash.toString('hex')}-${file.originalname}`
          cb(null, key)
        })
      }
    }),
    limits: {
      fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]
  
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    }
  })

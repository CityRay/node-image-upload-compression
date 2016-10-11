/*
* @Author: RayLin
* @Date:   2016-10-07 11:45:33
* @Last Modified by:   RayLin
* @Last Modified time: 2016-10-11 15:10:53
*/

const multer  = require('multer');
const uuid = require('uuid');
const path = require('path');

const maxSize = 10 * 1024 * 1024; // 10mb

const storage = multer.diskStorage({
    // set save path
    destination: function (req, file, cb) {
        cb(null, path.join('./public/uploads/normal'));
    },
    // file rename
    filename: function (req, file, cb) {
        let ext = '.jpg';
        if (file.mimetype === 'image/png') {
            ext = '.png';
        } else if (file.mimetype === 'image/gif') {
            ext = '.gif';
        }
        cb(null, file.fieldname + '-' + uuid.v4() + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function(req, file, cb) {
        const patt = /(image\/)(gif|jpe?g|png)$/i;
        if (!patt.test(file.mimetype)) {
            let err = new Error('Current file mimetype does not match');
            err.code = 'Current file mimetype does not match';
            err.fileName = file.originalname;
            return cb(err, false);
        }
        cb(null, true);
    }
});

// 對應 input name, 並限制上傳檔案數
const cpUpload = upload.fields([
    { name: 'avatar', maxCount: 5 },
    { name: 'gallery', maxCount: 8 }
    ]);

module.exports = cpUpload;

/*
* @Author: RayLin
* @Date:   2016-10-07 11:50:30
* @Last Modified by:   RayLin
* @Last Modified time: 2016-10-11 15:14:49
*/

const path = require('path');
const express = require('express');
const router = express.Router();
// const im = require('imagemagick');

const imageUpload = require('./libs/imageUpload');
const Imgmin = require('./libs/imgMin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

const fs = require('fs');

const QUALITY = 75;
const dirOptimize = path.join(__dirname, 'public/uploads/optimize/');
const dirNormal = path.join(__dirname, 'public/uploads/normal/');
if (!fs.existsSync(dirOptimize)){
    fs.mkdirSync(dirOptimize);
}
if (!fs.existsSync(dirNormal)){
    fs.mkdirSync(dirNormal);
}

/**
 * test sendHello
 * http://127.0.0.1:3000/v1/hello/Ray
 */
let prepareHello = function(req, res, next) {
    req.hello = "Hello! " + req.params.id;
    next();
}
let sendHello = function(req, res) {

    res.send(req.hello);
}
router.route('/hello/:id').get(prepareHello, sendHello);

/**
 * test parse body
 */
let printBody = function(req, res) {
    console.log(req.body);
    res.send('Done!');
};
router.route('/body').post(printBody);

/**
 * image upload
 */
function uploadImg(req, res, next) {
    imageUpload(req, res, function(err) {
        if (err) {
            res.status(422).json(err);
            return;
        }

        // console.log(req.files['avatar']);

        if (req.files['avatar'] && req.files['avatar'].length > 0) {
            // 圖片壓縮品質 0 - 100
            const imgmin = new Imgmin(QUALITY);

            let imgres = req.files['avatar'].map(function(img) {
                return imgmin.compressImage((dirNormal + img.filename), (dirOptimize + img.filename)).then((data) => {
                    // console.log(data);
                    return {
                        code: 'Success',
                        filename: img.filename,
                        mimetype: img.mimetype,
                        path: '//' + HOST + ':' + PORT + '/public/uploads/optimize/' + img.filename
                    };
                }).catch((err) => {
                    console.log(err);
                    return {
                        code: 'Failed',
                        filename: img.filename,
                        mimetype: img.mimetype,
                        message: err
                    };
                });
            });

            Promise.all(imgres).then((data) => {
                // console.log(data);
                res.json({
                    code: 'Success',
                    files: data
                });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 'Failed',
                    message: 'Files Saved Error'
                });
            });
        } else {
            res.status(500).json({
                code: 'Failed',
                message: 'Files Error'
            });
        }
    });
}
router.route('/uploadImg').post(uploadImg);

module.exports = router;

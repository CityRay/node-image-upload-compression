/*
* @Author: RayLin
* @Date:   2016-08-03 17:15:12
* @Last Modified by:   RayLin
* @Last Modified time: 2016-10-11 14:53:19
*/

const fs = require('fs');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle  = require('imagemin-gifsicle');

class Imgmin {
    constructor(quality = 70) {
        this.quality = quality;
    }

    // Receive Buffer Data
    doImgmin(data) {
        if (data) {
            return imagemin.buffer(data, {
                plugins: [
                    imageminMozjpeg({quality: this.quality}),
                    imageminPngquant({quality: this.quality.toString()}),
                    imageminGifsicle({interlaced: true})
                ]
            });
        }
        return 'error data';
    }

    readFileAsync(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, function(err, buffer){
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    }

    compressImage(filename, path) {
        var getImg = this.readFileAsync(filename);
        return new Promise((resolve, reject) => {
            getImg.then((imgBuffer) => {
                // console.log(imgBuffer);
                this.doImgmin(imgBuffer).then((res) => {
                    // console.log(res);
                    if(res){
                        fs.writeFileSync(path, res);
                        resolve('File Saved');
                    }else {
                        reject('ERROR EMPTY');
                    }
                }).catch((err) => {
                    // console.log(err);
                    reject(err);
                });
            }).catch((err) => {
                // console.error(err);
                reject(err);
            });
        });
    }
}

module.exports = Imgmin;

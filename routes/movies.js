const express     =   require("express");
const router = express.Router();
const validator = require('validatorjs');
const controller_movies = require('../controllers/movies');
const multer = require('multer')
var path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
  
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file), false)
        }
        cb(null, true)
    },
}).single('file');

let movie_validation_rules = {
    movie_name: 'required',
    hero: 'required',
    heroine: 'required',
    release_date: 'required|date',
    director: 'required',
    producer: 'required',
    language: 'required',
    description: 'required',
};

//validate movie
const movie_validator = (req, res, next) => {

    const validation = new validator(req.body, movie_validation_rules);

    //validation success
    validation.passes(() => {
        next();
    })

    //validation failed
    validation.fails(() => {

        //remove uploaded file 
        if (req.file) {
            const { path } = req.file
            controller_movies.removefile(path)
        }

        res.status(412).send({
            success: false,
            message: 'Validation failed',
            error: validation.errors
        });
    });

};

const upload_image = (req, res, next) => {

    try {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({
                    success: false,
                    message: 'Image upload error',
                    error: err
                });
            } else if (err) {

                // An unknown error occurred when uploading.
                res.status(500).send({
                    success: false,
                    message: 'Image upload error',
                    error: err
                });
            } else {
                //file uploaded
                next()
            }

        })
    } catch (err) {
            //internal error
        res.status(500).send({
            success: false,
            message: 'Image upload error',
            error: err
        });
    }
}

router.get('/', controller_movies.get);
router.get('/:id', controller_movies.get);
router.post('/', upload_image, movie_validator, controller_movies.add);
router.delete('/:id', controller_movies.delete);
router.put('/:id', movie_validator, controller_movies.update);

module.exports = router;

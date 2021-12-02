const database = require('../models/database');
const ERROR_MESSAGE = "Internal server error";
const  { unlink } = require('fs');

exports.removefile = async function (filepath) {

    try {
        unlink(filepath, (err) => {
            if (err) {
                return false;
            }
            else {
                return true;
            }
        });
    } catch {
        return false;
    }

}

exports.get = async function (req, res, next) {

    try {

        const id = req.params.id;
        
        let query;
        if (id) {
            query = `SELECT * from movies where id = ${id}`;
        } else {
            query = `SELECT * from movies`;
        }

        //fetch data from database
        database.query(query, function (error, results, fields) {
            if (error) {
                res.status(500).send({
                    success: false,
                    message: ERROR_MESSAGE,
                });
            } else {
                res.status(200).send({
                    success: true,
                    message: "",
                    data :results
                })
            }
            
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: ERROR_MESSAGE,
        });
    }
}

exports.add = async function (req, res, next) {
    try {
        
        const image_file = req.file
        
        const inser_data = {
            movie_name: req.body.movie_name,
            hero: req.body.hero,
            heroine: req.body.heroine,
            release_date: new Date(req.body.release_date),
            director: req.body.director,
            producer: req.body.producer,
            language: req.body.language,
            description: req.body.description,
            image_name: image_file ? image_file.filename :  "",
            added_date: new Date(),
        };
        
        //insert data in database
        database.query('INSERT INTO movies SET ?', inser_data, function (error, results, fields) {
            if (error) {
                // console.log(error)

                //remove uploaded file id error
                if (image_file) {
                    exports.removefile(image_file.path)
                }

                res.status(500).send({
                    success: false,
                    message: ERROR_MESSAGE,
                });
            } else {

                res.status(200).send({
                    success: true,
                    message: "added successfully"
                })
            }
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: ERROR_MESSAGE,
        });
    }
}

exports.delete = async function (req, res, next) {

    try {

        const { id } = req.params;
        if (id) {

            //delete query
            database.query(`DELETE FROM movies WHERE id = ${id}`, function (error, results, fields) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        message: ERROR_MESSAGE,
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        message :`${results.affectedRows} row deleted`
                    })
                }
              })
            
        } else {
            res.status(400).send({
                success: false,
                message: "Invalid id",
            });
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: ERROR_MESSAGE,
        });
    }

}

exports.update = async function (req, res, next) {

    try {

        const { id } = req.params;
        if (id) {

            const update_data = {
                movie_name: req.body.movie_name,
                hero: req.body.hero,
                heroine: req.body.heroine,
                release_date: new Date(req.body.release_date),
                director: req.body.director,
                producer: req.body.producer,
                language: req.body.language,
                description: req.body.description,
            };

            database.query(`UPDATE movies SET ? where id=?`, [update_data, id],  function (error, results, fields) {
                if (error) {
                    res.status(500).send({
                        success: false,
                        message: ERROR_MESSAGE,
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        message :`updated successfully`
                    })
                }
              })
            
        } else {
            res.status(400).send({
                success: false,
                message: "Invalid id",
            });
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: ERROR_MESSAGE,
        });
    }

}
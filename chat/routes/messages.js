var express = require('express');
var router = express.Router();
var fs = require('fs');
const Joi = require("joi");
const Message = require("../models/messages");

/* GET home page. */
var messages = [];

router.get('/', function (req, res, next) {
    Message.findAll().then((result) => {
        res.send(result);
    });
});

router.get('/:ts', function (req, res, next) {
    Message.findAll({ where: { ts: req.params.ts } }).then((response) => {
        if (response === null)
            return res
                .status(404)
                .send("El mensaje con ese TS no ha sido encontrado.");
        res.send(response);
    });
});

router.post('/', function (req, res, next) {
    const { error } = validateMessage(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    Message.create({ ts: req.body.ts, message: req.body.message, author: req.body.author }).then(
        (result) => {
            res.send(result);
        }
    );
});

router.put('/', function (req, res, next) {
    const { error } = validateMessage(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    Message.update(req.body, { where: { ts: req.body.ts } }).then((response) => {
        if (response[0] !== 0) res.send({ message: "El mensaje fue actualizado" });
        else res.status(404).send({ message: "El mensaje con ese TS no ha sido encontrado." });
    });
});

router.delete('/:ts', function (req, res, next) {
    Message.destroy({
        where: {
            ts: req.params.ts
        },
    }).then((response) => {
        if (response === 1) res.status(204).send();
        else res.status(404).send({ message: "El mensaje con ese TS no ha sido encontrado." });
    });;
});

const validateMessage = (message) => {
    const schema = Joi.object({
        ts: Joi.string().required(),
        message: Joi.string().min(5).required(),
        author: Joi.string().required()
    });

    return schema.validate(message);
};

module.exports = router;
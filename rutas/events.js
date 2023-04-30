const express = require('express');
const ruta = express.Router();
const Joi = require('joi');

class Event {
    constructor(id, title, date, hour, place, speakerName){
        this.id = id;
        this.title = title;
        this.date = date;
        this.hour = hour;
        this.place = place;
        this.speakerName = speakerName;
        this.listStudents = [];
    }
}

let events = [];
let idEvent = 1;

ruta.post('/', (req, res)=>{
    const date = req.body.date;
    const hour = req.body.hour;
    const place = req.body.place;
    const {error, value} = validateEvent(req.body.title, date, hour, place, req.body.speaker);
    if(!error){

        if(validateDatePlace(date, hour, place)){
            let event = new Event;
            event.id = idEvent;
            event.title = value.title;
            event.date = value.date;
            event.hour = value.hour;
            event.place = value.place;
            event.speakerName = value.speaker;
    
            events.push(event);
            res.send(event);
            idEvent++;
            return;
        }else{
            res.send('"date", "time" and "place" are already recorded');
            return;
        }
    }else{
        const message = error.details[0].message;
        res.send(message);
        return;
    }
});


ruta.get('/', (req, res)=>{
    res.send(events);
});

ruta.get('/:id', (req, res)=>{
    const id = req.params.id;
    let event = existeEvento(id);
    if(!event){
        res.status(404).send(`The event ${id} does not exist`);
        return;
    }
    res.send(event);
    return; 
});

ruta.put('/:id', (req, res)=>{
    const date = req.body.date;
    const hour = req.body.hour;
    const place = req.body.place;
    const event = existeEvento(req.params.id);
    if(!event){
        res.status(404).send(`The event ${req.params.id} does not exist`);
        return;
    }
    const {error, value} = validateEvent(req.body.title, date, hour, place, req.body.speaker);
    if(!error){
        if(!validateDatePlace(date, hour, place)){
            res.send('"date", "time" and "place" are already recorded');
            return;
        }else{
            event.title = value.title;
            event.date = value.date;
            event.hour = value.hour;
            event.place = value.place;
            event.speakerName = value.speaker;

            res.send(event);
            return;
        }
    }else{
        const message = error.details[0].message;
        res.status(404).send(message);
    }
});

ruta.delete('/:id', (req, res)=>{
    const id = req.params.id;
    let event = existeEvento(id);
    if(!event){
        res.status(404).send(`The event ${id} does not exist`);
        return; 
    }
    const index = events.indexOf(event);
    events.splice(index, 1);
    res.send(event);
    return;
});

function existeEvento(id){
    return (events.find(e => e.id === parseInt(id)));
}
function validateEvent(ti, da, ho, pla, spe){
    const schema = Joi.object({
        title: Joi.string()
                .min(3)
                .max(20)
                .required(),
        date: Joi.string()
                .required(),
        hour: Joi.string()
                .required(),
        place: Joi.string()
                .min(3)
                .max(20),
        speaker: Joi.string()
                    .min(3)
                    .max(25)
    });
    return schema.validate({title:ti, date:da, hour:ho, place:pla, speaker:spe});
};

function validateDatePlace(da, ho, pla){
    let validate = true;
    events.forEach(e => {
        // Si se cumple, no son validos los parámetros
        if((e.date === da) && (e.hour === ho) && (e.place === pla)){
            validate = false;
        }
    });
    return validate;
}

const objEvents = {ruta, events};
module.exports = objEvents;
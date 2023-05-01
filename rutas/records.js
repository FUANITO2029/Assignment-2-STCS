const express = require('express');
const ruta = express.Router();
const objStudents = require('./students');
const objEvents = require('./events');

class Record{
    constructor(eve_id, std_id){
        this.eve_id = eve_id;
        this.std_id = std_id;
    }
}

let records = [];

ruta.post('/', (req, res)=>{
    idStudent = req.body.idStudent;
    idEvent = req.body.idEvent;

    // Valida que exite el idStudent y idEvent 
    const event = objEvents.events.find(e => e.id === parseInt(idEvent));
    const student = objStudents.students.find(s => s.id === parseInt(idStudent));

    if(!event){
        res.status(404).send(`The event "${idEvent}" does not exist`);
        return;
    }
    if(!student){
        res.status(404).send(`The student "${idStudent}" does not exist`);
        return;
    }

    // Valida que el estudiante no esté registrado en el evento
    const StudentInEvent = event.listStudents.find(s => s === idStudent);
    if(StudentInEvent){
        res.send(`The student "${idStudent}" is already registered in the event ${idEvent}`);
        return;
    }else{
        event.listStudents.push(idStudent);
    
        let record = new Record;
        record.eve_id = idEvent;
        record.std_id = idStudent;
    
        records.push(record);
        res.send(record);
        return;
    }
});


ruta.get('/', (req, res)=>{
    res.send(records);
});

ruta.delete('/', (req, res)=>{
    const idEvent = req.body.idEvent;
    const idStudent = req.body.idStudent;
     // Valida que exite el idStudent y idEvent 
     const event = objEvents.events.find(e => e.id === parseInt(idEvent));
     const student = objStudents.students.find(s => s.id === parseInt(idStudent));
 
     if(!event){
         res.status(404).send(`The event "${idEvent}" does not exist`);
         return;
     }
     if(!student){
         res.status(404).send(`The student "${idStudent}" does not exist`);
         return;
     }
    
    // Valida que el estudiante no esté en el evento
    const StudentInEvent = event.listStudents.find(s => s === idStudent);
    if(!StudentInEvent){
        res.send(`The student "${idStudent}" is not registered in the event ${idEvent}`);
        return;
    }else{
        const indexStudentEvent = event.listStudents.findIndex(s => s === idStudent);
        event.listStudents.splice(indexStudentEvent, 1);

        for(let i=0; i<records.length; i++){
            if(records[i].eve_id === idEvent && records[i].std_id === idStudent){
                const result = records.splice(i, 1);
                res.send(result);
                return;
            }
        }
        return;
    }
});

module.exports = ruta;
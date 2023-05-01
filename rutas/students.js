const express = require('express');
const ruta = express.Router();
const Joi = require('joi');

class Student {
    constructor(id, name, email, career){
        this.id = id;
        this.name = name;
        this.email = email;
        this.career = career;
    } 
}

let students = [];
let idStudent = 1;

ruta.post('/', (req, res)=>{
    // Validate that the email does not exist
    if(existEmail(req.body.email)){
        res.send('"email" already exists');
        return;
    }
    const {error, value} = validateStudent(req.body.nombre, req.body.email, req.body.career);
    if(!error){
        let student = new Student;
        student.id = idStudent;
        student.nombre = req.body.nombre;
        student.email = req.body.email;
        student.career = req.body.career;

        students.push(student);
        res.send(student);
        idStudent++;
        return;
    }
    const message = error.details[0].message;
    res.status(400).send(message);
    return;
});

ruta.get('/', (req, res)=>{
    res.send(students);
});

ruta.get('/:id', (req, res)=>{
    const id = req.params.id;
    let student = existStudent(id);
    if(!student){
        res.status(404).send(`The student ${id} does not exist`);
        // Devuelve el estado HTTP 404
        return;
    }
    res.send(student);
});

ruta.put('/:id', (req, res)=>{
    const id = req.params.id;
    let student = existStudent(id);
    if(!student){
        res.status(404).send(`The student ${id} does not exist`);
        return;
    }
    if(student.email !== req.body.email){
        if(existEmail(req.body.email)){
            res.send('"email" already exists');
            return;
        }
    }
    const {error, value} = validateStudent(req.body.nombre, req.body.email, req.body.career);
    if(!error){
        // Actualiza el nombre
        student.nombre = value.nombre;
        student.email = value.email;
        student.career = value.career;
        res.send(student);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return; 
});

ruta.delete('/:id', (req, res)=>{
    const student = existStudent(req.params.id);
    if(!student){
        res.status(404).send(`The student ${req.params.id} does not exist`);//Deveulve el estado HTTP
        return;
    } 

    const index = students.indexOf(student);
    students.splice(index, 1);// Elimina el usuario en el índice
    res.send(student); // Se responde con el usuario eliminado
    return;
});


function existStudent(id){
    return (students.find(s => s.id === parseInt(id)));
}

function validateStudent(nom, e, car){
    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required(),
        email: Joi.string()
                .email()
                .required(),
        career: Joi.string()
                .min(3)
                .required()
    })
    return schema.validate({nombre:nom, email:e, career:car});
};

function existEmail(e){
    for(let i=0; i<students.length; i++){
        if(e === students[i].email){
            return 1;
        } 
    }
    return 0;
}

const objStudents = {ruta, students};
module.exports = objStudents;
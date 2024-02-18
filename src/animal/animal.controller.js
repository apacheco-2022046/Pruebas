'use strict'

import User from '../user/user.model.js'
import { checkPassword } from '../utils/validator.js'
import Animal from './animal.model.js'
import {checkUpdate } from '../utils/validator.js'

export const test = (req, res) => {
    return res.send({ message: 'Function test is reunning' })
}


export const save = async (req, res) => {
    try {
            //Capturar La data
            let data = req.body
            //Validar que el keeeper exista (Buscar a la DB)
            let user  = await User.finOne({_id: data.keeper})
            if(!user) return res.status(404).send({message:'keeper not found'})
            //Crear la instanciadl animal
        let animal = new Animal (data)
            //Guardar el animal
            await animal.save()
            //Responder si todo sale bien
            return res.send({message:'Animal saved successfully'})
    } catch (err) {
       console.error(err)
       return res.status(500).send({message: 'Error saving animal'})
    }

} 


export const get = async(req, res) =>{
    try {
       let animals = await Animal.find()
       console.log(animals.legt)
       return res.send({animals}) 
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error getting animals'})
    }
}


export const update = async(req,res)=>{
    try {
        //Capturar el id (a quien voy a actualizar
        let {id} = req.params
        //Capturar la data
        let data = req.body
        //Validar que vengan datos
        let update = checkUpdate(data,false)
        if(!update) return res.status(400).send({message:'Have submitted some data that cannot be update or missing data'})
        //Actualizar
        let updatedAnimal = await Animal.findOneAbdUpdate(
            {_id: id},
            data,
            {new:true}
        ).populate('keeper',['name', 'phone'])
        //Validar la actualizacion
        if(!updatedAnimal) return res.status(404).send({message: 'Animal not found'})
        //Responder si todo sale bien 
    return res.send({message:'Error updating animal'})
    } catch (erro) {
        
    }
}

export const deleteA = async(req, res)=>{
    try {
        //x verificar si tiene una reunion en proceso x
        //Capturar el id del animal a eliminar
        let {id} = req.params
        //Eliminar
        let deletedAnimal = await Animal.deleOne({_id:id})
        //Validar que se elimino
        if(deletedAnimal.deletedCount ==0) return res.status(400).send({message:'Animal not found, not deleted '})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting animal'})
        
    }
}



export const search = async (req,res)=>{
    try {
        //Obtener el parametro de busqueda
        let {search} = req.body
        //Buscar
        let animals = await Animal.find(
            {name:search}
        ).populate('keeper',['name', 'phone'])
        //Validar la respuesta 
        if(animals.legt==0) return res.status(400).send({message:'Animals not found'})
        //Responder si todo sale bien
    return res.send({message:'Animals found', animals})
    } catch (err) {
        
    }
}


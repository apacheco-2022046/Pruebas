'use strict'


import User from './user.model.js' //Unico que puede ir en mayuscula
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jxt.js'

export const test = (req, res) => {
  return res.send('Hello World')
}

export const register = async (req, res) => { //Solo para clientes
  try {
    //Capturar la informacion del cliente
    let data = req.body
    //Encriptar la contraseña
    data.password = await encrypt(data.password)
    //Asignar el rol para defecto
    data.role = 'CLIENT' // Si viene con otro valor o no viene, lo asigna al role cliente 
    //Cear una instancia del modelo (schema)
    let user = new User(data)
    //Guardar la información <-
    await user.save()
    //Respondo al usuario
    return res.send({ message: 'Registered successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error registering user', err })
  }
}


export const login = async (req, res) => {
  try {
    //Capturar la informacion
    let { username, password } = req.body
    //Validar que el usuario existe
    let user = await User.findOne({ username: username })
    //Verifica que la contraseña colincida
    if (user && await checkPassword(password, user.password)) {
      let loggedUser = {
        uid: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      }


      let token = await generateJwt(loggedUser)

      return res.send({
        message: `Welcome ${user.name}`, loggedUser,
        token
      })


    }

    if (!user) return res.status(404).send({ message: 'Invalid credentials' })
    //Responder (dar acceso)
    return res.send({ message: `welcome ${user.name}` })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Failed to login' })

  }
}



export const update = async (req, res) => {
  try {
    //Obtener el ID del usuario a actualizar
    let { id } = req.params
    //Obtener datos que vamos a actualizar
    let data = req.body
    //Validar si trae datos a actualizar
    let update = checkUpdate(data, id)
    if (!update) return res.status(400).send({ message: 'Have summitted some data that cannot be update' })
    //Validar si tiene permisos (tokennizacion)
    //Actualizar en la DB
    let updateUser = await User.findOneAndUpdate(
      { _id: id },
      data, //Datos que va a actualizar
      { new: true }  //Objeto de la Db
    )
    //Validar si se actualizo 
    if (!updateUser) return res.status(401).send({ message: 'User not found and not updated' })
    //Responder al usuario
    return res.send({ message: 'Updated user', updateUser })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error uddating account' })
  }
}



export const deleteU = async (req, res) => {
  try {
    // Obtener el id
    let { id } = req.params
    // Validar si está logeado y es el mismo X HOY NO LO VEMOS X
    // Eliminar (deleteOne (Solo Elimina y no devuelve el documento)/ findOneAndDelete (Devuelve el documento eliminado))
    let deletedUser = await User.findOneAndDelete({ _id: id })
    // Verificar quye se eliminó
    if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
    // Responder
    return res.send({ message: `Account with username ${deletedUser} deleted successfully` })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error deleting account' })
  }
}
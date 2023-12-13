import db from '../config/Database.js'
import response from '../config/Response.js'
import path from "path"
import fs from "fs"
import util from 'util'

const query = util.promisify(db.query).bind(db)

async function getUsers(req, res) {
    const isWhere = req.body.id ? `WHERE id = ${req.body.id}` : ''
    const sql = `SELECT * FROM users ${isWhere}`
    const result = await query(sql)
    if (result.length === 0) return response(400, req.body, 'Data Not Found', res)
    response(200, result, 'Get data success', res)
    // res.send(result)
}

async function createUser(req, res) {
    if (!req.files) return response(400, req.files, 'Files Not Found', res)

    const myImg = req.files.img
    const fileName = myImg.md5 + Date.now() + path.extname(myImg.name)
    const allowedType = ['.png', '.jpg', '.jpeg']
    const typeByReq = path.extname(myImg.name).toLowerCase()

    if (myImg.data.length > 5000000) return response(400, myImg.data.length, 'Max Size 5 MB', res)
    if (!allowedType.includes(typeByReq)) return response(400, req.body.file, `Type File ${typeByReq} Not Allowed`, res)

    myImg.mv(`./public/images/${fileName}`)

    const { name, email, gender } = req.body
    if (!name || !email || !gender) return response(400, req.body, 'Invalid Data', res)

    const sql = 'INSERT INTO users (name, email, gender, uploadImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())'
    const result = await query(sql, [name, email, gender, fileName])
    if (result?.affectedRows === 0) return response(500, req.body, 'Insert data failed', res)
    response(200, result, 'Insert data success', res)
}

async function deleteUser(req, res) {
    if (!req.body.id) return response(400, req.body, 'Data Id Not Found', res)

    const getUser = 'SELECT * FROM users WHERE id = ?'
    const result = await query(getUser, [req.body.id])
    if (result.length === 0) return response(400, req.body, 'Data Not Found', res)

    fs.unlinkSync(`./public/images/${result[0].uploadImage}`)

    const deleteSql = 'DELETE FROM users WHERE id = ?'
    const deleteResult = await query(deleteSql, [req.body.id])
    if (deleteResult.affectedRows === 0) return response(500, req.body, 'Delete data failed', res)
    response(200, deleteResult, 'Delete data success', res)
}

async function updateUser(req, res) {
    const getUser = 'SELECT * FROM users WHERE id = ?'
    const result = await query(getUser, [req.body.id])
    if (result.length === 0) return response(400, req.body, 'Data Not Found', res)

    const fileName = (req.files) ? req.files.img.md5 + Date.now() + path.extname(req.files.img.name) : result[0].uploadImage
    if (req.files) {
        const myImg = req.files.img
        const allowedType = ['.png', '.jpg', '.jpeg']
        const typeByReq = path.extname(myImg.name).toLowerCase()

        if (myImg.data.length > 5000000) return response(400, myImg.data.length, 'Max Size 5 MB', res)
        if (!allowedType.includes(typeByReq)) return response(400, req.body.file, `Type File ${typeByReq} Not Allowed`, res)

        fs.unlinkSync(`./public/images/${result[0].uploadImage}`)
        myImg.mv(`./public/images/${fileName}`)
    }

    const { name, email, gender } = req.body
    if (!name || !email || !gender) return response(400, req.body, 'Invalid Data', res)

    const sql = `UPDATE users SET name = '${name}', email = '${email}', gender = '${gender}', uploadImage = '${fileName}', updatedAt = NOW() WHERE id = ${req.body.id}`
    const resultUpdate = await query(sql)
    if (resultUpdate.affectedRows === 0) return response(500, req.body, 'Update data failed', res)
    response(200, resultUpdate, 'Update data success', res)
}

export default { getUsers, createUser, updateUser, deleteUser }
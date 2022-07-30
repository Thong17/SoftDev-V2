const mongoose = require('mongoose')
const Role = require('../models/Role')
const Store = require('../models/Store')
const User = require('../models/User')

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
})
.then(async () => {
    const totalUser = await User.count()
    if (totalUser > 0) return

    const { preRole } = require('../constants/roleMap')
    let privilege
    let username = 'Admin'
    Object.keys(preRole).forEach(menu => {
        privilege = {
            ...privilege,
            [menu]: {}
        }
        Object.keys(preRole[menu]).forEach(route => {
            privilege[menu][route] = true
        })
    })

    const role = await Role.create({ name: { English: 'Super Admin' }, privilege, description: 'Default role generated by system', isDefault: true })
    await User.create({
        username,
        password: `${username}${process.env.DEFAULT_PASSWORD}`,
        role: role._id,
        isDefault: true
    })
    await Store.create({})
    console.log('Mongo Client is connected...')
})
.catch((error) => console.error(error))

const {Schema, model, models} = require('mongoose')

const requiredPermissionsSchema = new Schema({
    // guildID-commandName
    _id: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    },
})

const name = "required-permissions"
module.exports = models[name] || model(name, requiredPermissionsSchema)
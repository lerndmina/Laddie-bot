const {Schema, model, models} = require('mongoose')

const cooldownSchema = new Schema({
    // They key from cooldowns.getCooldownKey
    _id: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
})

const name = 'Cooldowns'
module.exports = models[name] || model(name, cooldownSchema)
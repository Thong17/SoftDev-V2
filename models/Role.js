const mongoose = require('mongoose')
const User = require('./User')

const schema = mongoose.Schema(
    {
        name: {
            type: Object,
            index: {
                unique: true,
            },
            required: [true, 'Name is required!']
        },
        description: {
            type: String
        },
        privilege: {
            type: Object,
            required: [true, 'Privilege is required!']
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('Role', schema)
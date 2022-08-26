const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        displayName: {
            type: String,
            require: true,
            index: {
                unique: true
            }
        },
        fullName: {
            type: String,
        },
        contact: {
            type: String,
        },
        picture: {
            type: mongoose.Schema.ObjectId,
            ref: 'Picture'
        },
        dateOfBirth: {
            type: String,
        },
        address: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        tags: {
            type: String,
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', async function (next) {
    try {
        this.tags = `${this.lastName}${this.firstName}${this.phone}${this.address}`.replace(/ /g,'')
        next()
    } catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('Customer', schema)
const Drawer = require('../models/Drawer')
const Payment = require('../models/Payment')
const Transaction = require('../models/Transaction')
const response = require('../helpers/response')
const { failureMsg } = require('../constants/responseMsg')
const { extractJoiErrors, readExcel, calculatePaymentTotal, calculateReturnCashes } = require('../helpers/utils')
const { createPaymentValidation, checkoutPaymentValidation } = require('../middleware/validations/paymentValidation')
const Reservation = require('../models/Reservation')


exports.index = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 0
    const search = req.query.search?.replace(/ /g,'')
    const field = req.query.field || 'tags'
    const filter = req.query.filter || 'createdAt'
    const sort = req.query.sort || 'asc'
    
    let filterObj = { [filter]: sort }
    let query = {}
    if (search) {
        query[field] = {
            $regex: new RegExp(search, 'i')
        }
    }
    
    Payment.find({ isDeleted: false, ...query }, async (err, categories) => {
        if (err) return response.failure(422, { msg: failureMsg.trouble }, res, err)

        const totalCount = await Payment.count({ isDisabled: false })
        return response.success(200, { data: categories, length: totalCount }, res)
    })
        .skip(page * limit).limit(limit)
        .sort(filterObj)
}

exports.detail = async (req, res) => {
    Payment.findById(req.params.id, (err, payment) => {
        if (err) return response.failure(422, { msg: failureMsg.trouble }, res, err)
        return response.success(200, { data: payment }, res)
    }).populate('createdBy').populate('customer', 'displayName point').populate('transactions')
}

exports.create = async (req, res) => {
    const body = req.body
    const { error } = createPaymentValidation.validate(body, { abortEarly: false })
    if (error) return response.failure(422, extractJoiErrors(error), res)

    if (!req.user.drawer) return response.failure(422, { msg: 'Open drawer first!' }, res)

    try {
        const countPayment = await Payment.count()
        const invoice = 'INV' + countPayment.toString().padStart(5, '0')
        const buyRate = req.user.drawer.buyRate
        const sellRate = req.user.drawer.sellRate

        const transactions = await Transaction.find({ _id: { '$in': body.transactions } })
        const { total, subtotal, rate } = calculatePaymentTotal(transactions, body.services, body.vouchers, body.discounts, { buyRate, sellRate })

        const mappedBody = {
            ...body,
            total,
            subtotal,
            rate,
            invoice,
            drawer: req.user.drawer?._id,
            createdBy: req.user.id,
            customer: body.customer
        }

        Payment.create(mappedBody, async (err, payment) => {
            if (err) return response.failure(422, { msg: failureMsg.trouble }, res, err)
            if (!payment) return response.failure(422, { msg: 'No payment created!' }, res, err)

            let data = await payment.populate('customer')
            data = await payment.populate('transactions')
            data = await payment.populate('createdBy', 'username')
            response.success(200, { msg: 'Payment has created successfully', data }, res)
        })
    } catch (err) {
        return response.failure(422, { msg: failureMsg.trouble }, res, err)
    }
}

exports.update = async (req, res) => {
    const body = req.body

    try {
        const id = req.params.id
        let data = await Payment.findByIdAndUpdate(id, body, { new: true })
        if (data.status) return response.failure(422, { msg: 'Payment has already completed' }, res)

        const listTransactions = data?.transactions
        if (body.transaction) listTransactions.push(body.transaction.id)
        
        const transactions = await Transaction.find({ _id: { '$in': listTransactions } })
        const { total, subtotal } = calculatePaymentTotal(transactions, data.services, data.vouchers, data.discounts, data.rate)

        data.total = total
        data.subtotal = subtotal
        data.transactions = listTransactions
        data.save()
        data = await data.populate('customer')
        data = await data.populate('transactions')
        data = await data.populate('createdBy', 'username')
        response.success(200, { msg: 'Payment has updated successfully', data }, res)
    } catch (err) {
        return response.failure(422, { msg: failureMsg.trouble }, res, err)
    }
}

exports.checkout = async (req, res) => {
    const body = req.body
    const { error } = checkoutPaymentValidation.validate(body, { abortEarly: false })
    if (error) return response.failure(422, extractJoiErrors(error), res)

    try {
        const id = req.params.id
        const payment = await Payment.findById(id).populate('drawer').populate('transactions')

        calculateReturnCashes(payment?.drawer?.cashes, body.remainTotal, payment.rate)
            .then(async ({ cashes, returnCashes }) => {
                await Drawer.findByIdAndUpdate(payment?.drawer?._id, { cashes })
                const data = await Payment.findByIdAndUpdate(id, { ...body, returnCashes, status: true }, { new: true }).populate('transactions').populate('customer').populate('createdBy', 'username')
                
                for (let i = 0; i < data.transactions.length; i++) {
                    const transaction = data.transactions[i]
                    await Transaction.findByIdAndUpdate(transaction, { status: true })
                }

                if (data.reservation) await Reservation.findByIdAndUpdate(data.reservation, { isCompleted: true })

                response.success(200, { msg: 'Payment has checked out successfully', data }, res)
            })
            .catch(err => response.failure(err.code, { msg: err.msg }, res, err))

    } catch (err) {
        return response.failure(422, { msg: failureMsg.trouble }, res, err)
    }
}

exports._import = async (req, res) => {
    try {
        const payments = await readExcel(req.file.buffer, req.body.fields)
        response.success(200, { msg: 'List has been previewed', data: payments }, res)
    } catch (err) {
        return response.failure(err.code, { msg: err.msg }, res)
    }
}

exports.batch = async (req, res) => {
    try {
        const payments = req.body

        payments.forEach(payment => {
            payment.name = JSON.parse(payment.name)
            payment.icon = JSON.parse(payment.icon)
        })

        Payment.insertMany(payments)
            .then(data => {
                response.success(200, { msg: `${data.length} ${data.length > 1 ? 'branches' : 'branch'} has been inserted` }, res)
            })
            .catch(err => {
                return response.failure(422, { msg: err.message }, res)
            })
    } catch (err) {
        return response.failure(422, { msg: failureMsg.trouble }, res)
    }
}


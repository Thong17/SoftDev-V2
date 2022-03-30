const response = require('../../helpers/response')
const { createHash, verifyToken, issueToken } = require('../../helpers/utils')

exports.hash = (req, res, next) => {
    const token = req.headers['x-access-token'] || ''
    const hash = req.headers['x-access-hash']
    const timestamp = req.headers['x-access-ts']
    const body = req.body

    if (!hash || !timestamp) return response.failure(400, { msg: 'Missing hash requirement!' }, res)

    try {
        const str = JSON.stringify(body) + process.env.HASH_SECRET + timestamp + token

        const hashed_str = createHash(str)
        if (hashed_str !== hash) return response.failure(400, { msg: 'Hashed body is invalid!' }, res)

        next()
    } catch (err) {
        return response.failure(400, { msg: 'Something went wrong while checking hash!' }, res, err)
    }
}

exports.auth = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) return response.failure(411, { msg: 'Token is required!' }, res)
    verifyToken(token, process.env.TOKEN_SECRET)
        .then(decoded => {
            req.user = decoded
            next()
        })
        .catch(err => {
            if (!err.data) return response.failure(401, { msg: 'Token is invalid!' }, res, err)

            const data = err.data
            issueToken(data, process.env.TOKEN_SECRET, 60)
                .then(token => {
                    return response.failure(401, { msg: 'Token is expired!', refresh_token: token }, res)
                })
                .catch(err => {
                    return response.failure(401, { msg: 'Something went wrong while generating refresh token!' }, res, err)
                })
        })
}
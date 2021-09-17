const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModal')
const verifyToken = require('../utils/verifyToken')

module.exports = catchAsync(async (req, res, next) => {
    let token
    // Check if `req` has any headers attached
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    /**
     * if no token found, send back an App Error to the client
     */
    if (!token) {
        return next(
            new AppError(
                `You are not logged in, Please authenticate to access.`,
                401
            )
        )
    }

    /**
     * If token is found, check if it's valid
     * Look for the user in the DB
     */
    const verifiedToken = await verifyToken(token)

    const freshedUser = await User.findById(verifiedToken.id)

    /**
     * if no user found, send back an App Error to the client
     */
    if (!freshedUser) {
        return next(
            new AppError(
                `The token belonging to this user, does no longer exists.`,
                401
            )
        )
    }

    if (freshedUser.isPasswordChangedAfter(verifiedToken.iat)) {
        return next(
            new AppError(
                `User recently changed password, please login again.`,
                401
            )
        )
    }

    // finally
    req.user = freshedUser
    next()
})

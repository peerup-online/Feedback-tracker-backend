const { Router } = require('express')
const checkAuth = require('../middlewares/auth.middleware')

const UsersRouter = Router()

// Check for auth headers
UsersRouter.use(checkAuth)

/**
 * ? GET / fetch all users route
 */

module.exports = UsersRouter
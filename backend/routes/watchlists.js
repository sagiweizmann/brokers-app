const express = require('express')
const {
    getWatchLists,
    getWatchList,
    createWatchList,
    deleteWatchList,
    updateWatchList
} = require('../controllers/watchListController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

router.get('/', getWatchLists)


//GET a single workout
router.get('/:id', getWatchList)

//POST a new workout
router.post('/', createWatchList)

//DELETE a workout
router.delete('/:id', deleteWatchList)

//UPDATE a workout
router.patch('/:id', updateWatchList)


module.exports = router

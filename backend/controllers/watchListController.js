const WatchList = require('../models/watchListModel')
const mongoose = require('mongoose')

//GET all watchLists
const getWatchLists = async (req,res) => {
    const user_id = req.user._id

    const watchLists = await WatchList.find({ user_id }).sort({createdAt: -1});

    res.status(200).json(watchLists)
}

//GET a single watchList
const getWatchList = async (req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'WatchList not found'})
    }

    const watchList = await WatchList.findById(id)

    if(!watchList){
        return res.status(404).json({error: 'WatchList not found'})
    }

    res.status(200).json(watchList)
}

//CREATE a new watchList
const createWatchList = async (req,res) => {
    const {title, reps, load} = req.body

    let emptyFields = []

    if(!title){
        emptyFields.push('title')
    }
    if(!load){
        emptyFields.push('load')
    }
    if(!reps){
        emptyFields.push('reps')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
    }

    //Add watchList to database
    try {
        const user_id = req.user._id
        const watchList = await WatchList.create({title, reps, load, user_id})
        res.status(200).json(watchList)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}


//DELETE a watchList
const deleteWatchList = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'WatchList not found'})
    }

    const watchList = await WatchList.findOneAndDelete({_id: id})

    if(!watchList){
        return res.status(404).json({error: 'WatchList not found'})
    }

    res.status(200).json(watchList)
}

//UPDATE a watchList
const updateWatchList = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'WatchList not found'})
    }

    const watchList = await WatchList.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!watchList){
        return res.status(404).json({error: 'WatchList not found'})
    }

    res.status(200).json(watchList)

}
module.exports = {
    getWatchLists,
    getWatchList,
    createWatchList,
    deleteWatchList,
    updateWatchList
}

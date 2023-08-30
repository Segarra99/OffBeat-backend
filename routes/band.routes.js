const router = require("express").Router();
const mongoose = require('mongoose')

/* Requiring all models */
const Band = require('../models/Band.model');

/* POST Route that creates a new band */
router.post('/bands', async(req, res) => {
    const {name, img, description, genres, missing, label, artists, founder} = req.body;

    try{
        let response = await Band.create({name, img, description, genres, missing, label, artists, founder})
        res.json(response)
    }
    catch(error){res.json(error)}
})


/* GET Route that lists all the bands */
router.get('/bands', async(req,res)=>{
    try {
        let allBands = await Band.find().populate('artists');
        res.json(allBands);
    } catch (error) {
        res.json(error);
    }
});

/* GET Route that display info about a specific band */
router.get('/bands/:bandId', async(req, res) => {
    const {bandId} = req.params;
    
    try {
        let foundBand = await Band.findById(bandId).populate('reviews artists founder')
            await foundBand.populate({
                path: 'reviews',
                populate:{
                    path: 'user',
                    model: 'User'
                }
            });
            res.json(foundBand)   ;  
        }
    catch (error) {
        res.json(error);
    }
})

/* PUT Route to update info of a Band */
router.put('/bands/:bandId', async(req,res)=>{
    const {bandId} = req.params;
    const {name, img, description, genres, missing, label, artists} = req.body;
    try{
        let updateBand = await Band.findByIdAndUpdate(bandId, {name, img, description, genres, missing, label, artists}, {new: true});
        res.json(updateBand);
    }
    catch(error){
        res.json(error);
    }
});

/* DELETE Route to delete a band */
router.delete('/bands/:bandId', async(req,res)=>{
    const {bandId} = req.params;
    try{
        await Band.findByIdAndDelete(bandId);
        res.json({message: 'Band deleted'});
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router;
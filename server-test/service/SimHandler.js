'use strict';

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);

    const max = 8;
    const geoData = req.body;
    geoData.features.forEach(d => {
        d.properties.MEANmax_ = Math.floor(Math.random() * Math.floor(max));
    });

    res.json(geoData);
});

module.exports = router;

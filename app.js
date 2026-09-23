const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())

app.get('/kab', cors(), async (req, res) => {
    const code = req.query?.code;
    if (!code) return res.status(400).json({
        error: 'code query required!'
    });
    try {
        const kecamatan = await axios.get(`https://wilayah.id/api/districts/${code}.json`);
        res.status(200).json(kecamatan.data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/desa', cors(), async (req, res) => {
    const code = req.query?.code;
    if (!code) return res.status(400).json({
        error: 'code query required!'
    });
    try {
    const desa = await axios.get(`https://wilayah.id/api/villages/${code}.json`);
    res.status(200).json(desa.data);
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }

});

app.get('/cuaca',cors(), async (req,res) => {
    const code = req?.query.code;
    if(!code) return res.status(200).json({
        error: 'code query required!'
    });
    try {
        const cuaca = await axios.get(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${code}`);
        res.status(200).json(cuaca.data);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
})
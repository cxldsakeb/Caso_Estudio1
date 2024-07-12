const express = require('express');
const path = require('path');
//volarme esto sin json
const fs = require('fs')

const app = express();
const PORT = 3000;

const PUBLIC = path.join(__dirname,'public');
//esto tambien
const CONFIG = path.join(__dirname,'config','test.json');

app.use(express.static(PUBLIC));
//esto tambien
app.use(express.json());

const testConfig = JSON.parse(fs.readFileSync(CONFIG));

app.get('/',(req,res)=>{
    res.sendFile(path.join(PUBLIC,'home.html'));
});
//esta tambien
app.get('/config', (req, res) => {
    res.json(testConfig);
})

app.listen(PORT, () =>{
    console.info(`Server running in port ${PORT}`)
});
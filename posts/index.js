const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res)=>{
    res.send(posts);
});

app.post('/posts', (req, res)=>{
    const id = randomBytes(4).toString('hex');
    const title = req.body.title;
    posts[id]={
        id, title
    };

    axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data:{
            id, title
        }
    }).catch(err=>{
        console.log("Error in posts");
        console.log(err)
    });
    res.status(200).send(posts[id]);
});

app.post('/events', (req, res)=>{
    console.log('recevied event', req.body);

    res.send({});
});

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`Posts Service Listening on ${PORT}`);
});
const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });
    commentsByPostId[req.params.id] = comments;

    axios.post('http://localhost:4005/events', {
        type:'CommentCreated',
        data:{
            id:commentId,
            content,
            postId: req.params.id
        }
    }).catch(err=>{
        console.log("Error in Comments");
        console.log(err)
    });
    res.status(201).send(comments);
});


app.post('/events', (req, res)=>{
    console.log('recevied event', req.body);

    res.send({});
});

const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Comments Service Listening on ${PORT}`);
});
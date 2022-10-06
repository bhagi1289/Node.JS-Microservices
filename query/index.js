const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

var posts = {};

app.get('/posts', (req, res)=>{

    res.send(posts);

});

app.post('/events', (req, res)=>{
    const { type, data } = req.body;
    console.log("received event", type)
    if(type == 'PostCreated'){
        const {id, title} = data;

        posts[id]={id, title, comments:[]}
    }
    if(type == "CommentCreated"){
        const {id, content, postId} = data;
        
        const post = posts[postId];
        post.comments.push({id, content});
    }
    console.log(posts);
    res.send({});
});

const PORT=4002
app.listen(PORT, ()=>{
    console.log(`Query service is listening on ${PORT}`);
});
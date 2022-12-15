const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

//Load in the mongoose models
// const {List,Task} = require('./db/models');
const {List} = require('./db/models/list.model');
const {Task} = require('./db/models/task.model');

//load middleware
app.use(bodyParser.json());

//CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



// ROUTE HANDLERS

// LIST ROUTES
//Get/lists
//purpose: get all lists
app.get('/lists',(req,res) => {
    //We want to return a array of all the list in database
    List.find().then((lists)=>{
        res.send(lists);
    }).catch((e)=>{
        res.send(e);
    });
})

//Post/lists
//purpose: create a lists
app.post('/lists', (req,res)=>{
    //We want to create new list and return the new list document back to the user(which includes id)
    //The list info(fields) will be passed in via json request body
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc)=>{
      //the full list document is returned(incl. id)
      res.send(listDoc);  
    })
});

//PATH/lists/:id
//Purpose: Update a specified list
app.patch('/lists/:id',(req,res)=>{
    //We want to update the specified lists(list document with id in the url) with new values specified in JSON body of the request
    List.findOneAndUpdate({_id: req.params.id},{
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    }); 
})

//DELETE/lists/:id
//Purpose: Delete a specified list
app.delete('/lists/:id',(req,res)=>{
    //We want to delete a specified list
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc)=>{
        res.send(removedListDoc);
    })
});

// GET/lists/:listId/tasks
// Purpose: Get all tasks in a speccific list

//We want to return all the tasks that belong to a specific list(specified by list id)
app.get('/lists/:listId/tasks',(req,res)=>{
    Task.find({
        _listId: req.params.listId
    }).then((tasks)=>{
        res.send(tasks);
    })
});

app.get('/lists/:listId/tasks/:taskId',(req,res)=>{
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task)=>{
        res.send(task);
    })
});

//we want to create a new task in alist specified by listId
app.post('/lists/:listId/tasks',(req,res)=>{
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc)=>{
        res.send(newTaskDoc);
    })
});

//PATCH/lists/:listId/tasks/:taskId
//Purpose: Update an existing task
app.patch('/lists/:listId/tasks/:taskId',(req,res)=>{
    //We want to update an existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    },{
        $set: req.body
    }
    ).then(()=>{
        res.sendStatus(200);
    })
});

//DELETE/lists/:listId/tasks/taskId
//Purpose: Delete a task
app.delete('lists/:listId/tasks/taskId',(req,res)=>{
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc)=>{
        res.send(removedTaskDoc);
    })
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000 ")
})
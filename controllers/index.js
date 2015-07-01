'use strict';


var IndexModel = require('../models/index');
var PostModel = require('../models/post');

var auth = require('./auth');


module.exports = function (router) {
    auth(router);

    var model = new IndexModel();


    router.get('/', function (req, res) {


        res.render('index', model);


    });

    router.get('/test', function(req, res){

	  res.render('test', {say: 'hello'});

	});
    router.get('/post/create', function(req, res){
    	res.render('create_post');
    });
    router.post('/post/create', function(req, res){
		var newPost = new PostModel();
        newPost.title = req.body.title;
        newPost.description = req.body.description;
        newPost.content = req.body.content;
        newPost.creationDate = new Date();
        newPost.save(function(err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
	});
    router.get('/post/list', function(req, res){
        PostModel.find({}, function(err, posts){
            if(err)
                res.send(err);
            res.render('list', {posts: posts});
        });
    });
    router.get('/post/edit/:id', function(req, res){
        PostModel.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.render('edit', post);
        });
    });
    router.post('/post/edit/:id', function(req, res){
        PostModel.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            post.title=req.body.title;
            post.description = req.body.description;
            post.content = req.body.content;
            post.save(function(err, post){
                if(err)
                    res.send(err);
                res.redirect('/post/list');
            });
        });
    });
    router.get('/post/delete/:id', function(req, res){
        PostModel.remove({_id: req.params.id}, function(err, post){
            if(err)
                res.send(err);
            res.redirect('/post/list');
        });
    });

};

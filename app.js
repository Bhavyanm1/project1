var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	flash        = require("connect-flash"),
	methodOverride=require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	user   = require("./models/user");
	
    
mongoose.connect("mongodb+srv://bhavya2399:bhavya2399@cluster0.fkvuo.mongodb.net/v2yelpcamp?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(() => console.log("connected to db!!!!!"))
.catch(error => console.log(error.message));

app.use(flash());

app.use(require("express-session")({
	secret:"lucky",
	resave:false,
	saveUninitialized:false
}));
//mongoose.connect("mongodb://localhost/yelp_camp_v4");
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set("view engine", "ejs");
seedDB();

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	return next();
});

//ROUTES

app.get("/", function(req, res){
    res.render("landing");
});

//register
app.get("/signup",function(req,res){
	res.render("register");
});
app.post("/signup",function(req,res){
	user.register(new user({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp" + user.username);
			res.redirect("/");
		});
	});
});

//login
app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login", passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	
});


//logout
app.get("/logout",function(req,res){
	req.logout();
	res.flash("success","Logged you out")
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first");
	res.redirect("back");
}

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
       }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds",isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
    var newCampground = {name: name, image: image, description: desc,author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// edit
app.get("/campgrounds/:id/edit", function(req, res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.send(err);
		}else{
			res.render("campgrounds/edit",{campground : foundCampground});
		}
	});
});

// updatecampground
app.put("/campgrounds/:id",function(req, res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// delete
app.delete("/campgrounds/:id",function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id=req.user._id;
			   comment.author.username= req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// edit comment
app.get("/campgrounds/:id/comments/:comment_id/edit",function(req,res){
	Campground.findById(req.params.id, function(err, campground){
	  Comment.findById(req.params.comment_id, function(err, foundComm){
		  if(err){
			  res.redirect("back");
		  } else {
			res.render("comments/edit", {campground: campground, comment : foundComm});
		  }
   });
});
});
// update comments
app.put("/campgrounds/:id/comments/:comment_id",function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });

});

// deletecomment
app.delete("/campgrounds/:id/comments/:comment_id",function(req,res){
	 Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
	
});



app.listen(process.env.PORT || 5000, function(){
   console.log("The YelpCamp Server Has Started!");
});
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah",
		author:{
			username:"ADMIN"
		}
		
	},
    {
        name: "Mount McDowell", 
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/The_fountain_red_mountain_birds_2.jpg/300px-The_fountain_red_mountain_birds_2.jpg",
        description: "Mount McDowell (O'odham: S-wegĭ Doʼag, Yavapai: Wi:kawatha), more commonly referred to as Red Mountain, is located on the Salt River Pima-Maricopa Indian Reservation, just north of Mesa, Arizona. It is named after General Irvin McDowell, a Union officer in the Civil War. Its elevation is 2,832 feet (863 m). It is not the same landmark as the McDowell Peak, which is 11 miles (18 km) away to the northwest,Mount McDowell is often called Red Mountain or FireRock, due to its composition of sandstone conglomerate which gives it a distinctive red color that glows during sunset. The deep cleft on its western side (visible in the image at right) is known as Gunsight because of its resemblance to the narrow slot in a fort used for firing at attackers.[3]The mountain is very photogenic but its difficult to photograph up close. The mountain is located on the Salt River Pima-Maricopa Indian Reservation, and has been declared off-limits to hikers, climbers and photographers since the early 1980s, due to vandalism.[4] The eastern side, along Power Road/Bush Highway, has areas where you can pull off the road, and there's a picnic area just north of Granite Reef Dam (Tonto Pass required).The western side of the mountain is along SR 87 (Beeline Highway), which is a busy four-lane road with narrow shoulders. There are several blocked roads onto the Salt River Indian Reservation, where you can pull off for a minute if the traffic is light.",
		author:{
			
			username:"ADMIN"
		}
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah",
		author:{
			
			username:"ADMIN"
		}
    }
];

function seedDB(){
	
   // // Remove all campgrounds
   // Campground.remove({}, function(err){
   //      if(err){
   //          console.log(err);
   //      }
   //      console.log("removed campgrounds!");
         //add a few campgrounds
			// data.forEach(function(seed){
	
			// Campground.create(seed, function(err, campground){
			// if(err){
			// console.log(err)
			// } else {
			// console.log("added a campground");
					
			// //create a comment
			// Comment.create(
			// {
			// text: "This place is great, but I wish there was internet",
			// author: "Homer"
			// }, function(err, comment){
			// if(err){
			// console.log(err);
			// } else {
			// campground.comments.push(comment);
			// campground.save();
			// console.log("Created new comment");
			// }
			// });
				
			// }
			// });
			// });
        // }); 
    //add a few comments
}
module.exports = seedDB;
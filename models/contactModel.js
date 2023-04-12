const mongoose = require('mongoose');
const validator = require('validator');
//const slugify =  require('slugify');

const contactSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'A Contact must have a name'],
        maxlength: [40, 'A Contact name must have less or equal than 40 characters'],
        minlength: [10, 'A Contact name must have more or equal than 10 characters'],
    },
    //slug:String,
    mobile : {
        type : Number,
        required : [true,'A contact must have a number']
    },
    // maxGroupSize : {
    //     type : Number,
    //     required : [true,'A tour must have a group size']
    // },
    // difficulty: {
    //     type: String,
    //     required: [true, 'A tour must have a difficulty'],
    //     enum: {
    //       values: ['easy', 'medium', 'difficult'],
    //       message: 'Difficulty is either: easy, medium, difficult'
    //     }
    //   },

    // ratingsAverage: {
    //     type : Number,
    //     default : 4.5,
    //     max : [5.0,'Rating must be less than or equal to 5'],
    //     min : [0.0,'Rating must be greater than or equal to 0'],
    //     set : val => Math.round(val*10) /10
    // },
    // ratingsQuantity : {
    //     type : Number,
    //     default : 0
    // },
    // price : {
    //     type : Number,
    //     required : [true,'A tour must have a price']
    // },
    // priceDiscount : Number,
    // summary : {
    //     type : String,
    //     trim : true,
    //     required : [true,'A tour must have a description']
    // },
    // description : {
    //     type : String,
    //     trim : true,
    // },
    // imageCover : {
    //     type : String,
    //     required : [true,'A tour must have a cover image']
    // },
    // images : [String],
    // createdAt : {
    //     type : Date,
    //     default : Date.now(),
    //     select : false
    // },
    // startDates : [Date],
    // secretTour : {
    //     type: Boolean,
    //     default : false,
    // },
    // startLocation : {
    //     type : {
    //         type : String,
    //         default : 'Point',
    //         eum : ['Point']
    //     },
    //     coordinates : [Number],
    //     address: String,
    //     description : String
    // },
    // locations : [
    //     {
    //         type : {
    //             type : String,
    //             default : 'Point',
    //             eum : ['Point']
    //         },
    //         coordinates : [Number],
    //         address: String,
    //         description : String,
    //         day : Number
    //     }
    // ],
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true,'A contact must have a owner']
        }
});
contactSchema.index({ "mobile": 1, "owner": 1}, { "unique": true });

// tourSchema.index({price : 1,ratingsAverage : -1});
// tourSchema.index({slug : 1});
// //tourSchema.index({startLocation : '2dsphere'});
// tourSchema.index({ startLocation: '2dsphere' });

// tourSchema.virtual('durationWeeks').get(function() {
//     return this.duration / 7;
// })

// //Virtual Populate
// tourSchema.virtual('reviews',{
//     ref : 'Review',
//     foreignField : 'tour',
//     localField : '_id'
// });


// //Document middleware : runs before .save() and .create() 
// tourSchema.pre('save',function(next){
// this.slug = slugify(this.name, {lower : true});
// next();
// })

// tourSchema.pre('save',async function(next){
//     const guidePromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidePromises);
//     next();
// })

// contactSchema.pre('save',function(next){
//     //this.slug = slugify(this.name, {lower : true});
//     console.log('Saving your document');
//     next();
//     })
// contactSchema.post('save',function(doc,next){
//     //this.slug = slugify(this.name, {lower : true});
//     console.log('Data Saved.... Congrats');
//     next();
//     })


//Query Middleware
// tourSchema.pre(/^find/,function(next){
//     this.find({secretTour : {$ne : true}});

//     this.start = Date.now();
//     next();
// })

// tourSchema.pre(/^find/,function(next){
//     this.populate({
//         path : 'guides',
//         select : '-__v -passwordChangedAt'
//     });
//     next();
// })

// // tourSchema.pre('aggregate',function(next){
// //     this.pipeline().unshift({
// //         $match : {secretTour : {$ne : true}}
// //     });
// //    // console.log(this.pipeline());
// //     next();
// // })


// tourSchema.post(/^find/,function(docs,next){
//     //this.find({secretTour : {$ne : true}});
//     //console.log(docs);
//     console.log(`Query took ${Date.now()-this.start} milliseconds`);
//     next();
// })

//Aggregation Middleware

const Contact = mongoose.model('Contact',contactSchema);

module.exports = Contact;
//const fs = require('fs');
const AppError = require('../utils/appError');
const Contact = require('./../models/contactModel');
//const Tour = require('./../models/contactModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req,file,cb) => {
//     if(file.mimetype.startsWith('image')){
//         cb(null,true);
//     }
//     else{

//         cb(new AppError('Not an image. Please upload an image!',400),false);
//     }
// }

// const upload = multer({
//     storage : multerStorage,
//     fileFilter: multerFilter
// });

// exports.uploadTourImages = upload.fields([
//     { name : 'imageCover' , maxCount : 1},
//     { name : 'images' , maxCount : 3}
// ]);
// // For upload of only one field
// // upload.single || upload.array()

// exports.resizeTourImages = catchAsync(async (req,res,next) => {
//     //console.log(req.files);
//     if(!req.files.imageCover || !req.files.images)
//     return next();
//     // 1) Cover image
//     req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
//     await sharp(req.files.imageCover[0].buffer)
//     .resize(2000,1333)
//     .toFormat('jpeg')
//     .jpeg({quality:90})
//     .toFile(`public/img/tours/${req.body.imageCover}`);

//     //2)Images
//     req.body.images = [];
//     await Promise.all(req.files.images.map(async(file,index) => {
//         const filename = `tour-${req.params.id}-${Date.now()}-${index+1}.jpeg`;
//         await sharp(file.buffer)
//     .resize(2000,1333)
//     .toFormat('jpeg')
//     .jpeg({quality:90})
//     .toFile(`public/img/tours/${filename}`);
//     req.body.images.push(filename);
//     })
//     );
//     console.log(req.body);
//     next();
// });

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/*exports.checkID = (req,res,next,val) => {
    const id = val * 1;
    const tour = tours.find(ele => ele.id===id);
    console.log(`Tour id - ${val}`);
    if(!tour){
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid Id'
    });
    }
    next();
}

exports.checkBody = (req,res,next) => {
    const object =req.body;
    if(!req.body.name||req.body.name.length==0){
    return res.status(400).json({
        status : 'Fail',
        message : 'Insufficient Data!!!'
    });
}
    next();
}
*/

// exports.top5cheap = (req,res,next) => {
//     req.query.limit = 5;
//     req.query.sort = "-ratingsAverage,price";
//     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//     next();
// }
exports.createContact = catchAsync(async (req,res,next)=>{
    const newContact = await Contact.create({
        name : req.body.name,
        mobile : req.body.mobile,
        owner : req.user.id
    });
    res.status(201).json({
            status : 'success',
            data : {
                data : newContact,
            }, 
        });    
});

exports.getContacts = catchAsync(async (req,res,next)=>{
    const owner = req.user.id;
    const user = await Contact.find({owner}).select('-owner');
    res.status(201).json({
            status : 'success',
            data : {
                data : user,
            }, 
        });    
});

exports.deleteContact = catchAsync(async (req,res,next) => {
    const doc = await Contact.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError(`Document with this Id does not exist`,404));
    }
res.status(204).json({
    status : 'success',
    data : null
})
})

// exports.updateContact = catchAsync(async (req,res,next) => {
//     // req.body.owner = req.user.id;
//     const doc = await Contact.findByIdAndUpdate(req.params.id,req.body,{
//         new : true,
//         runValidators : true
//     });
//     doc.save();
//     if(!doc){
//         return next(new AppError('Doc with this Id does not exist',404));
//     }
// res.status(200).json({
//     status : 'success',
//     data : {
//         data : doc,
//     }
// })
// })

// exports.getTours = factory.getAll(Tour);
// exports.getTour = factory.getOne(Tour,{path : 'reviews'})
// exports.createTour = factory.createOne(Tour);
exports.updateContact = factory.updateOne(Contact);
// exports.deleteTour = factory.deleteOne(Tour);

// exports.getTourStats = catchAsync(async (req,res,next) => {
//         const stats = await Tour.aggregate([
//            {
//             $match : {ratingsAverage : { $gte : 4.5}}
//            } ,
//            {
//             $group : {
//                 _id : {$toUpper : '$difficulty'},
//                 numTours : {$sum : 1},
//                 numRatings : {$sum : '$ratingsQuantity'},
//                 avgRating : {$avg : '$ratingsAverage'},
//                 avgPrice : {$avg : '$price'},
//                 minPrice : {$min : '$price'},
//                 maxPrice : {$max : '$price'},
//             }
//            },
//            {
//             $sort : {
//                 avgRating : -1
//             }
//            }
//         ]);
//         res.status(200).json({
//             status : 'success',
//             data : {
//                 stats : stats
//             }
//         })
        
// })


// exports.getMonthlyPlan = catchAsync(async(req,res,next) => {
//         const year = req.params.year * 1;
//         const plan = await Tour.aggregate([
//             {
//                 $unwind : '$startDates'
//             },
//             {
//                 $match : {
//                     startDates : {
//                         $gte : new Date(`${year}-01-01`),
//                         $lte : new Date(`${year}-12-31`),
//                     }
//                 }
//             },
//             {
//                 $group : {
//                     _id : { $month : '$startDates'}, 
//                     numTourStarts : {$sum : 1},
//                     tours : {
//                         $push : '$name'
//                     } 
//                 }
//             },
//             {
//                 $addFields : {
//                     month : '$_id'
//                 }
//             },
//             {
//                 $sort : {
//                     numTourStarts : -1
//                 }
//             },
//             {
//                 $project : {
//                     _id : 0
//                 }
//             },{
//                 $limit : 12
//             }
//         ]);
//         res.status(200).json({
//             status : 'success',
//             data : {
//                 plan
//             }
//         })    
// })

// exports.getToursWithin = catchAsync(async(req,res,next) => {
//     const {distance, latlng, unit} = req.params;
//     const [lat,lng] = latlng.split(',');
//     const radius = unit==='mi' ? distance/3963.2 : distance/6378.1;    
//     if(!lat || !lng){
//         return next(new AppError('Please provide latitude and longitude in the format lat,lng.',400));
//     }
//     const tours = await Tour.find({
//         startLocation : { $geoWithin : { $centerSphere : [[lng,lat],radius]}}
//     });
//     res.status(200).json({
//         status : 'success',
//         results : tours.length,
//         data : {
//             data : tours
//         }
//     })
// })

// exports.getDistances = catchAsync(async(req,res,next) => {
//     const {latlng, unit} = req.params;
//     const [lat,lng] = latlng.split(',');
//     if(!lat || !lng){
//         return next(new AppError('Please provide latitude and longitude in the format lat,lng.',400));
//     }
//     const distances = await Tour.aggregate([
//         {
//             $geoNear : {
//                 near : {
//                     type: 'Point',
//                     coordinates : [lng *1,lat * 1]
//                 },
//                 distanceField : 'distance',
//                 distanceMultiplier : unit ==='km' ? 0.001 : 0.000621371
//             }
//         },
//         {
//             $project : {
//                 distance : 1,
//                 name : 1
//             }
//         }
//     ])
//     res.status(200).json({
//         status : 'success',
//         data : {
//             data : distances
//         }
//     })
// })
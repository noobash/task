const express = require("express");
const authController = require('./../controllers/authController'); 
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
const tourController = require('./../controllers/tourController');
//router.param('id',tourController.checkID)

// router.use('/:tourId/reviews',reviewRouter);
// router.route('/top-5-cheap').get(tourController.top5cheap,tourController.getTours);
// router.route('/tour-stats').get(tourController.getTourStats);

// router
// .route('/monthly-plan/:year')
// .get(authController.protect,
//     authController.restrictTo('admin','lead-guide','guide'),
//     tourController.getMonthlyPlan);

// router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router.use(authController.protect);
router
.route('/')
.get(tourController.getContacts)
.post(tourController.createContact);

router
.route('/:id')
.patch(tourController.updateContact)
.delete(tourController.deleteContact);


//router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);


module.exports = router;
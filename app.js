const express = require("express");
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//Serving static files
app.use(express.static(path.join(__dirname,'public'))); 

// Global Middleware
// Set Security HTTP headers
app.use(helmet());

// Set request limit from single IP to ensure app do not crash/slow-down from attacks
const limiter = rateLimit({
    max : 100,
    windowMs : 60*60*1000,
    message : 'Too many request from this IP, please try again in an hour!'
});
app.use('/api',limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit : '10kb'
}));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist : [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'ratingsAverage',
        'difficulty',
        'price'
    ]
}));

//Development logging
if(process.env.NODE_ENV === 'development')
app.use(morgan('dev'));

// Routes
app.use('/api/v1/contacts',tourRouter);
app.use('/api/v1/users',userRouter);
// app.use('/api/v1/reviews',reviewRouter);

// Handling error for the routes that does not exist.
app.all('*',(req,res,next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server`,404);
    next(err); 
})

// For handling error
app.use(globalErrorHandler);

module.exports = app;


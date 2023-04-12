const AppError = require('./../utils/appError')

const handleCastErrorDB = (err) => { 
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message,400);
}

const handleJWTError = () => { 
    const message = `Invalid token. Please log in again!.`;
    return new AppError(message,401);
}

const handleTokenExpiredError = ()=>{
    const message = `Session Expired! Log in again`;
    return new AppError(message,401);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message,400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message).join('. ');
    const message = `Invalid input data. ${errors}`;
    return new AppError(message,400);
}

const sendErrorDev = (err,res) =>{
    res.status(err.statusCode).json({
        status : err.status,
        error : err,
        message : err.message,
        stack : err.stack
    });
}

const sendErrorProd = (err,res) => {
    // Operational, trusted error: send message to client 
    if(err.isOperational){
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message
    });
}
//Programming or other unknown error: don't leak error details 
else{
    // Log Error
    console.error('Error ',err);
    //Send Generic message
    res.status(500).json({
        status : 'error',
        message : 'Something went very wrong!'
    });
}
}


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }
    else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        //console.log(error.name);
        if(error.name==='CastError'){ 
        error = handleCastErrorDB(error);
        }
        else if(error.code === 11000){ 
        error = handleDuplicateFieldsDB(error);
        }
        else if(error.name === 'ValidationError'){ 
            error = handleValidationErrorDB(error);
            }
        else if(error.name ==='JsonWebTokenError'){
            error = handleJWTError();
        }
        else if(error.name ==='TokenExpiredError'){
            error = handleTokenExpiredError();
        }
        sendErrorProd(error,res);
    }
}
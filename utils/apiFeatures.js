class APIFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    //Sorting
    sort(){
        if(this.queryString.sort){
            const sortStr = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortStr);
        }
        else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    //Field Limiting
    limitFields(){
        if(this.queryString.fields){
            const fieldStr = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldStr);
        }
        else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
    //Pagination
    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
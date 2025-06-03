export default class ApiError extends Error {

    constructor (status, message, errors = []) {

        super(message);
        this.statusCode = status;
        this.message = message;
        this.errors = errors.length ? errors : null;
    }

    
}
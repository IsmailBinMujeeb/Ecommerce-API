export default class ApiResponse {
    constructor(status, message, data = [], errors = []) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.success = status < 400;
    }

    static UserResponse(status, message, data = [], errors = []) {
        if (data.constructor === Object) {
            delete data.password;
            delete data.refresh_token;
            return new ApiResponse(status, message, data, errors);
        } else if (Array.isArray(data) && data.length) {
            const newData = data.map((item) => {
                delete item.password;
                delete item.refresh_token;
                return item;
            });
            return new ApiResponse(status, message, newData, errors);
        }

        return new ApiResponse(status, message);
    }
}

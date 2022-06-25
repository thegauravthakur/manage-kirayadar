export interface APIErrorData {
    code: number;
    messages: string[];
}

class APIError extends Error {
    data: APIErrorData = { code: 200, messages: [] };
    constructor(data: APIErrorData) {
        super(data.messages.join(' | '));
        this.data = data;
        Object.setPrototypeOf(this, APIError.prototype);
    }

    getErrorData() {
        return this.data;
    }
}

export default APIError;

const axios = require("axios");

const FormData = require("form-data");

async function predict(buffer, filename) {

    const form = new FormData();

    form.append(
        "file",
        buffer,
        filename
    );

    const response =
        await axios.post(
            process.env.AI_API + "/predict",
            form,
            {
                headers: form.getHeaders()
            }
        );

    return response.data;
}

module.exports = {
    predict
};
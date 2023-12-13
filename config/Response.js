const Response = (statusCode, data, message, res) => {
    res.status(statusCode)
        .json([
            {
                data,
                statusCode,
                message,
                metaData: {
                    prev: "",
                    next: "",
                    current: ""
                }
            }

        ])
}

export default Response
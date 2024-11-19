const cors = require("cors");

const corsOptions = {
    origin: "https://site-test-selenium.vercel.app/",
    methods: "GET, POST, PUT, DELETE"
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;

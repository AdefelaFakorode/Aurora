const express = require("express");
const app = express();
const port = 4000;
const session = require("express-session");
require("dotenv").config();
const cors = require("cors");

app.get('/', (req, res) => {
    res.send("Aurora")
})

app.use(
    cors({
        origin: "http://127.0.0.1:5173",
        allowHeaders: ["Content-Type", "Authorization"],
        method: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    res.on("finish", () => {
        // the 'finish' event will be emitted when the response is handed over to the OS
        console.log(`Response Status: ${res.statusCode}`);
    });
    next();
});
app.use(express.json());

app.use('/auth', authRoutes);

app.use(validationErrorHandler);
app.use(duplicateErrorHandler);
app.use(dbErrorHandler);
app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000, // 1 hour
        },
    })
);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/user.route';
import countryRoute from './routes/country.route'
import resetPasswordRoute from './routes/resetPassword.route';


const app = express();

// setup bodyparser
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/country", countryRoute);
app.use("/user", userRoute);
app.use("/reset_password", resetPasswordRoute);


export { app };

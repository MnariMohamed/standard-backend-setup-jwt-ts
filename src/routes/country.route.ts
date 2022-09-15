import express from 'express';
import * as CountryCtrl from '../controllers/country.controller';
import { checkAuthSuperAdmin } from '../middlewares/auth.middleware';


const countryRoute = express.Router();


//get countries
countryRoute.get('/all/countries', CountryCtrl.getCountries);


//get country by code
countryRoute.get('/country/:code', CountryCtrl.getCountry);


//create country
countryRoute.post('/create/country', checkAuthSuperAdmin, CountryCtrl.createCountry);


//create countries from excel
countryRoute.post('/insert/countries_file', checkAuthSuperAdmin, CountryCtrl.insert_from_excel);



export default countryRoute;

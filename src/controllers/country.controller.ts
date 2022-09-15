import { request, Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import Country, { CountryDoc } from '../models/country.model';

var xlsx = require('node-xlsx');

//get all countries
export const getCountries = async (req: Request, res: Response) => {

    try {
        Country.find({}).sort("name").exec(function (err: any, countries: any) {
            if (err) return res.status(500).json({ message: 'error occured' });
            res.status(200).json({ countries });
        })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while getting countries',
            error: error.message
        });
    }

}


//create country
export const createCountry = async (req: Request, res: Response) => {

    try {
        Country.create(req.body, function (err: any, countryCreated: any) {
            if (err) { console.log(err); return res.status(500).json({ message: 'error occured while creating country' }); }
            res.status(200).json({ message: "country created", countryCreated });
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while getting countries',
            error: error.message
        });
    }

}


function insertFunction(_id: any, name: any, code: any, currency: any, phoneCode: any) {
    return new Promise(resolve => {
        Country.create({ _id, name, code, currency, phoneCode },
            function (err: any, countryCreated: any) {
                if (err) { console.log(err); return resolve(0); }
                return resolve({ message: "country created", countryCreated });
            });
    });
}


//insert from excel, terminal command: node -e 'require("").insert_from_excel()'
export const insert_from_excel = async (req?: Request, res?: Response) => {

    var obj = xlsx.parse(__dirname + '/../cli/public/files/countries.xlsx'); // parses a file

    var lines = obj[0].data;
    lines.shift();
    Country.deleteMany({}, async function (err) {
        if (err) return res?.status(500).json({ message: 'error occured while creating country' });
        for (let index = 0; index < lines.length; index++) {
            let _id = new mongoose.mongo.ObjectId("000000354a0d15b3222eed" + (10 + index));
            var resp = await insertFunction(_id, lines[index][0], lines[index][1], lines[index][2], lines[index][3]);
            console.log(resp);
        }
        console.log("finished");

        return res?.status(200).json({ message: "finished" });
    })

    /************************ */
}

Country.findOne({}, function (err: Error, randomCountry: any) {
    if (!randomCountry) insert_from_excel();
});


//get country by code
export const getCountry = async (req: Request, res: Response) => {

    try {
        Country.findOne({ code: req.params.code as any }, function (err: any, country: any) {
            if (err) return res.status(500).json({ message: 'error occured' });
            res.status(200).json({ country });
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while getting countries',
            error: error.message
        });
    }

}


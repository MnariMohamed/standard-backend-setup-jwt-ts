import mongoose from 'mongoose';

export interface ICountry {
    name: String,
    code: String,
    phoneCode: String,
    currency: String
}

export type CountryDoc = ICountry & mongoose.Document;

interface CountryModel extends mongoose.Model<CountryDoc> {
    build(attrs: ICountry): CountryDoc;
}

const countrySchema = new mongoose.Schema<CountryDoc, CountryModel>({
    name: { type: String, unique: true, required: true },
    code: { type: String, unique: true, required: true },
    phoneCode: { type: String, unique: true, required: true },
    currency: { type: String, required: true }//3 lellters
});


const Country = mongoose.model<CountryDoc, CountryModel>('Country', countrySchema);
export default Country;
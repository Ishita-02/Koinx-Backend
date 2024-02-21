import * as mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
    id: String,
    name: String,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

export default Crypto;
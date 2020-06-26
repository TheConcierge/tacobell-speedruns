const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;


let Run = new Schema({
    user: {
        type: String
    },
    length: {
        type: Number
    },
    proof_url: {
        type: String
    },
    category: {
        type: String,
        enum: ['drive thru%', 'baja blast%']
    },
    run_completed: {
        type: Date
    }
}, {
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports =  mongoose.model('Run', Run);

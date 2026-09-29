const mongoose = require("mongoose");
const { Schema } = mongoose;

const repositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    visibility: {          
        type: Boolean,                                         //   true -> public  , false -> private  
        default: true
    },
    owner: [
        {
            type: Schema.Types.ObjectId,                       
            ref: "User",                                    
            required: true
        }
    ]
})

const Repository = mongoose.model("Repository", repositorySchema)

module.exports = Repository
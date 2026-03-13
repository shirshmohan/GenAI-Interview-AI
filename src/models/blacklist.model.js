const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to be in the blacklist"]
    }
},{
    timestamps:true
})

const tokenBlackListModel = mongoose.model("blacklistTokens",blacklistTokenSchema)

module.exports = tokenBlackListModel
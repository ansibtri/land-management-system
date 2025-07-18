const { model, Schema } = require('mongoose');

const LandsSchema = new Schema({
    landId: {type: Number,required: true,unique:true,},
    ownerId: {type: String,required: true},
    citizenshipNo: {type: String,required: true},
    areaSize: {type: Number,required: true},
    price: {type: Number,required: true},
    landType:{type:String,default:''},
    district:{type:String,require:true,},
    municipality:{type:String,require:true,},
    wardNo:{type:Number,require:true,},
    state: {type: String,required: true},

    sellStatus: {type: Boolean,default: false},
    createdAt: {type: Date,default: Date.now},

    verifiedByRevenueDepart: {type: Boolean,default: false,},
    verifiedByLRO:{type:String,default:""},
    verifiedMsgByLRO:{type:String,default:""},
    rejectedByLRO:{type: Boolean,default:false},

    verifiedByWard: {type: Boolean,default: false,},
    verifiedByWardOfficer:{type:String,default:""},
    verifiedMsgByWardOfficer:{type:String,default:""},
    rejectedByWardOfficer:{type:Boolean,default:false,},

    verifiedMsgByNapi:{type:String,default:""},
    verifiedByNapi:{type:Boolean,default:false,},
    verifiedByNapiOfficer:{type:String,default:""},
    rejectedByNapi:{type:Boolean,default:false,},


    verificationDate: {type: Date,default: null,},
    verifiedBy: {type:String,default:null,},
    documents:{type:String,default: null,}
});

module.exports = model('Lands', LandsSchema);
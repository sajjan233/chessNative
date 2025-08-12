import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    role : {type:String},
    slug : {type:String}
})

roleSchema.set('toJSON', {
    transform: function (doc, ret) {
        return {
            id: ret._id,
            role: ret.role,
            slug: ret.slug
        };
    }
});
const Role = mongoose.model('role',roleSchema)
export default Role;
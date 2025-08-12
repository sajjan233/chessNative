import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 1. Define schema
const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref:'role' }
}, {
    timestamps: true
});

// 2. Virtual ID (for clean JSON)
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// 3. toJSON config (hide password, remove _id, __v)
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password; // hide password
    }
});

// 4. Hash password before save (pre save hook)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 5. JWT generate method
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// 6. Password compare method
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

// 7. Custom toJSON (optional, for special formatting)
userSchema.methods.toCustomJSON = function () {
    return {
        id: this._id,
        username: this.username,
        password:this.password,
        email: this.email,
        role: this.role
    };
};

// 8. Export model
const User = mongoose.model("User", userSchema);
export default User;

import pkg from 'mongoose';
const { Schema, model, Types } = pkg;
import userService from '../services/user.js';
import Preference from './Preference.js';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Потребителското име е задължилтено'],
        minlength: [5, 'Потребителското име трябва да съдържа между 5 и 15 символи'],
        maxlength: [15, 'Потребителското име трябва да съдържа между 5 и 15 символи'],
        trim: true,
        validate: {
            validator(value: string): boolean {
                return /[a-z][a-z0-9]+/i.test(value);
            },
            message: 'Потребителското може да съдържа само латински букви и цифри и трябва да започва с буква'
        },
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Паролата е задължилтена'],
        minlength: [6, 'Паролата трябва да е поне 6 символа'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Имейлът е задължилтено'],
        validate: {
            validator(value: string): boolean {
                return /^.*?@.*?\..*?$/.test(value);
            },
            message: 'Имейлът е в невалиден формат'
        },
        unique: true,
    },
    decks: [
        {
            type: Types.ObjectId,
            ref: 'Deck',
        },
    ],
    profilePicture: {
        type: String,
        default: '',
    },
    preferences: {
        type: Types.ObjectId,
        ref: 'Preference',
    },
});

userSchema.pre('validate', async function (next) {
    const user: any = this;
    const username: pkg.Document | null = await userService.findUserByUsername(user.username);

    if (username !== null) {
        user.invalidate('username', 'Потребителското име е заето');
    }

    const email: pkg.Document | null = await userService.findUserByEmail(user.email);

    if (email !== null) {
        user.invalidate('email', 'Имейлът е зает');
    }

    next();
});

userSchema.pre('save', async function (next) {
    const user: any = this;
    if (!user.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        const preferences = new Preference({
            user: user._id,
            theme: 'light',
            colorTheme: 'purple',
            animation: 'vertical',
        });

        console.log(preferences);

        await preferences.save();

        user.preferences = preferences._id;
        return next();
    } catch (err: any) {
        console.log(err.message);
        return next(err);
    }
});

const User = model('User', userSchema);


export default User;
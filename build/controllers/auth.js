import { __awaiter } from "tslib";
import express from 'express';
import authService from '../services/auth.js';
import jwtService from '../services/jwt.js';
import mapErrors from '../util/errorMapper.js';
const router = express.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = yield authService.register(username, password, email);
        const accessToken = jwtService.generateToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
        res.status(201).json({
            id: user._id,
            username: user.username,
        });
    }
    catch (err) {
        const errors = mapErrors(err);
        res.status(401).json({
            errors
        });
        res.end();
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const user = yield authService.login(username, password);
        const accessToken = jwtService.generateToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        })
            .status(200)
            .json({
            id: user._id,
            username: user.username,
        });
        res.end();
    }
    catch (err) {
        res.status(401).json({
            msg: 'Неуспешен вход!'
        });
        res.end();
    }
}));
router.get('/isLogged', jwtService.verifyToken, (req, res) => {
    const token = req.accessToken;
    res.status(200).json({
        username: token.username,
        id: token._id,
    });
    res.end();
});
router.get('/logout', jwtService.verifyToken, jwtService.blacklistToken, (_req, res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        secure: false,
    });
    res.status(204).json({});
    res.end();
});
export { router };

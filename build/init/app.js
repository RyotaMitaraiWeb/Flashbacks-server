import { __awaiter } from "tslib";
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToDB from './db.js';
import configureRoutes from './routes.js';
import cors from 'cors';
function start(app) {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv.config();
        const port = process.env.PORT || '5500';
        app.use(express.json());
        app.use(cookieParser(process.env.SECRET));
        app.use(cors({
            origin: 'http://localhost:3000',
        }));
        yield connectToDB();
        yield configureRoutes(app);
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
    });
}
export default start;

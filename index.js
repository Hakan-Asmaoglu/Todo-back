"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = 3001;
const openDb = () => {
    const pool = new pg_1.Pool({
        // user: 'postgres',
        // host: 'localhost',
        // database: 'todo',
        // password: 'oamk',
        // port: 5432,
        user: 'root',
        host: 'dpg-cgim2phr8t1g7lq7gevg-a.frankfurt-postgres.render.com',
        database: 'todo_d4ch',
        password: 'QgCXlEcwpHXd8SLAHlTjqZfLWu865xsx',
        port: 5432,
        ssl: true,
    });
    return pool;
};
app.get('/', (req, res) => {
    const pool = openDb();
    pool.query('select * from task', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});
// Implement post which is used to receive value(s) from client and execute insert into
// statement into database. SQL contains some parameters ($1) which are provided as an
// array when calling query method.
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('insert into task (description) values ($1) returning *', [req.body.description], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});
app.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = openDb();
    const id = parseInt(req.params.id);
    pool.query('delete from task where id = $1', [id], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: id });
    });
}));
app.listen(port);

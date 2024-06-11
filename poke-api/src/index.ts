import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import pokemonRoute from "./routes/pokemon.route";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use("/api/pokemon", pokemonRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
    console.log("Server is running!");
});
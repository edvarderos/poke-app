import express, { Request, Response } from 'express';
import authenticateToken from '../middlewares/authenticateToken';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/list', authenticateToken, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { caughtPokemons: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sortedPokemons = user.caughtPokemons.sort((a, b) => a.localeCompare(b));

        res.status(200).json(sortedPokemons);
    } catch (error) {
        console.error('Failed to fetch Pokémon list:', error);
        res.status(500).json({ message: 'Failed to fetch Pokémon list' });
    }
});


router.post('/catch/:name', authenticateToken, async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                caughtPokemons: {
                    push: name,
                },
            },
        });

        res.status(200).json({ message: `${name} caught successfully!` });
    } catch (error) {
        console.error(`Failed to catch Pokémon ${name}:`, error);
        res.status(500).json({ message: `Failed to catch Pokémon ${name}` });
    }
});

router.post('/release/:name', authenticateToken, async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                caughtPokemons: {
                    set: user.caughtPokemons.filter(pokemon => pokemon !== name)
                },
            },
        });

        res.status(200).json({ message: `${name} released successfully!` });
    } catch (error) {
        console.error(`Failed to release Pokémon ${name}:`, error);
        res.status(500).json({ message: `Failed to release Pokémon ${name}` });
    }
});




export default router;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Score Schema
const scoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    mode: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Routes
app.post('/api/scores', async (req, res) => {
    try {
        const { name, score, mode } = req.body;
        
        // Find existing score for this player and mode
        const existingScore = await Score.findOne({ name, mode });
        
        if (existingScore) {
            // Update only if new score is higher
            if (score > existingScore.score) {
                existingScore.score = score;
                existingScore.date = Date.now();
                await existingScore.save();
                res.status(200).json(existingScore);
            } else {
                res.status(200).json(existingScore); // Return existing score if new score isn't higher
            }
        } else {
            // Create new score entry if player doesn't exist
            const newScore = new Score(req.body);
            await newScore.save();
            res.status(201).json(newScore);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/scores/:mode', async (req, res) => {
    try {
        const scores = await Score.find({ mode: req.params.mode })
            .sort({ score: -1 })
            .limit(10);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
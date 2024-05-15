const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ text: String, completed: Boolean }]
});

const User = mongoose.model('User', UserSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, tasks: [] });

    try {
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get tasks
app.get('/tasks', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.json(user.tasks);
});

// Add task
app.post('/tasks', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    user.tasks.push({ text: req.body.text, completed: false });
    await user.save();
    res.json(user.tasks);
});

// Update task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    const task = user.tasks.id(req.params.id);
    task.completed = !task.completed;
    await user.save();
    res.json(user.tasks);
});

// Delete task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    user.tasks.id(req.params.id).remove();
    await user.save();
    res.json(user.tasks);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

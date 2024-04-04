const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");
const app = express();

// Convert data to JSON
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Define routes
app.get("/", (req, res) => {
    res.render("login"); // Render login.ejs when accessing the root URL
});

app.get("/register", (req, res) => {
    res.render("register"); // Render signup.ejs when accessing the /signup URL
});

// Register page 
app.post("/register", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        // Check if user already exists
        const existingUser = await collection.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        // Save the user with hashed password
        const userdata = await collection.create({ email: data.email, password: hashedPassword });
        console.log("User registered successfully:", userdata);
        res.send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).send("Error registering user");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await collection.findOne({ email });
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (isPasswordMatch) {
            return res.render("home");
        } else {
            return res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("An error occurred during login");
    }
});


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});

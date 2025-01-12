const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../database.js");

function login(req, res) {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const stm = "SELECT * FROM users WHERE username = ?";
  const params = [username];

  connection.query(stm, params, (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  });
}


async function register(req, res) {
  const { firstName, lastName, username, password } = req.body;

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const stm_check = "SELECT * FROM users WHERE username = ?";
  const param_user = [username];

  connection.query(stm_check, param_user, async (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const params = [firstName, lastName, username, hashedPassword];
      const stm = "INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)";

      connection.query(stm, params, (error, results) => {
        if (error) {
          console.error("Error inserting user:", error);
          return res.status(500).send("Error inserting user");
        }

        res.status(201).json({
          message: "User registered successfully.",
          user: {
            id: results.insertId,
            firstName,
            lastName,
            username,
          },
        });
      });
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      res.status(500).send("Error processing request");
    }
  });
}


function logout(req,res){

    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        console.log('Token required');
        return res.status(400).json({ message: 'Token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Logout sucessfull' });
      } catch (error) {
        console.log('Erreur de token:', error);
        res.status(401).json({ message: 'Invalid token' });
      }

}


function getUser(req, res){

    const secretKey = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(' ')[1];

    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
      }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        const userId = decoded.id;

        stm = "SELECT * FROM users WHERE id = ?"
        params = [userId]

        connection.query(stm, params, (error, results) => {
            if (error) {
                console.error("Error retrieving user:", error);
                return res.status(500).send("Error retrieving user");
              }

              if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
              }

              const user = results[0]; 

              res.json({
                id: user._id,
                username: user.username,
                email: user.email,
              });
    })
})
}

module.exports = { login, register, logout, getUser};

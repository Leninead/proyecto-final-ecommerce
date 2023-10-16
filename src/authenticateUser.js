const authenticateUser = async (req, res) => {
  const { name, password } = req.body;

  // Assuming your authentication logic succeeds, create a JWT token
  if (name === 'example_user' && password === 'password123') {
    const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });  // Send the token in the response
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

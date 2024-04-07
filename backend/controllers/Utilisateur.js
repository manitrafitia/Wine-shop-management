const User = require('../model/utilisateur');

exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création de l\'utilisateur.' });
  }
};

// Authentification de l'utilisateur
exports.authenticateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }
    res.status(200).json({ message: 'Authentification réussie.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'authentification.' });
  }
};

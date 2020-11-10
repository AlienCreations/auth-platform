'use strict';

const logoutPrompt = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = logoutPrompt;

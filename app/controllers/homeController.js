exports.ping = (req, res) => {
  return res.status(200).json({
    success: true
  });
};

exports.echo = (req, res) => {
  return res.status(200).json({
    success: true
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.guestBoard = (req, res) => {
  res.status(200).send("Guest Content.");
};

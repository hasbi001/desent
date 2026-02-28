exports.ping = (req, res) => {
  res.status(200).send({
    success: ture
  });
};

exports.echo = (req, res) => {
  res.status(200).send({
    success: ture
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.guestBoard = (req, res) => {
  res.status(200).send("Guest Content.");
};

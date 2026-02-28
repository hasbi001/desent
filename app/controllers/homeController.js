exports.ping = (req, res) => {
  res.status(200).send({
    message: "PING"
  });
};

exports.echo = (req, res) => {
  res.status(200).send({
    message: "ECHO"
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.guestBoard = (req, res) => {
  res.status(200).send("Guest Content.");
};
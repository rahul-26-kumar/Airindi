// api/index.js
module.exports = (req:any, res:any) => {
  if (req.url === "/") {
    res.status(200).send("Hello from Vercel!");
  } else {
    res.status(404).send("Not Found");
  }
};

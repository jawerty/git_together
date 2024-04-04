const express = require('express');
const path = require("path");
const cors = require('cors');

const matchmakerRouter = require("./routes/matchmaker")

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'static')));


// Enable CORS for all routes
app.use(cors());
app.use(express.json())

app.use("/", matchmakerRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Respond with the error
  res.status(err.status || 500);
  res.send('error');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

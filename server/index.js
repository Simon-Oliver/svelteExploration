const express = require('express');
var cors = require('cors');
const path = require('path');

//const router = require('./routes/index');

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

//app.use(express.static(path.join(__dirname, '../client/build')));
//app.use('/', router);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

app.get('/hello', function(req, res) {
  res.json({ message: 'This is a sever message mate!' });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

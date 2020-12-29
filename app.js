require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const moviesData = require('./moviesData');

const app = express();

const API_TOKEN = process.env.API_TOKEN

app.use(morgan('dev'))
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);


function validateBearerToken(req , res, next){
  const authVal = req.get('Authorization') || '';

  if(!authVal.startsWith('Bearer ')){
    return res.status(401).json({ message: 'Missing Bearer token'});
  }

  const token = authVal.split(' ')[1]

  if(token !== API_TOKEN) {
    return res.status(401).json({ message: 'Invalid credential'});
  }

  next();
}


function movieSearch(req, res, next){
  const { genre, country } = req.query;
  const avg_vote = parseFloat(req.query.avg_vote)
  let results = [ ...moviesData ];  

  if(genre){
    results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country){
    results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(avg_vote)(
    results = results.filter(movie => movie.avg_vote >= avg_vote)
  )

  if(results.length === 0){
    results = [{message: "Oops! No movies match your parameters."}]
  }
  res.json(results);
}

app.get('/movie', movieSearch);



app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});
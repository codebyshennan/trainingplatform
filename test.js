import express from 'express';


const app = express();

app.set('view engine', 'ejs');

const fn1 = (req,res,next)=> {
  const {index} = req.params;
  console.log(index);

  res.locals.haha = '1';
  console.log(res.locals);
  next();
}

const fn2 = (req,res,next)=> {
  console.log(req.params);
  res.locals.babab = '2';
  console.log(res.locals);
  next();
}
const fn3 = (req,res,next)=> {
   console.log(req.params);
  // console.log(req.body);
  res.render('test')
  next();
}

app.get('/:index', fn1,fn2,fn3);

app.listen(3000);
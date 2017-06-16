/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import Promise from 'bluebird';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import PrettyError from 'pretty-error';
import createApolloClient from './core/createApolloClient';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './core/passport';
import router from './core/router';
import models from './data/models';
import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { port, auth } from './config';
import { User, UserLogin, UserClaim, UserProfile, Wins } from './data/models';
import multer from 'multer';
import bcrypt from 'bcryptjs';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

app.get('/login/github',
  passport.authenticate('github')
);
app.get('/login/github/return',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
	const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });  
    res.redirect('/');
  });
app.get('/logout',
  (req, res) => {
  // console.log('clearcookielog at server.js');
    res.clearCookie('id_token');
    res.redirect('/');
  },
);
app.post('/register',
  async (req, res, done) => {
  const username=req.body.username;
  const password=req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const fooBar = async () => {
    // User.drop();
    let user = await User.create({
    email: username,
    password: hash,
    emailConfirmed: false,
    logins: [
      { name: username, key: username+"001" },
    ],
    claims: [
      { type: 'claimType', value: 'accessToken' },
    ],
    profile: {
      displayName: username,
    },
    }, {
    include: [
      { model: UserLogin, as: 'logins' },
      { model: UserClaim, as: 'claims' },
      { model: UserProfile, as: 'profile' },
    ],
    });

    done(null, {
    id: user.id,
    username: user.email,
    }); 

    return user;
  }
    // login automatically after register
    const user = await fooBar().catch(done); 
    let userjson = JSON.parse(JSON.stringify(user));
    userjson.username = userjson.email;
    console.log(userjson)
    req.login(userjson, function(err){
      if(!err){
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign(userjson, auth.jwt.secret, { expiresIn });
        console.log(token);
        res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });          
        return res.redirect('/');
      }else{
        //handle error
        console.log(err);
      }
    })
    
    // passport.authenticate('local')(
    //   (req, res, function() {
    //   const expiresIn = 60 * 60 * 24 * 180; // 180 days
    //     const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    //     res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });  
    //     res.redirect('/');
    //   });
    // res.redirect('/');
  });

app.post('/yourwins',
  (req, res, done) => {
  const title = req.body.title;
  const img = req.body.img;
  const id = `${Date.now()}::${Math.ceil(Math.random() * 99999999)}`;
  const fooBar = async () => {
    // User.drop();
    let book = await Wins.create({
    title: title,id:id,owner:req.user.email,img:img,like:0,notlike:0,
    });
    done(null, {
    title: title,
    }); 
  }
  fooBar().catch(done); 
    res.redirect('/yourwins');
  });  

const upload = multer({ dest: 'public' });
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  const filename=req.file.filename
  const result={"filename":filename}
  res.end(JSON.stringify(result)) 
})

app.post('/changePwd', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res, done) => {
  const username=req.user.email;
  const password=req.body.newPassword;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const fooBar = async () => {
    // User.drop();
	let password = {password: hash};
    let user = await User.update(password, {where:{email:username}});
  }
  fooBar().catch(done); 
    res.redirect('/logout');
  });
  
//
// Register API middleware
// -----------------------------------------------------------------------------
const graphqlMiddleware = expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    const store = configureStore({
      user: req.user || null,
    }, {
      cookie: req.headers.cookie,
      apolloClient,
    });

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Initialize a new Redux store
      // http://redux.js.org/docs/basics/UsageWithReact.html
      store,
      // Apollo Client for use with react-apollo
      client: apolloClient,
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };

    const rootComponent = <App context={context}>{route.component}</App>;
    await getDataFromTree(rootComponent);
    // this is here because of Apollo redux APOLLO_QUERY_STOP action
    await Promise.delay(0);
    data.children = await ReactDOM.renderToString(rootComponent);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];

    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.state = context.store.getState();

    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */

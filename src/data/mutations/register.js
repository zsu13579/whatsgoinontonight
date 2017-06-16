
import { GraphQLList as List } from 'graphql';
import { User, UserLogin, UserClaim, UserProfile } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import bcrypt from 'bcryptjs';

const register = {
  type: StringType,
  args: {
    username: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  resolve: async function(rootValue, args) {
	  
	const username=args.username;
	const password=args.password;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

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

	// login automatically after register
	let userjson = JSON.parse(JSON.stringify(user));
	userjson.username = userjson.email;
	console.log(userjson)
	// req.login(userjson, function(err){
	  // if(!err){
		// const expiresIn = 60 * 60 * 24 * 180; // 180 days
		// const token = jwt.sign(userjson, auth.jwt.secret, { expiresIn });
		// console.log(token);
		// res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });          
		// return res.redirect('/');
	  // }else{
		// //handle error
		// console.log(err);
		// return "Register Failed";
	  // }
	// })  
	  
	return "Register Succeeded";
  }
}

export default register;

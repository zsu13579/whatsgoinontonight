
import { UserProfile } from '../models';
import ProfileType from '../types/ProfileType';
// import WinsItemType from '../types/WinsItemType';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const uploadAvatar = {
  type: ProfileType,
  args: {
    displayName: { type: new NonNull(StringType) },
    picture: { type: StringType },
  },
  resolve: async function(rootValue, args) {
    let targetProfile = await UserProfile.findOne({where: {displayName: args.displayName}});
    let picture = { picture: args.picture };
  	await UserProfile.update(picture,{where: {displayName: args.displayName}});
    return UserProfile.findOne({where: {displayName: args.displayName}});
  }
}

export default uploadAvatar;
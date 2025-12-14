export type { UserSchema } from './model/types/UserSchema';
export type { User } from './model/types/User';
export type { UserRankKeys, UserRank } from './model/types/Ranks';
export { UserRankMapper } from './model/types/Ranks';

export { UserReducer, UserActions } from './model/slice/UserSlice';

// export {} from './model/services/getUserData';
export { signupUser } from './model/services/signupUser';
// export {} from './model/services/loginUser';

export { getUserData, getIsUserLoading } from './model/selectors/userSelectors';

export { SignupForm } from './ui/SignupForm';

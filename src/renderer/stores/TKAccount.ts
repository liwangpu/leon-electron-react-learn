import { types } from 'mobx-state-tree';

export const TKAccountType = types.model({
  id: types.string,
  account: types.string,
  password: types.string,
  country: types.string
});

export const TKAccountStore = types.model({
  accounts: types.map(TKAccountType)
});


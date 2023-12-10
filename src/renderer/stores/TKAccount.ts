import { flow, Instance, types } from 'mobx-state-tree';
import { ITKAccount } from '../../interfaces';

const Account = types.model({
  account: types.string,
  password: types.string,
  country: types.optional(types.string, ''),
  onLine: types.optional(types.boolean, false)

})
  .views(self => {
    return {
      get key() {
        return self.account;
      }
    };
  })
  .actions(self => {
    return {
      toggleOnLine: (onLine: boolean) => {
        self.onLine = onLine;
      }
    };
  });

export type AccountModel = Instance<typeof Account>;

export const AccountStore = types.model({
  accounts: types.map(Account)
}).actions(self => {

  return {
    addAccount: (ac: ITKAccount) => {
      if (!ac) {
        return;
      }
      self.accounts.set(ac.account, ac);
    }

  };
});

export type AccountStoreModel = Instance<typeof AccountStore>;

let store: AccountStoreModel;

export function initialize() {
  if (!store) {
    store = AccountStore.create({
      accounts: {}
    });
  }
  return store;
}

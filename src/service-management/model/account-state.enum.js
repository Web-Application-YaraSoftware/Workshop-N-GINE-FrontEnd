export const AccountState = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  HIDDEN: 'HIDDEN',

  getName(value) {
    switch (value) {
      case this.ACTIVE:
        return 'Active';
      case this.INACTIVE:
        return 'Inactive';
      case this.HIDDEN:
        return 'Hidden';
      default:
        return null;
    }
  }
});

import { CheckUsernameValidator } from './username-validator';

describe('UsernameValidator', () => {
  it('should create an instance', () => {
    expect(new CheckUsernameValidator()).toBeTruthy();
  });
});

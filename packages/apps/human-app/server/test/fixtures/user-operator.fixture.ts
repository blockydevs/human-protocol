import { UserType } from '../../src/common/enums/user';
import { ethers } from 'ethers';
import { SignupOperatorData } from '../../src/modules/user-operator/interfaces/operator-registration.interface';
export async function generateOperatorSignupRequestBody() {
  const wallet = ethers.Wallet.createRandom();
  const flatSig = await wallet.signMessage(generateRandomString());
  return {
    address: wallet.address,
    signature: flatSig,
    type: UserType.OPERATOR.toString(),
  } as SignupOperatorData;
}
function generateRandomString(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = Math.floor(Math.random() * 100);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

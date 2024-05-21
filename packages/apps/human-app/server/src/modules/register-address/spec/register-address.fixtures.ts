import {
  RegisterAddressCommand,
  RegisterAddressData,
  RegisterAddressDto, RegisterAddressResponse,
} from '../model/register-address.model';
const CHAIN_ID = 80002;
const ADDRESS = '0xsome_address';
export const REGISTER_ADDRESS_TOKEN = 'my_access_token';
const RESPONSE_ADDRESS = 'signed_address_response';
export const registerAddressDtoFixture: RegisterAddressDto = {
  chain_id: CHAIN_ID,
  address: ADDRESS,
};
export const registerAddressCommandFixture: RegisterAddressCommand = {
  chainId: CHAIN_ID,
  address: ADDRESS,
  token: REGISTER_ADDRESS_TOKEN,
};
export const registerAddressDataFixture: RegisterAddressData = {
  chain_id: CHAIN_ID,
  address: ADDRESS,
};
export const registerAddressResponseFixture: RegisterAddressResponse = {
  signed_address: RESPONSE_ADDRESS,
};

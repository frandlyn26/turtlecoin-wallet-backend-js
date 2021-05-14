import { validateAddresses, validateAddress } from '../../lib/ValidateParameters';
import { WalletErrorCode } from '../../lib/WalletError'
import { TestStatus, Tester } from '../tester';

const invalidAddress = '122 1/8 Street, New York';
const validAddress = 'TRTLv2txGW8daTunmAVV6dauJgEv1LezM2Hse7EUD5c11yKHsNDrzQ5UWNRmu2ToQVhDcr82ZPVXy4mU5D7w9RmfR747KeXD3UF';
const validAddress2 = 'TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4wW';
const integratedAddress = 'TRTLuyzDT8wJ6bAmnmBLyRHmBNrRrafuR9G3bJTNzPiTAS4xKDQKHd9Aa2sF2q22DF9EXi5HNpZGcHGBwqgVAqc2AZxUBMMSegm8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyhJk2yR';

export const ValidateParametersTests = async (tester: Tester) => {
    /* validateAddresses */
    await tester.test(async () => {
        const isValid = await validateAddresses([invalidAddress], false);
        return isValid.errorCode == WalletErrorCode.SUCCESS ? TestStatus.FAIL : TestStatus.PASS;
    },
    'ValidateParameters: validateAddresses: invalid addresses',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddresses([validAddress, validAddress2], false);
        return isValid.errorCode == WalletErrorCode.SUCCESS ? TestStatus.PASS : TestStatus.FAIL;
    },
    'ValidateParameters: validateAddresses: valid addresses',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddresses([validAddress, integratedAddress], true);
        return isValid.errorCode == WalletErrorCode.SUCCESS ? TestStatus.PASS : TestStatus.FAIL;
    },
    'ValidateParameters: validateAddresses: allowing integrated addresses',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddresses([validAddress, integratedAddress], false);
        return isValid.errorCode == WalletErrorCode.SUCCESS ? TestStatus.FAIL : TestStatus.PASS;
    },
    'ValidateParameters: validateAddresses: not allowing integrated addresses',
    'works as expected',
    'did not work as expected');

    /* validateAddress */
    await tester.test(async () => {
        const isValid = await validateAddress(invalidAddress, false);
        return isValid ? TestStatus.FAIL : TestStatus.PASS;
    },
    'ValidateParameters: validateAddress: invalid address',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddress(validAddress, false);
        return isValid ? TestStatus.PASS : TestStatus.FAIL;
    },
    'ValidateParameters: validateAddress: valid address',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddress(integratedAddress, true);
        return isValid ? TestStatus.PASS : TestStatus.FAIL;
    },
    'ValidateParameters: validateAddress: allowing integrated address',
    'works as expected',
    'did not work as expected');

    await tester.test(async () => {
        const isValid = await validateAddress(integratedAddress, false);
        return isValid ? TestStatus.FAIL: TestStatus.PASS;
    },
    'ValidateParameters: validateAddress: not allowing integrated address',
    'works as expected',
    'did not work as expected');
}
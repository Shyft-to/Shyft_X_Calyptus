import dynamic from 'next/dynamic';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Center,
    Box,
    Input,
    Button
  } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react';

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const CreateCompressed = () => {
    const {publicKey} = useWallet();
    return ( 
        <div>
            <Box as='div' minH={"90vh"}>
            {publicKey ? 
                <Box mt={8} border={'1px'} borderRadius={8} borderColor={'whiteAlpha.600'} px={8} py={5}>
                    <FormControl mt={8}>
                        <FormLabel fontFamily={"heading"} fontSize={"sm"}>Creator Wallet</FormLabel>
                        <Input type='text' />
                        <FormHelperText fontFamily={"heading"} fontSize={"xs"} color={"whiteAlpha.600"}>The creator/payer of the NFT</FormHelperText>
                    </FormControl>
                    <FormControl mt={8}>
                        <FormLabel fontFamily={"heading"} fontSize={"sm"}>Merkle Tree Address</FormLabel>
                        <Input type='text' />
                        <FormHelperText fontFamily={"heading"} fontSize={"xs"} color={"whiteAlpha.600"}>Address of the Merkle Tree to which the NFT wil be added to.</FormHelperText>
                    </FormControl>
                    <FormControl mt={8}>
                        <FormLabel fontFamily={"heading"} fontSize={"sm"}>Metadata URI</FormLabel>
                        <Input type='text' />
                        <FormHelperText fontFamily={"heading"} fontSize={"xs"} color={"whiteAlpha.600"}>URI that contains metadata of the NFT (metaplex non-fungible-standard) in JSON file format</FormHelperText>
                    </FormControl>
                    <FormControl mt={8}>
                        <FormLabel fontFamily={"heading"} fontSize={"sm"}>Receiver</FormLabel>
                        <Input type='text' />
                        <FormHelperText fontFamily={"heading"} fontSize={"xs"} color={"whiteAlpha.600"}>Account address which will receive the newly created NFT.</FormHelperText>
                    </FormControl>
                    <FormControl mt={8}>
                        <FormLabel fontFamily={"heading"} fontSize={"sm"}>Fee Payer</FormLabel>
                        <Input type='text' />
                        <FormHelperText fontFamily={"heading"} fontSize={"xs"} color={"whiteAlpha.600"}>If mentioned this is the account that will be used for paying the transaction gas fee, instead of creator.</FormHelperText>
                    </FormControl>
                    <Center mt={12} mb={4}>
                        <Button colorScheme='pink'>Create NFT</Button>
                    </Center>
                </Box>
                :
                <Box mt={8} border={'1px'} borderRadius={8} borderColor={'whiteAlpha.600'} px={4} py={6}>
                    <Center minH={'40vh'} width={'full'}>
                        <WalletMultiButtonDynamic />
                    </Center>
                </Box>
            }
            </Box>
        </div> 
    );
}
 
export default CreateCompressed;
import { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormHelperText,
    Text,
    Link,
    Stack,
} from '@chakra-ui/react';

import { ExternalLinkIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

type propsType = {
    setMerkleTree: any;
};

const CreateMerkle = (props: propsType) => {
    const [wAddress, setWalletAddress] = useState<string>('');
    const [network, setNetwork] = useState<string>('devnet');
    const [maxTokens, setMaxTokens] = useState(1);
    const [msg, setMsg] = useState<string>('');

    const [loading, setLoading] = useState<'loading' | 'success' | 'failed' | 'unloaded'>('unloaded');

    const createTree = async () => {
        setMsg('');
        const validNetworks = ['devnet', 'mainnet-beta'];
        var errorOcc = false;
        try {
            // if (wAddress === '') throw new Error('NO_WADDRESS');
            if (validNetworks.includes(network) === false) throw new Error('INVALID_NETWORK');
            else if (maxTokens < 0 || maxTokens > 1000000) throw new Error('TOO_MANY_TOKENS');
        } catch (error: any) {
            if (error.message === 'NO_WADDRESS') setMsg('Wallet Address cannot be empty');
            else if (error.message === 'INVALID_NETWORK') setMsg('Invalid Network Selected');
            else if (error.message === 'TOO_MANY_TOKENS') setMsg('Token Limit reached');

            errorOcc = true;
        }
        if (!errorOcc) {
            setLoading('loading');
            await axios
                .request({
                    url: '/api/create-merkle-tree',
                    method: 'POST',
                    data: {
                        // wallet_address: wAddress,
                        total_tokens: maxTokens,
                        network: network,
                    },
                })
                .then((res) => {
                    if (res.data.success === true) {
                        setLoading('success');
                        props.setMerkleTree(res.data.result.tree);
                        setMsg(`Merkle Tree created: ${res.data.result.tree ?? '--'}`);
                        setTimeout(() => {
                            setLoading('unloaded');
                        }, 2000);
                    } else {
                        setLoading('failed');
                        setTimeout(() => {
                            setLoading('unloaded');
                        }, 1000);
                    }
                })
                .catch((err) => {
                    setLoading('failed');
                    setMsg(`Error: ${err.message}`);
                    setTimeout(() => {
                        setLoading('unloaded');
                    }, 1000);
                });
        }
    };
    return (
        <>
            <Heading w="100%" fontSize={'2xl'} textAlign={'center'} fontWeight="bold" mt="2%" mb="2%">
                Create Merkle Tree
            </Heading>

            {/* <FormControl mt="2%">
                <FormLabel fontWeight={'normal'}>Wallet address</FormLabel>
                <Input type="text" value={wAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                <FormHelperText>Wallet Address with which this project was setup.</FormHelperText>
            </FormControl> */}
            <Flex mt="2%" flexDirection={{ base: 'column', md: 'column' }}>
                <FormControl flex={1} mr={{ base: '0%', md: '0%' }}>
                    <FormLabel fontWeight={'normal'}>Network</FormLabel>
                    <Select value={network} onChange={(e) => setNetwork(e.target.value)}>
                        <option value="devnet" style={{ color: '#202020' }}>
                            devnet
                        </option>
                        {/* <option value='testnet' style={{color:"#202020"}}>testnet</option> */}
                        <option value="mainnet-beta" style={{ color: '#202020' }}>
                            mainnet
                        </option>
                    </Select>
                    <FormHelperText>Select Solana Network Cluster</FormHelperText>
                </FormControl>

                <FormControl flex={1} mt={{ base: '2%', md: '2%' }}>
                    <FormLabel fontWeight={'normal'}>Max NFTs to be Airdropped</FormLabel>
                    <Input
                        type="number"
                        min={1}
                        max={1000000}
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(Number(e.target.value))}
                    />
                    <FormHelperText>Max NFTs the Tree will hold</FormHelperText>
                </FormControl>
            </Flex>
            <Stack mt={8} flexDirection={'column'}>
                {loading === 'unloaded' && (
                    <Button fontFamily={'heading'} colorScheme="purple" onClick={createTree}>
                        Create Tree
                    </Button>
                )}
                {loading === 'success' && (
                    <Button fontFamily={'heading'} colorScheme="green" leftIcon={<CheckIcon />}>
                        Success
                    </Button>
                )}
                {loading === 'failed' && (
                    <Button fontFamily={'heading'} colorScheme="red" leftIcon={<CloseIcon />}>
                        Failed
                    </Button>
                )}
                {loading === 'loading' && (
                    <Button fontFamily={'heading'} colorScheme="purple" isLoading loadingText="Creating">
                        Creating
                    </Button>
                )}
                {msg !== '' && (
                    <Text textAlign={'center'} color={'yellow.300'} fontSize={'sm'} mt={1} fontFamily={'heading'}>
                        {msg}
                    </Text>
                )}
                <Text textAlign={'center'} color={'whiteAlpha.400'} fontSize={'sm'} mt={2} fontFamily={'heading'}>
                    To find out more about Merkle Trees and their capacity,{' '}
                    <Link href="https://docs.shyft.to/start-hacking/nft/compressed-nft#create-merkle-tree" isExternal>
                        click here
                    </Link>
                    ,or visit{' '}
                    <Link href="https://docs.shyft.to" isExternal>
                        SHYFT Docs
                    </Link>{' '}
                    <ExternalLinkIcon mx="2px" mt="-0.5" />
                </Text>
            </Stack>
        </>
    );
};

export default CreateMerkle;

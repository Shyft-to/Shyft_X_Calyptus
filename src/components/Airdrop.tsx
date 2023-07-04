
import { useEffect,useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

import { Box, Center, Flex,Spacer,Heading,ButtonGroup,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    Stack,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    FormHelperText,

} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons'
import formatAddresses from '../utils/functions';

type paramType = {
    allData: any,
    network:string
}

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Airdrop = (props:paramType) => {
    const {publicKey} = useWallet();
    
    const [connected,setConnected] = useState<string>("");
    const [nftAddr,setNftAddr] = useState<string>("");
    const [merkleTree,setMerkleTree] = useState<string>("");
    const [receiverAddr,setReceiverAddr] = useState<string>("");

    const [loadStatus,setLoadStatus] = useState<"unloaded"|"loading"|"loaded"|"error">("unloaded");

    useEffect(() => {
        if(publicKey)
            setConnected(publicKey?.toBase58());
        else
            setConnected("");
        
      
    }, [publicKey]);

    const transferNFT = async () => {
        setLoadStatus("loading");
        await axios.request({
            url: "https://api.shyft.to/sol/v1/nft/compressed/transfer",
            method: "POST",
            data: {
                "network": props.network,
                "merkel_tree": merkleTree,
                "nft_address": nftAddr,
                "sender": connected,
                "receiver": receiverAddr
            }
        })
        .then(res => {
            if(res.data.success)
            {
                setLoadStatus("loaded");
                //get Encoded txn and sign
                setTimeout(() => {
                    setLoadStatus("unloaded");
                    onClose();
                }, 2000);
            }
                // setOpsComplete(true);
        })
        .catch(err => console.log(err));
    }
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Enter Token Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack border={"1px"} borderColor={"whiteAlpha.600"}>
                        <FormControl pb={4}>
                            <FormLabel fontFamily={'heading'} fontSize={"sm"}>Nft Mint Address</FormLabel>
                            <Input type='text' value={nftAddr} onChange={(e) => setNftAddr(e.target.value)}/>
                            <FormHelperText fontFamily={'heading'} fontSize={"xs"}>Enter mint address of the NFT you want to transfer.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel fontFamily={'heading'} fontSize={"sm"}>Merkle Tree Address</FormLabel>
                            <Input type='text' value={merkleTree} onChange={(e) => setMerkleTree(e.target.value)}/>
                            <FormHelperText fontFamily={'heading'} fontSize={"xs"}>Enter Merkle Tree Address in which the NFT is located.</FormHelperText>
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                    </Button>
                    <Button colorScheme='red' onClick={transferNFT}>Secondary Action</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            {publicKey ? (
                <Box as={'div'} minH={'80vh'} width={'full'} pt={4}>
                    <Flex
                        minWidth="max-content"
                        alignItems="center"
                        gap="2"
                        border={'1px'}
                        px={2}
                        py={2}
                        borderRadius={8}
                        borderColor={'whiteAlpha.600'}
                    >
                        <Box p="2">
                            {publicKey && (
                                <Heading size="sm">
                                    {formatAddresses(publicKey?.toBase58() ?? "")}
                                </Heading>
                            )}
                        </Box>
                        <Spacer />
                        <ButtonGroup gap="2">
                            <WalletDisconnectButtonDynamic />
                        </ButtonGroup>
                    </Flex>
                    <TableContainer mt={8} border={'1px'} borderRadius={8} borderColor={'whiteAlpha.600'} px={4} py={6}>
                        <Table variant="simple">
                            <TableCaption>Airdrop Compressed NFTs to any of the Holders</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Token</Th>
                                    <Th textAlign={"center"}>Mint</Th>
                                    <Th textAlign={"center"}>Current holder</Th>
                                    <Th textAlign={"end"} width={"32px"}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {props.allData.map((nft:any) => <Tr key={nft.mint}>
                                    <Td>
                                        <Stack direction={'row'} align={'center'}>
                                            <Flex
                                                w={"44px"}
                                                h={"44px"}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={"#fff"}
                                            >
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src={nft.nft_data.cached_image_uri}
                                                    alt='Nft image'
                                                />
                                            </Flex>
                                            <Text fontWeight={600} color={"pink.300"} fontSize={{base:"xs",md:"sm"}}>{nft.nft_data.name ?? ""}</Text>
                                        </Stack>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>{formatAddresses(nft.nft_data.mint ?? "")}</Text>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>{formatAddresses(nft.current_holder ?? "")}</Text>
                                    </Td>
                                    <Td>
                                        <Button
                                            colorScheme='pink'
                                            aria-label='Airdrop Tokens'
                                            size='sm'
                                            variant='solid'
                                            fontFamily={'heading'}
                                            leftIcon={<ArrowDownIcon />}
                                            onClick={() => {
                                                onOpen()
                                                setReceiverAddr(nft.current_holder ?? "");  
                                            }}
                                        >
                                            Airdrop
                                        </Button>
                                    </Td>
                                </Tr>
                                )}
                                {/* <Tr>
                                    <Td>
                                        <Stack direction={'row'} align={'center'}>
                                            <Flex
                                                w={"44px"}
                                                h={"44px"}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={"#fff"}
                                            >
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src='https://bit.ly/dan-abramov'
                                                    alt='Nft image'
                                                />
                                            </Flex>
                                            <Text fontWeight={600} color={"pink.300"} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                        </Stack>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                    </Td>
                                    <Td>
                                        <Button
                                            colorScheme='pink'
                                            aria-label='Airdrop Tokens'
                                            size='sm'
                                            variant='solid'
                                            fontFamily={'heading'}
                                            leftIcon={<ArrowDownIcon />}
                                        >
                                            Airdrop
                                        </Button>
                                    </Td>
                                </Tr> */}
                                <Tr>
                                    <Td>
                                        <Stack direction={'row'} align={'center'}>
                                            <Flex
                                                w={"44px"}
                                                h={"44px"}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={"#fff"}
                                            >
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src='https://bit.ly/dan-abramov'
                                                    alt='Nft image'
                                                />
                                            </Flex>
                                            <Text fontWeight={600} color={"pink.300"} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                        </Stack>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>Hellow</Text>
                                    </Td>
                                    <Td>
                                        <Button
                                            colorScheme='pink'
                                            aria-label='Airdrop Tokens'
                                            size='sm'
                                            variant='solid'
                                            fontFamily={'heading'}
                                            leftIcon={<ArrowDownIcon />}
                                        >
                                            Airdrop
                                        </Button>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Box as={'div'}>
                    <Center minH={'40vh'} width={'full'}>
                        <WalletMultiButtonDynamic />
                    </Center>
                </Box>
            )}
        </div>
    );
}
 
export default Airdrop;
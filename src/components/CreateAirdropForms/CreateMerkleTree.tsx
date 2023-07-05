import { useState } from 'react';
import {
    Box,
    ButtonGroup,
    Button,
    Heading,
    Flex,
    FormControl,
    GridItem,
    FormLabel,
    Input,
    Select,
    SimpleGrid,
    InputLeftAddon,
    InputGroup,
    Textarea,
    FormHelperText,
    Text,
    Link,  
    Stack  
} from '@chakra-ui/react';

    
import {ExternalLinkIcon} from "@chakra-ui/icons";

const CreateMerkle = () => {
    const [wAddress,setWalletAddress] = useState<string>("");
    const [network,setNetwork] = useState<string>("devnet");
    const [maxTokens,setMaxTokens] = useState(0);
    return (
        <>
            <Heading w="100%" fontSize={"2xl"} textAlign={'center'} fontWeight="bold" mt="2%" mb="2%">
                Create Merkle Tree
            </Heading>
            
            <FormControl mt="2%">
                <FormLabel fontWeight={'normal'}>
                    Wallet address
                </FormLabel>
                <Input type="text" value={wAddress} onChange={(e) => setWalletAddress(e.target.value)}/>
                <FormHelperText>Wallet Address with which this project was setup.</FormHelperText>
            </FormControl>
            <Flex mt="2%" flexDirection={{base:"column",md:"row"}}>
                <FormControl flex={1} mr={{base:"0%",md:"5%"}}>
                    <FormLabel fontWeight={'normal'}>
                        Network
                    </FormLabel>
                    <Select value={network} onChange={(e) => setNetwork(e.target.value)}>
                        <option value='devnet' style={{color:"#202020"}}>devnet</option>
                        {/* <option value='testnet' style={{color:"#202020"}}>testnet</option> */}
                        <option value='mainnet-beta' style={{color:"#202020"}}>mainnet</option>
                    </Select>
                    <FormHelperText>Select Solana Network Cluster</FormHelperText>
                </FormControl>

                <FormControl flex={1} mt={{base:"2%",md:"0%"}}>
                    <FormLabel fontWeight={'normal'}>
                        No. of tokens To create
                    </FormLabel>
                    <Input type='number' placeholder="" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))}/>
                    <FormHelperText>Max NFTs the Tree will hold</FormHelperText>
                </FormControl>
            </Flex>
            <Stack mt={8} flexDirection={"column"}>
                <Button fontFamily={"heading"} colorScheme='purple'>Create Tree</Button>
                <Text textAlign={"center"} color={"whiteAlpha.400"} fontSize={"sm"} mt={2} fontFamily={"heading"}>To find out more about Merkle Trees and their capacity, <Link href='https://docs.shyft.to/start-hacking/nft/compressed-nft#create-merkle-tree' isExternal>click here</Link>,or visit <Link href='https://docs.shyft.to' isExternal>SHYFT Docs</Link> <ExternalLinkIcon mx='2px' mt="-0.5" /></Text>
            </Stack>
        </>
    );
};

export default CreateMerkle;

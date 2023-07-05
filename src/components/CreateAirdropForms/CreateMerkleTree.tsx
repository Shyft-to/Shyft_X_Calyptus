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

    
import {ExternalLinkIcon,CheckIcon,CloseIcon} from "@chakra-ui/icons";
import axios from 'axios';

type propsType = {
    setMerkleTree:any
}

const CreateMerkle = (props:propsType) => {
    const [wAddress,setWalletAddress] = useState<string>("");
    const [network,setNetwork] = useState<string>("devnet");
    const [maxTokens,setMaxTokens] = useState(0);

    const [loading,setLoading] = useState<"loading"|"success"|"failed"|"unloaded">("unloaded");

    const createTree = async () => {
        setLoading("loading");
        await axios.request({
            url:"/api/create-merkle-tree",
            method: "POST",
            data: {
                wallet_address:wAddress,
                total_tokens:maxTokens,
                network:network
            }
        })
        .then(res => {
            if(res.data.success === true)
            {
                setLoading("success");
                
                setTimeout(() => {
                    setLoading("unloaded");
                }, 2000);
            }
        })
        .catch(err => {

        })
    }
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
                {loading === "unloaded" && <Button fontFamily={"heading"} colorScheme='purple' onClick={createTree}>Create Tree</Button>}
                {loading === "success" && <Button fontFamily={"heading"} colorScheme='green' leftIcon={<CheckIcon />}>Success</Button>}
                {loading === "failed" && <Button fontFamily={"heading"} colorScheme='red' leftIcon={<CheckIcon />}>Failed</Button>}
                {loading === "loading" && <Button fontFamily={"heading"} colorScheme='purple' isLoading loadingText='Creating'>Creating</Button>}
                <Text textAlign={"center"} color={"whiteAlpha.400"} fontSize={"sm"} mt={2} fontFamily={"heading"}>To find out more about Merkle Trees and their capacity, <Link href='https://docs.shyft.to/start-hacking/nft/compressed-nft#create-merkle-tree' isExternal>click here</Link>,or visit <Link href='https://docs.shyft.to' isExternal>SHYFT Docs</Link> <ExternalLinkIcon mx='2px' mt="-0.5" /></Text>
            </Stack>
        </>
    );
};

export default CreateMerkle;

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
    Stack,
    Text,
    Link
    
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

type propsType ={
    activeMerkleTree: string,
    setMerkleTree: any,
    network: string,
    setNetwork: any,
    maxSupply: number,
    setSupply: any,
    metaUri: string,
    setMetaUri:any,
    setActiveStep:any
}
const CreateCompressedForms = (props:propsType) => {
    return ( 
        <>
            <Heading w="100%" fontSize={"2xl"} textAlign={'center'} fontWeight="bold" mt="4%" mb="2%">
                NFT Minting Details
            </Heading>
            
            <Flex mt="2%" flexDirection={{base:"column",md:"row"}}>
                <FormControl flex={1} mr={{base:"0%",md:"5%"}}>
                    <FormLabel fontWeight={'normal'}>
                        Network
                    </FormLabel>
                    <Select value={props.network} onChange={(e) => props.setNetwork(e.target.value)}>
                        <option value='devnet' style={{color:"#202020"}}>devnet</option>
                        {/* <option value='testnet' style={{color:"#202020"}}>testnet</option> */}
                        <option value='mainnet-beta' style={{color:"#202020"}}>mainnet</option>
                    </Select>
                    <FormHelperText>Select Solana Network Cluster</FormHelperText>
                </FormControl>

                <FormControl flex={1} mt={{base:"2%",md:"0%"}}>
                    <FormLabel fontWeight={'normal'}>
                        Max Supply
                    </FormLabel>
                    <Input type='number' placeholder="" value={props.maxSupply} onChange={(e) => props.setSupply(Number(e.target.value))}/>
                    <FormHelperText>No. of unique editions to be minted</FormHelperText>
                </FormControl>
            </Flex>
            <FormControl mt="2%">
                <FormLabel fontWeight={'normal'}>
                    Merkle Tree
                </FormLabel>
                <Input type="text" value={props.activeMerkleTree} onChange={(e) => props.setMerkleTree(e.target.value)}/>
                <FormHelperText>Merkle Tree to which token will be added to</FormHelperText>
            </FormControl>
            <FormControl mt="2%">
                <FormLabel fontWeight={'normal'}>
                    Metadata URI
                </FormLabel>
                <Input type="text" value={props.metaUri} onChange={(e) => props.setMetaUri(e.target.value)}/>
                <FormHelperText>Metaplex Non-fungible Standard JSON file URL</FormHelperText>
            </FormControl>
            <Text textAlign={"center"} color={"whiteAlpha.400"} fontSize={"sm"} mt={2} fontFamily={"heading"}>To learn how to create NFT metadata, please visit <Link href='https://docs.shyft.to/start-hacking/storage#post-https-api.shyft.to-sol-v1-metadata-create' isExternal>https://docs.shyft.to</Link> <ExternalLinkIcon mx='2px' mt="-0.5" /></Text>
            {/* <FormControl mt="2%">
                <FormLabel fontWeight={'normal'}>
                    Collection Address
                </FormLabel>
                <Input type="text" />
                <FormHelperText>Address of the collection to be created</FormHelperText>
            </FormControl> */}
            
            <Stack mt={8} flexDirection={"column"}>
                <Button fontFamily={"heading"} colorScheme='purple' onClick={() => props.setActiveStep(2)}>Select Holders to Drop</Button>
                <Text textAlign={"center"} color={"whiteAlpha.400"} fontSize={"sm"} mt={2} fontFamily={"heading"}>To find out more about Compressed NFTs,  <Link href='https://docs.shyft.to/start-hacking/nft/compressed-nft' isExternal>click here</Link>,or visit <Link href='https://docs.shyft.to' isExternal>SHYFT Docs</Link> <ExternalLinkIcon mx='2px' mt="-0.5" /></Text>
            </Stack>
        </>
    );
}
 
export default CreateCompressedForms;
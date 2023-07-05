import {useState} from "react";
import axios from "axios";
import {
    Flex,
    Box,
    Text,
    Center,
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Stack,
    Image,
    Spacer,
    ButtonGroup,
    Heading,
    Button,
    Spinner
} from '@chakra-ui/react';
import formatAddresses from '../utils/functions';
type paramType = {
    address: string,
    network: string,
    setAllData: any,
    allData: any;
};
const OwnerList = (props: paramType) => {
    
    const [loading,setLoading] = useState<'unloaded'| 'loading' | 'loaded'>('unloaded');

    const reloadData = async () => {
        
        if(props.address && props.network)
        {
            
            setLoading('loading');
            props.setAllData([]);
            await axios({
                // Endpoint to get NFTs
                url: '/api/get-all-data',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420"
                },
                data: {
                    address:props.address,
                    network:props.network,
                    // address:"CqvtCFJT7pLRH1FigAQ2HzzdXNzUcYTuXdV5L4E6zaHU",
                    // network:'devnet',
                }
            })
            // Handle the response from backend here
            .then((res) => {
                setLoading('loaded');
                console.log(res.data.success);
                if(res.data.success === true)
                {
                    props.setAllData(res.data.result);
                }
                
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                
            });
        }
    }

    return (
        <div>
            <Box as={'div'} minH={'60vh'} width={'full'} pt={4}>
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
                            <Flex>
                                <Heading size="sm">
                                    Current Holder Snapshot
                                </Heading>
                                {loading === "loading" && <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        size='sm'
                                    />}
                            </Flex>
                            
                        </Box>
                        <Spacer />
                        <ButtonGroup gap="2">
                            <Button colorScheme={"yellow"} fontSize={"sm"} onClick={reloadData}>Refresh</Button>
                        </ButtonGroup>
                    </Flex>
                <TableContainer mt={8} border={'1px'} borderRadius={8} borderColor={'whiteAlpha.600'} px={4} py={6}>
                    <Table variant="simple">
                        <TableCaption>NFTs and their current holders. Reload to view updated data.</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th textAlign={'center'}>Mint</Th>
                                <Th textAlign={'center'}>Current holder</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {props.allData.map((nft: any) => (
                                <Tr key={nft.mint}>
                                    <Td>
                                        <Stack direction={'row'} align={'center'}>
                                            <Flex
                                                w={'44px'}
                                                h={'44px'}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'full'}
                                                bg={'#fff'}
                                            >
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="40px"
                                                    src={nft.nft_data.cached_image_uri}
                                                    alt="Nft image"
                                                />
                                            </Flex>
                                            <Text
                                                fontWeight={600}
                                                color={'pink.300'}
                                                fontSize={{ base: 'xs', md: 'sm' }}
                                            >
                                                {nft.nft_data.name ?? ''}
                                            </Text>
                                        </Stack>
                                    </Td>
                                    <Td textAlign={'center'}>
                                        <Text fontWeight={600} fontSize={{ base: 'xs', md: 'sm' }}>
                                            {formatAddresses(nft.nft_data.mint ?? '')}
                                        </Text>
                                    </Td>
                                    <Td textAlign={'center'}>
                                        <Text fontWeight={600} fontSize={{ base: 'xs', md: 'sm' }}>
                                            {formatAddresses(nft.current_holder ?? '')}
                                        </Text>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            {/* <Flex color='white' flexWrap={"wrap"} justifyContent={"space-around"} mb={1}>
                <Box flex='1' bg={"white"} border={"1px"} padding={2}>
                    <Center color={"pink.600"} fontWeight={600} fontFamily={'customHeading'}>Name</Center>
                </Box>
                <Box flex='1' bg={"white"} color={"pink.800"} border={"1px"} padding={2}>
                    <Center>Address</Center>   
                </Box>
                <Box flex='1' bg={"white"} color={"pink.800"} border={"1px"} padding={2}>
                    <Center>Current Holder</Center>
                </Box>
            </Flex>
            {props.allData.map((nft:any) => <Flex key={nft.id} color='white' flexWrap={"wrap"} justifyContent={"space-around"}>
                <Box flex='1' bg={"pink.600"} padding={2}>
                    <Center>{nft.nft_data.name}</Center>
                </Box>
                <Box flex='1' bg={"pink.600"} padding={2}>
                    <Center>{nft.nft_data.mint?.substr(0,24)}...</Center>   
                </Box>
                <Box flex='1' bg={"pink.600"} padding={2}>
                    <Center>{nft.current_holder?.substr(0,24)}...</Center>
                </Box>
            </Flex>)} */}
        </div>
    );
};

export default OwnerList;

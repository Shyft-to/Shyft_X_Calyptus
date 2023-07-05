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
    

} from '@chakra-ui/react';
import { AddIcon,MinusIcon } from '@chakra-ui/icons'
import formatAddresses from '../../utils/functions';

type propsType = {
    allData: any,
    selectedHolders:any,
    setSelectedHolders:any
}

const AirdropNfts = (props: propsType) => {
    const addOrRemove = (owner:string,type:string) => {
        if(type === "ADD")
        {
            const currentSelected = props.selectedHolders;
            props.setSelectedHolders([...currentSelected,owner]);
        }
        else
        {
            const currentSelected = props.selectedHolders;
            const removedOwners =  currentSelected.filter((own:string) => own !== owner);
            props.setSelectedHolders(removedOwners);
        }
    } 
    return ( 
        <>
            <TableContainer mt={8} border={'1px'} borderRadius={8} borderColor={'whiteAlpha.600'} px={4} py={5}>
                <Table variant="simple">
                    <TableCaption>Select and Airdrop cNFTs to various holders</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Token</Th>
                            <Th>Current holder</Th>
                            <Th textAlign={"end"} width={"32px"}></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {props.allData.map((nft:any) => <Tr key={nft.nft_data.mint}>
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
                            <Td>
                                <Text fontWeight={600} fontSize={{base:"xs",md:"sm"}}>{formatAddresses(nft.current_holder ?? "")}</Text>
                            </Td>
                            <Td>
                                {
                                    props.selectedHolders.includes(nft.current_holder)?
                                    <Button
                                        colorScheme='pink'
                                        aria-label='Airdrop Tokens'
                                        size='xs'
                                        variant='solid'
                                        fontFamily={'heading'}
                                        leftIcon={<MinusIcon />}
                                        onClick={() => addOrRemove(nft.current_holder,"REMOVE")}
                                    >
                                        Selected
                                    </Button>:
                                    <Button
                                        colorScheme='pink'
                                        aria-label='Airdrop Tokens'
                                        size='xs'
                                        variant='outline'
                                        fontFamily={'heading'}
                                        leftIcon={<AddIcon />}
                                        onClick={() => addOrRemove(nft.current_holder,"ADD")}
                                    >
                                        Select
                                    </Button>

                                }
                                
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
                        
                    </Tbody>
                </Table>
            </TableContainer>
        </> 
    );
}
 
export default AirdropNfts;
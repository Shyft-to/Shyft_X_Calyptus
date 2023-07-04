import { Text, Flex, Box, Center, Stack, Image } from '@chakra-ui/react';
import { useState,useEffect } from 'react';
import axios from 'axios';
type paramType = {
    address: string,
    network: string,
    setAllData: any
}

const NftList = (props: paramType) => {
    const [nfts,setNfts] = useState([]);
    const [loading,setLoading] = useState<'unloaded'| 'loading' | 'loaded'>('unloaded');
    useEffect(() => {
        if(props.address && props.network)
        {
            setLoading('loading');
            axios({
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
                    setNfts(res.data.result);
                    props.setAllData(res.data.result);
                }
                
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                
            });
        }
        
    
      
    }, [props.address,props.network])
    

    return (
        <div>
            {nfts.length > 0 && <Flex color="white" justifyContent={{ base: 'center', md: 'space-around' }} flexWrap={'wrap'}>
                {nfts.map((nft:any) => 
                <Box minW={'250px'} px={8} key={nft.id}>
                    <Center py={8}>
                        <Box
                            role={'group'}
                            p={3}
                            maxW={'250px'}
                            w={'full'}
                            bg={'gray.800'}
                            boxShadow={'2xl'}
                            rounded={'xl'}
                            pos={'relative'}
                            zIndex={1}
                        >
                            <Box
                                rounded={'lg'}
                                mt={-1}
                                pos={'relative'}
                                height={'220px'}
                                _after={{
                                    transition: 'all .3s ease',
                                    content: '""',
                                    w: 'full',
                                    h: 'full',
                                    pos: 'absolute',
                                    top: 0,
                                    left: 0,
                                    backgroundImage: `url(${nft.nft_data.cached_image_uri})`,
                                    filter: 'blur(5px)',
                                    zIndex: -1,
                                }}
                                _groupHover={{
                                    _after: {
                                        filter: 'blur(20px)',
                                    },
                                }}
                            >
                                <Image rounded={'lg'} height={230} width={282} objectFit={'cover'} src={nft.nft_data.cached_image_uri} alt='nft_image'/>
                            </Box>
                            <Stack pt={10} pb={2} align={'center'}>
                                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                    {nft.nft_data.name}
                                </Text>
                                {/* <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                    Nice Chair, pink
                                </Heading> */}
                                
                            </Stack>
                        </Box>
                    </Center>
                </Box>)}
                
            </Flex>}
        </div>
    );
};

export default NftList;

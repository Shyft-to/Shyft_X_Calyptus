import { Text, Flex, Box, Center, useColorModeValue, Heading, Stack, Image } from '@chakra-ui/react';
const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';
const NftList = () => {
    return (
        <div>
            <Flex color="white" justifyContent={{ base: 'center', md: 'space-around' }} flexWrap={'wrap'}>
                <Box minW={'250px'} px={8}>
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
                                    backgroundImage: `url(${IMAGE})`,
                                    filter: 'blur(5px)',
                                    zIndex: -1,
                                }}
                                _groupHover={{
                                    _after: {
                                        filter: 'blur(20px)',
                                    },
                                }}
                            >
                                <Image rounded={'lg'} height={230} width={282} objectFit={'cover'} src={IMAGE} alt='nft_image'/>
                            </Box>
                            <Stack pt={10} pb={2} align={'center'}>
                                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                    Brand
                                </Text>
                                {/* <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                    Nice Chair, pink
                                </Heading> */}
                                
                            </Stack>
                        </Box>
                    </Center>
                </Box>
                <Box bg="blue.500" minW={'290px'}>
                    <Text>Box 2</Text>
                </Box>
                <Box bg="tomato" minW={'290px'}>
                    <Text>Box 3</Text>
                </Box>
            </Flex>
        </div>
    );
};

export default NftList;

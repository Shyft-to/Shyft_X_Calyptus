import { Flex,Box,Text,Center } from "@chakra-ui/react";
type paramType = {
    allData: any
}
const OwnerList = (props:paramType) => {
    
    return ( 
        <div>
            <Flex color='white' flexWrap={"wrap"} justifyContent={"space-around"} mb={1}>
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
            </Flex>)}
            
        </div> 
    );
}
 
export default OwnerList;
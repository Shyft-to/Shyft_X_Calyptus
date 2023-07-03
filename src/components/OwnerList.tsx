import { Flex,Box,Text } from "@chakra-ui/react";
const OwnerList = () => {
    return ( 
        <div>
            <Flex color='white' flexWrap={"wrap"} justifyContent={"space-around"}>
                <Box flex='1' bg='blue'>
                    <Text>Box 3</Text>
                </Box>
                <Box flex='1' bg='tomato'>
                    <Text>Box 3</Text>
                </Box>
                <Box flex='1' bg='blue'>
                    <Text>Box 3</Text>
                </Box>
            </Flex>
        </div> 
    );
}
 
export default OwnerList;
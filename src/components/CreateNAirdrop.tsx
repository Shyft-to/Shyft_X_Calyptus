import { useState } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  Flex,
} from '@chakra-ui/react';

import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
  } from '@chakra-ui/react'

import { useToast,useSteps } from '@chakra-ui/react';
import CreateMerkle from './CreateAirdropForms/CreateMerkleTree';
import CreateCompressedForms from './CreateAirdropForms/CreateCompressedForms';
import AirdropNfts from './CreateAirdropForms/AirdropNfts';

const steps = [
    { title: 'Create', description: 'Merkle Tree' },
    { title: 'Create Token', description: 'Compressed NFT' },
    { title: 'Select Holders', description: '& Airdrop' },
  ]

  type propsType = {
    allData: any
}
const CreateNAirdrop = (props:propsType) => {
const toast = useToast();
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const [selectedHolders,setSelectedHolders] = useState<[]>([]);
  const [activeMerkleTree,setMerkleTree] = useState<string>("");
  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        m="10px auto"
        p={6}
        >
          <Box
            m="10px auto"
          >
            <Stepper size='md' colorScheme='pink' index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index} onClick={() => setActiveStep(index)}>
                    <StepIndicator>
                        <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0' fontFamily={"heading"}>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                    </Step>
                ))}
            </Stepper>
          </Box>
          <Box
            m="10px auto"
            pt={"12px"}
          >
        {activeStep === 0 ? <CreateMerkle setMerkleTree={setMerkleTree} /> : activeStep === 1 ? <CreateCompressedForms /> : <AirdropNfts allData={props.allData} selectedHolders={selectedHolders} setSelectedHolders={setSelectedHolders} />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setActiveStep(activeStep - 1);
                }}
                isDisabled={activeStep === 0}
                colorScheme="pink"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={activeStep === 2}
                onClick={() => {
                  setActiveStep(activeStep + 1);
                }}
                colorScheme="pink"
                variant="outline">
                Next
              </Button>
            </Flex>
            {activeStep === 2 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
        </Box>
      </Box>
    </>
  );
}
 
export default CreateNAirdrop;
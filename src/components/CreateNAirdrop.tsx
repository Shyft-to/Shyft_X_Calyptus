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
    Text
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

const CreateNAirdrop = () => {
const toast = useToast();
  
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })
  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
            <Stepper index={activeStep}>
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
                        <StepDescription><Text color={"whiteAlpha.600"}>{step.description}</Text></StepDescription>
                    </Box>

                    <StepSeparator />
                    </Step>
                ))}
            </Stepper>
        
        {activeStep === 1 ? <CreateMerkle /> : activeStep === 2 ? <CreateCompressedForms /> : <AirdropNfts />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                    
                  
                  setActiveStep(activeStep - 1);
                }}
                isDisabled={activeStep === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={activeStep === 3}
                onClick={() => {
                  setActiveStep(activeStep + 1);
                }}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {activeStep === 3 ? (
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
    </>
  );
}
 
export default CreateNAirdrop;
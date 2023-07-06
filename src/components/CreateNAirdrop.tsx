import { useState,useEffect } from 'react';
import { Box, ButtonGroup, Button, Flex } from '@chakra-ui/react';

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
} from '@chakra-ui/react';
import axios from 'axios';

import { useSteps } from '@chakra-ui/react';
import CreateMerkle from './CreateAirdropForms/CreateMerkleTree';
import CreateCompressedForms from './CreateAirdropForms/CreateCompressedForms';
import AirdropNfts from './CreateAirdropForms/AirdropNfts';

const steps = [
    { title: 'Create', description: 'Merkle Tree' },
    { title: 'Create Token', description: 'Compressed NFT' },
    { title: 'Select Holders', description: '& Airdrop' },
];

type propsType = {
    allData: any;
};
const CreateNAirdrop = (props: propsType) => {
    // const toast = useToast();

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const [selectedHolders, setSelectedHolders] = useState<[]>([]);
    const [allselectRan,setAllSelectRan] = useState(false);
    const [activeMerkleTree, setMerkleTree] = useState<string>('');
    const [network, setNetwork] = useState<string>('devnet');
    const [maxSupply, setSupply] = useState<number>(0);
    const [metaUri, setMetaUri] = useState<string>('');

    const [loading, setLoading] = useState<'loading' | 'success' | 'failed' | 'unloaded'>('unloaded');
    const [message, setMessage] = useState<string>('');
    const [responseMerkle, setRespMerkle] = useState<string>('');

    useEffect(() => {
        if(props.allData.length > 0)
            selectAll()
    }, [props.allData])

    const selectAll = async() => {
        console.log("CURRENT SELECTED ALL: ",props.allData);
        const dataAllData:any = []
        await props.allData.map(async (item:any) => {
            dataAllData.push(item.current_holder);
          });
        setSelectedHolders(dataAllData);
        // setAllSelectRan(true);
    }
    

    const createNAirdropTokens = async () => {
        setMessage('');
        const validNetworks = ['devnet', 'mainnet-beta'];
        var errorOcc = false;
        try {
            if (activeMerkleTree === '') throw new Error('NO_TREE');
            else if (validNetworks.includes(network) === false) throw new Error('INVALID_NETWORK');
            else if (maxSupply < 0) throw new Error('MAX_SUPPLY_ERROR');
            else if (metaUri === '') throw new Error('NO_METADATA');
            else if (selectedHolders.length < 1) throw new Error('NO_HOLDERS');
        } catch (error: any) {
            if (error.message === 'NO_TREE') setMessage('Merkle Tree not found');
            else if (error.message === 'INVALID_NETWORK') setMessage('Invalid Network Selected');
            else if (error.message === 'MAX_SUPPLY_ERROR') setMessage('Max supply should be atleast 0');
            else if (error.message === 'NO_METADATA') setMessage('Invalid metadata uri');
            else if (error.message === 'NO_HOLDERS') setMessage('Please select atleast one holder');

            errorOcc = true;
        }
        if (!errorOcc) {
            setLoading('loading');
            await axios
                .request({
                    url: '/api/create-and-airdrop-cnft',
                    method: 'POST',
                    data: {
                        merkle_tree: activeMerkleTree,
                        max_supply: maxSupply,
                        network: network,
                        metadata_uri: metaUri,
                        holders: selectedHolders,
                    },
                })
                .then((res) => {
                    if (res.data.success === true) {
                        setLoading('success');
                        setRespMerkle(res.data.result.tree);
                        setMessage(`Compressed NFTs have been Airdropped`);
                        setTimeout(() => {
                            setLoading('unloaded');
                        }, 2000);
                    } else {
                        setLoading('failed');
                        setTimeout(() => {
                            setLoading('unloaded');
                        }, 1000);
                    }
                })
                .catch((err) => {
                    setLoading('failed');
                    setMessage(`Error: ${err.message}`);
                    setTimeout(() => {
                        setLoading('unloaded');
                    }, 1000);
                });
        }
    };

    return (
        <>
            <Box borderWidth="1px" rounded="lg" shadow="1px 1px 3px rgba(0,0,0,0.3)" maxWidth={800} m="10px auto" p={6}>
                <Box m="10px auto">
                    <Stepper size={{ base: 'xs', md: 'md' }} colorScheme="pink" index={activeStep}>
                        {steps.map((step, index) => (
                            <Step key={index} onClick={() => setActiveStep(index)}>
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>

                                <Box flexShrink="0" fontFamily={'heading'}>
                                    <StepTitle>{step.title}</StepTitle>
                                    <StepDescription>{step.description}</StepDescription>
                                </Box>

                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box m="10px auto" pt={'12px'}>
                    {activeStep === 0 ? (
                        <CreateMerkle setMerkleTree={setMerkleTree} />
                    ) : activeStep === 1 ? (
                        <CreateCompressedForms
                            activeMerkleTree={activeMerkleTree}
                            setMerkleTree={setMerkleTree}
                            network={network}
                            setNetwork={setNetwork}
                            maxSupply={maxSupply}
                            setSupply={setSupply}
                            metaUri={metaUri}
                            setMetaUri={setMetaUri}
                            setActiveStep={setActiveStep}
                        />
                    ) : (
                        <AirdropNfts
                            allData={props.allData}
                            selectedHolders={selectedHolders}
                            setSelectedHolders={setSelectedHolders}
                            createNAirdropTokens={createNAirdropTokens}
                            loading={loading}
                            setLoading={setLoading}
                            message={message}
                            responseMerkle={responseMerkle}
                            network={network}
                        />
                    )}
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
                                    mr="5%"
                                >
                                    Back
                                </Button>
                                <Button
                                    w="7rem"
                                    isDisabled={activeStep === 2}
                                    onClick={() => {
                                        setActiveStep(activeStep + 1);
                                    }}
                                    colorScheme="pink"
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </Flex>
                            {/* {activeStep === 2 ? (
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
            ) : null} */}
                        </Flex>
                    </ButtonGroup>
                </Box>
            </Box>
        </>
    );
};

export default CreateNAirdrop;

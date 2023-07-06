import type { NextApiRequest, NextApiResponse } from 'next';
import {clusterApiUrl,Connection,Transaction,Keypair} from "@solana/web3.js";
import type {Cluster,Signer} from "@solana/web3.js";

import { decode } from 'bs58';
import { Buffer } from 'buffer';

import {
    getConcurrentMerkleTreeAccountSize,
    ALL_DEPTH_SIZE_PAIRS,
    ValidDepthSizePair,
  } from "@solana/spl-account-compression";
//import { ShyftSdk, Network, TxnAction } from '@shyft-to/js';
import axios from 'axios';
type Responses = {
    success: boolean;
    message: string;
    result: any;
};
type TreeSpecsReturn = {
    max_depth: number;
    max_buffer_size: number; 
    canopy_depth: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Responses>) {
    if (req.method === 'POST') {
        var response: Responses = {
            success: false,
            message: '',
            result: {},
        };
        var statusCode = 0;
        try {
            var network:Cluster = "devnet";
            var wallet_address:string = "";
            var total_tokens:number = 0;
            var fee_payer: string = "";

            // wallet_address = (typeof req.body.wallet_address === "string") ? req.body.wallet_address : '';
            wallet_address = process.env.NEXT_PUBLIC_KEY ?? "";
            total_tokens = (typeof req.body.total_tokens === "number") ? req.body.total_tokens : 0;

            // total_tokens = Array.isArray(req.body.create_callbacks_on) ? req.body.create_callbacks_on : [];
            network = (typeof req.body.network === "string")?req.body.network:"mainnet-beta";

            const treeSpecs = getTreeSpecs(total_tokens);

            if(total_tokens > 1000000)
                throw new Error("TOO_MANY_TOKENS")
            
            var response_from_api:any = {};

            const raw = {
                "network": network,
                "wallet_address": wallet_address,
                max_depth_size_pair: {
                  max_depth: treeSpecs.max_depth,
                  max_buffer_size: treeSpecs.max_buffer_size
                },
                canopy_depth: treeSpecs.canopy_depth,
                fee_payer: fee_payer
              };
            console.log("Request Prams: ");
            console.dir(raw,{depth:null});
            

            await axios.request({
                url:"https://api.shyft.to/sol/v1/nft/compressed/create_tree",
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_SHYFT_API_KEY
                },
                data:JSON.stringify(raw)
            })
            .then(res => {
                console.dir(res.data,{depth:null});
                response_from_api = res.data;
                
            })
            .catch(error => {
                console.dir(error.response.data,{depth:null});
                throw error;
            });
            
            const recoveredTxn = await signAndSendTransactionWithPrivateKeys(network,response_from_api.result.encoded_transaction,[process.env.NEXT_PRIVATE_KEY ?? ""])
            if(recoveredTxn)
            {
                response = {
                    success: response_from_api.success,
                    message: response_from_api.message,
                    result: {"tree":response_from_api.result.tree},
                };
                statusCode = 201;
            }
            else
                throw new Error("COULD_NOT_SIGN");
        
        } catch (error:any) {
            if (error.message === 'TOO_MANY_TOKENS') {
                response = {
                    success: false,
                    message: 'Please Enter proper Params',
                    result: {},
                };
                statusCode = 400;
            }
            else if (error.message === 'CALLBACK_NOT_CREATED') {
                response = {
                    success: false,
                    message: 'Error Monitoring the addresses',
                    result: {},
                };
                statusCode = 403;
            }
            else if (error.message === 'INSERT_TO_DB_FAILED') {
                response = {
                    success: false,
                    message: 'Error Updating the DB',
                    result: {},
                };
                statusCode = 403;
            }
            else if (error.message === 'COULD_NOT_GET_CBDATA') {
                response = {
                    success: false,
                    message: 'Database unavailable',
                    result: {},
                };
                statusCode = 503;
            }
            else if (error.message === 'COULD_NOT_SIGN') {
                response = {
                    success: false,
                    message: 'Signer Error',
                    result: {},
                };
                statusCode = 503;
            }
            else {
                response = {
                    success: false,
                    message: error.message,
                    result: {},
                };
                statusCode = 500;
            }
        }
        res.status(statusCode).json(response);
    }
    else
    {
        res.status(400).json({
            success: false,
            message: 'You cannot GET form this endpoint',
            result: {},
        });
    }
    
}

// make a simple, deduplicated list of the allowed depths
const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap(
    (pair) => pair.maxDepth,
  ).filter((item, pos, self) => self.indexOf(item) == pos);
  
  // extract the largest depth that is allowed
  const largestDepth = allDepthSizes[allDepthSizes.length - 1];
  
  const defaultDepthPair = {
    maxDepth: 3,
    maxBufferSize: 8,
  };


function getTreeSpecs(tokensToBeMinted:number):TreeSpecsReturn
{
    try {
        let maxDepth = defaultDepthPair.maxDepth;
        const nodes = parseInt(tokensToBeMinted.toString());
        console.log("Nodes",nodes);
        if (!tokensToBeMinted || nodes <= 0) return {max_depth: 3,max_buffer_size: 8, canopy_depth: 0}; //less than 100 result 3
        
        /**
         * The only valid depthSizePairs are stored in the on-chain program and SDK
         */
        for (let i = 0; i <= allDepthSizes.length; i++) {
        if (Math.pow(2, allDepthSizes[i]) >= nodes) {
            maxDepth = allDepthSizes[i];
            break;
        }
        }

        const maxBufferSize =
        ALL_DEPTH_SIZE_PAIRS.filter((pair) => pair.maxDepth == maxDepth)?.[0]
            ?.maxBufferSize ?? defaultDepthPair.maxBufferSize;

        // canopy depth must not be above 17 or else it no worky,
        const maxCanopyDepth = maxDepth >= 20 ? 17 : maxDepth;
        
        return {max_depth: maxDepth,max_buffer_size: maxBufferSize, canopy_depth: 0}
    } catch (error) {
        return {max_depth: 14,max_buffer_size: 1024, canopy_depth: 0}
    }
    
}

export async function signAndSendTransactionWithPrivateKeys(
    network: Cluster,
    encodedTransaction: string,
    privateKeys: string[]
  ): Promise<string> {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const signedTxn = await partialSignTransactionWithPrivateKeys(
      encodedTransaction,
      privateKeys
    );
  
    const signature = await connection.sendRawTransaction(
      signedTxn.serialize({ requireAllSignatures: false })
    );
    return signature;
  }

  export async function partialSignTransactionWithPrivateKeys(
    encodedTransaction: string,
    privateKeys: string[]
  ): Promise<Transaction> {
    const recoveredTransaction = getRawTransaction(encodedTransaction);
    const signers = getSignersFromPrivateKeys(privateKeys);
    recoveredTransaction.partialSign(...signers);
    return recoveredTransaction;
  }

  function getRawTransaction(encodedTransaction: string): Transaction {
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, 'base64')
    );
    return recoveredTransaction;
  }
  function getSignersFromPrivateKeys(privateKeys: string[]): Signer[] {
    return privateKeys.map((privateKey) => {
      const signer = Keypair.fromSecretKey(decode(privateKey)) as Signer;
      return signer;
    });
  }
import type { NextApiRequest, NextApiResponse } from 'next';
//import { ShyftSdk, Network, TxnAction } from '@shyft-to/js';
import axios from 'axios';
type Responses = {
    success: boolean;
    message: string;
    result: {};
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
            var network:string = "";
            var merkle_tree:string = "";
            var max_supply:number = 0;
            var metadata_uri: string = "";
            var collection_address: string = "";
            var holders:[] = [];

            network = (typeof req.body.network === "string")?req.body.network:"mainnet-beta";
            merkle_tree = (typeof req.body.merkle_tree === "string") ? req.body.merkle_tree : '';
            max_supply = (typeof req.body.max_supply === "number") ? req.body.max_supply : 0;
            metadata_uri = (typeof req.body.metadata_uri === "string") ? req.body.metadata_uri : '';
            collection_address = (typeof req.body.collection_address === "string") ? req.body.collection_address : '';

            holders = (typeof req.body.holders !== "string" && req.body.holders?.length > 0) ? req.body.holders : '';

            for (let index = 0; index < holders.length; index++) {
                const holder:string = holders[index];

                var raw = {
                    network: network,
                    creator_wallet: process.env.NEXT_PUBLIC_KEY,
                    metadata_uri: metadata_uri,
                    merkle_tree: merkle_tree,
                    collection_address: collection_address,
                    max_supply: max_supply,
                    receiver: holder
                };
                console.log("params:");
                console.dir(raw,{depth:null});
                
                var response_from_api:any = {};

                await axios.request({
                    url:"https://api.shyft.to/sol/v1/nft/compressed/mint",
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
                    response = {
                        success: res.data.status,
                        message: res.data.message,
                        result: res.data.result,
                    };
                    statusCode = 201;
                })
                .catch(error => {
                    console.dir(error.response.data,{depth:null});
                    throw error;
                });
                //sign here
                break;
            }

            // total_tokens = Array.isArray(req.body.create_callbacks_on) ? req.body.create_callbacks_on : [];
        
            
        } catch (error:any) {
            if (error.message === 'WRONG_PARAM') {
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
            else {
                response = {
                    success: false,
                    message: 'Internal Server Error',
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
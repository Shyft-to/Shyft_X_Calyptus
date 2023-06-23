import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ShyftSdk, Network } from '@shyft-to/js';
import axios from 'axios';


const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Responses = {
    success: boolean;
    message: string;
    result: {};
};
type ShyftArrayResultResponse = {
    success: boolean;
    message?: string;
    result: object[];
}
const shyftClient = new ShyftSdk({ apiKey: process.env.NEXT_SHYFT_API_KEY ?? '', network: Network.Mainnet });

export default async function handler(req: NextApiRequest, res: NextApiResponse<Responses>) {
    if (req.method === 'POST') {
        var response: Responses = {
            success: false,
            message: '',
            result: {},
        };
        var statusCode = 0;
        try {
            console.log('------------Update Mints Called--------------');
            //console.log(req.body);
            var reference_address: string = '';
            var addresses_to_monitor: string[] = [];
            var network:string = '';

            reference_address = (typeof req.body.reference_address === "string")?req.body.reference_address:"";
            addresses_to_monitor = Array.isArray(req.body.create_callbacks_on)?req.body.create_callbacks_on:[];
            network = (typeof req.body.network === "string")?req.body.network:"mainnet-beta";


            if (reference_address && addresses_to_monitor.length && network) {
                console.dir(addresses_to_monitor,{depth:null});
                
                const nftOwners = await shyftClient.nft.getOwners({network:Network.Devnet,mints:addresses_to_monitor});
                console.log(nftOwners);
                if(nftOwners.length === 0)
                    throw new Error('NO_NFT_DATA');

                const allOwners:object[] = nftOwners;
                // const allOwners:object[] = [];
                for(var i = 0; i < allOwners.length; i++)
                {
                    const eachOwner:any = allOwners[i];
                    //fetch NFT metadata here
                    const insertToDb = await supabase.from('monitor_mints').upsert({
                        mint_address: eachOwner.nft_address,
                        current_holder: eachOwner.owner
                    });
                    if (insertToDb.error !== null) 
                        throw new Error('INSERT_TO_DB_FAILED');
                }
                
                console.log('All Operations Complete');
                response = {
                    success: true,
                    message: `Owners Added for ${allOwners.length} NFT`,
                    result: {},
                };
                statusCode = 200;
                
            } else {
                throw new Error('WRONG_PARAM');
            }
        } catch (error:any) {
            if (error.message === 'WRONG_PARAM') {
                response = {
                    success: false,
                    message: 'Please Enter proper Params',
                    result: {},
                };
                statusCode = 400;
            }
            else if (error.message === 'NO_NFT_DATA'){
                response = {
                    success: false,
                    message: 'Unable to fetch NFT owners',
                    result: {},
                };
                statusCode = 403;
            }
            else if (error.message === 'INSERT_TO_DB_FAILED'){
                response = {
                    success: false,
                    message: 'Error Updating the DB',
                    result: {},
                };
                statusCode = 403;
            }
            else
            {
                response = {
                    success: false,
                    message: error.message,
                    result: {},
                };
                statusCode = 500;
            }
        }

        res.status(statusCode).json(response);
    } else {
        res.status(403).json({
            success: false,
            message: 'You cannot GET form this Endpoint',
            result: {},
        });
    }
}

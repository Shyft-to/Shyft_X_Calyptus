// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ShyftSdk, Network, TxnAction } from '@shyft-to/js';

const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Responses = {
    success: boolean;
    message: string;
    result: {};
};
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
            console.log('------------Hello Called--------------');
            console.log(req.body);
            var reference_address: string = '';
            var addresses_to_monitor: string[] = [];

            reference_address = (typeof req.body.reference_address === "string")?req.body.reference_address:'';
            addresses_to_monitor = Array.isArray(req.body.create_callbacks_on)?req.body.create_callbacks_on:[];


            if (reference_address && addresses_to_monitor.length) {
                const callbackCreate = await shyftClient.callback.register({
                    network: Network.Mainnet,
                    addresses: addresses_to_monitor,
                    events: [TxnAction.NFT_TRANSFER, TxnAction.NFT_BURN, TxnAction.NFT_SALE],
                    callbackUrl: '',
                });
                
                if(!callbackCreate.hasOwnProperty("id"))
                    throw new Error('CALLBACK_NOT_CREATED');
                
                const insertToDb = await supabase.from('callback_details').insert({
                    reference_address: reference_address,
                });

                if (insertToDb.error !== null) 
                    throw new Error('INSERT_TO_DB_FAILED');
                
                console.log('All Operations Complete');
                response = {
                    success: true,
                    message: `Monitoring has been enabled for ${addresses_to_monitor.length} addresses`,
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
            else if (error.message === 'CALLBACK_NOT_CREATED'){
                response = {
                    success: false,
                    message: 'Error Monitoring the addresses',
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
                    message: 'Internal Server Error',
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

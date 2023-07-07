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
// type DbData = {
//     id?: number,
//     created_at?: any,
//     reference_address?: string,
//     monitor_addresses?: {
//         addresses: []
//     },
//     callback_id?:string,
//     network?:string
// };

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
            console.log('------------Create Callback Called--------------');
            // console.log(req.body);
            var reference_address: string = '';
            var addresses_to_monitor: string[] = [];
            var network: string = '';

            reference_address = typeof req.body.reference_address === 'string' ? req.body.reference_address : '';
            addresses_to_monitor = Array.isArray(req.body.create_callbacks_on) ? req.body.create_callbacks_on : [];
            network = typeof req.body.network === 'string' ? req.body.network : 'mainnet-beta';

            var shyftNetwork: Network = Network.Mainnet;
            if (network === 'mainnet-beta') shyftNetwork = Network.Mainnet;
            else if (network === 'devnet') shyftNetwork = Network.Devnet;
            else if (network === 'testnet') shyftNetwork = Network.Testnet;
            else throw new Error('WRONG_NETWORK');

            if (reference_address && addresses_to_monitor.length) {
                var callback_details_to_push: any = {};

                const callbackExists = await supabase.from('callback_details').select();

                if (callbackExists.error !== null) throw new Error('COULD_NOT_GET_CBDATA');

                if (callbackExists.data?.length > 0) {
                    callback_details_to_push = callbackExists.data[0];

                    const callbackModify = await shyftClient.callback.update({
                        network: shyftNetwork,
                        id: callback_details_to_push.callback_id,
                        addresses: addresses_to_monitor,
                        callbackUrl: `${process.env.NEXT_CALLBACK_URL}/api/receive-callbacks`,
                        events: [TxnAction.NFT_TRANSFER, TxnAction.NFT_BURN, TxnAction.NFT_SALE],
                    });
                    if (!callbackModify.hasOwnProperty('id')) throw new Error('CALLBACK_NOT_CREATED');

                    callback_details_to_push = {
                        ...callback_details_to_push,
                        monitor_addresses: { addresses: addresses_to_monitor },
                    };
                } else {
                    const callbackCreate = await shyftClient.callback.register({
                        network: shyftNetwork,
                        addresses: addresses_to_monitor,
                        events: [TxnAction.NFT_TRANSFER, TxnAction.NFT_BURN, TxnAction.NFT_SALE],
                        callbackUrl: `${process.env.NEXT_CALLBACK_URL}/api/receive-callbacks`,
                    });

                    if (!callbackCreate.hasOwnProperty('id')) throw new Error('CALLBACK_NOT_CREATED');

                    callback_details_to_push = {
                        reference_address: reference_address,
                        monitor_addresses: { addresses: addresses_to_monitor },
                        callback_id: callbackCreate.id,
                        network: network,
                    };
                }

                const insertToDb = await supabase.from('callback_details').upsert(callback_details_to_push);

                if (insertToDb.error !== null) throw new Error('INSERT_TO_DB_FAILED');

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
        } catch (error: any) {
            if (error.message === 'WRONG_PARAM') {
                response = {
                    success: false,
                    message: 'Please Enter proper Params',
                    result: {},
                };
                statusCode = 400;
            } else if (error.message === 'CALLBACK_NOT_CREATED') {
                response = {
                    success: false,
                    message: 'Error Monitoring the addresses',
                    result: {},
                };
                statusCode = 403;
            } else if (error.message === 'INSERT_TO_DB_FAILED') {
                response = {
                    success: false,
                    message: 'Error Updating the DB',
                    result: {},
                };
                statusCode = 403;
            } else if (error.message === 'COULD_NOT_GET_CBDATA') {
                response = {
                    success: false,
                    message: 'Database unavailable',
                    result: {},
                };
                statusCode = 503;
            } else {
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

// async function pushMintsToDatabase(reference_address: string, addresses_to_monitor: [], network: string) {
//     try {
//         if (reference_address && addresses_to_monitor.length && network) {
//             const nftOwners = await shyftClient.nft.getOwners({ network: Network.Devnet, mints: addresses_to_monitor });
//             console.log(nftOwners);
//             if (nftOwners.length === 0)
//                 throw new Error('NO_NFT_DATA');

//             const allOwners: object[] = nftOwners;
//             // const allOwners:object[] = [];
//             for (var i = 0; i < allOwners.length; i++) {
//                 const eachOwner: any = allOwners[i];
//                 //fetch NFT metadata here
//                 const insertToDb = await supabase.from('monitor_mints').upsert({
//                     mint_address: eachOwner.nft_address,
//                     current_holder: eachOwner.owner
//                 });
//                 if (insertToDb.error !== null)
//                     throw new Error('INSERT_TO_DB_FAILED');
//             }
//             return true;
//         }
//     } catch (error:any) {
//         if(error.message === "NO_NFT_DATA")
//             console.log("NFT not found in DB");
//         else if(error.message === "INSERT_TO_DB_FAILED")
//             console.log("Could not insert data to database");
//         return false;
//     }

// }

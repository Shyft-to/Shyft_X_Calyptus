import type { NextApiRequest, NextApiResponse } from 'next';
import { ShyftSdk, Network, CandyMachineProgram } from '@shyft-to/js';

const shyftClient = new ShyftSdk({ apiKey: process.env.NEXT_SHYFT_API_KEY ?? '', network: Network.Mainnet });

type ShyftArrayResultResponse = {
    success: boolean;
    message?: string;
    result: object[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ShyftArrayResultResponse>) {
    try {
        var cm_address: string = '';
        var network: string = '';
        var version: string = "";

        cm_address = typeof req.body.cm_address === 'string' ? req.body.cm_address : '';
        network = typeof req.body.network === 'string' ? req.body.network : 'mainnet-beta';
        version = typeof req.body.version === 'string' ? req.body.version : 'v3';

        var shyftNetwork: Network = Network.Mainnet;
        if (network === 'mainnet-beta') shyftNetwork = Network.Mainnet;
        else if (network === 'devnet') shyftNetwork = Network.Devnet;
        else if (network === 'testnet') shyftNetwork = Network.Testnet;
        else throw new Error('WRONG_NETWORK');

        var cm_mints: any[] = [];
        var getMintsFromCandyMachine: string[];

        const cm_version = (version === "v3")?CandyMachineProgram.V3:CandyMachineProgram.V2;
    
        try {
            getMintsFromCandyMachine = await shyftClient.candyMachine.readMints({
                network: shyftNetwork,
                address: cm_address,
                version: cm_version,
            });
        } catch (error) {
            throw Error('WRONG_ADDR');
        }

        // console.log("here2.1");
        // console.log(getMintsFromCandyMachine);
        // console.log("here3");
        if (getMintsFromCandyMachine && getMintsFromCandyMachine.length > 0) {
            for (let index = 0; index < getMintsFromCandyMachine.length; index++) {
                const nft = getMintsFromCandyMachine[index];
                cm_mints.push(nft);
            }
        } else throw new Error('NO_NFTS_IN_CM');

        res.status(200).json({
            success: true,
            message: 'All Nfts in this CM',
            result: cm_mints,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Test',
            result: [],
        });
    }
}

// async function pushNftDataToDatabase(reference_address: string, addresses_to_monitor: string[], network: Network):Promise<boolean> {
//     try {
//         if(addresses_to_monitor.length > 0)
//         {
//                 // var objectToBePushed = {};

//                 // const mintExists = await supabase
//                 //     .from('monitor_mints')
//                 //     .select()
//                 //     .eq("mint_address",nft.mint);

//                 // if(mintExists.count !== null)
//                 //     objectToBePushed = mintExists.data[0];

//                 // objectToBePushed ={ ...objectToBePushed, mint_address: nft.mint, current_holder: nft.owner};

//                 //  //get from DB then push
//                 // const insertToDb = await supabase.from('monitor_mints').upsert(objectToBePushed);
//                 // if (insertToDb.error !== null)
//                 //     throw new Error('INSERT_TO_DB_FAILED');
//         }
//         else
//         {
//             return false;
//         }
//         return true;
//     } catch (error:any) {
//         console.log(error);
//         return false;
//     }
// }

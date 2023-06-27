import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ShyftSdk, Network, CandyMachineProgram } from '@shyft-to/js';

const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const shyftClient = new ShyftSdk({ apiKey: process.env.NEXT_SHYFT_API_KEY ?? '', network: Network.Mainnet });

type ShyftArrayResultResponse = {
    success: boolean;
    message?: string;
    result: object[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ShyftArrayResultResponse>) {
    try {
        var cm_address: string = '';
        var network:string = '';

        cm_address = (typeof req.body.cm_address === "string")?req.body.cm_address:"";
        network = (typeof req.body.network === "string")?req.body.network:"mainnet-beta";

        var shyftNetwork:Network = Network.Mainnet;

        if(network === "mainnet-beta")
            shyftNetwork = Network.Mainnet;
        else if(network === "devnet")
            shyftNetwork = Network.Devnet;
        else if(network === "testnet")
            shyftNetwork = Network.Testnet;
        else
            throw new Error("WRONG_NETWORK");
        
        var cm_mints:any[] = [];

        const getMintsFromCandyMachine = await shyftClient.candyMachine.readNfts({
            network: shyftNetwork,
            address: cm_address,
            version: CandyMachineProgram.V3
        });

        if(getMintsFromCandyMachine.nfts?.length > 0){
            for (let index = 0; index < getMintsFromCandyMachine.nfts.length; index++) {
                const nft = getMintsFromCandyMachine.nfts[index];
                cm_mints.push(nft);
                
                var objectToBePushed = {};

                const mintExists = await supabase
                    .from('monitor_mints')
                    .select()
                    .eq("mint_address",nft.mint);
                
                if(mintExists.count !== null)
                    objectToBePushed = mintExists.data[0];

                objectToBePushed ={ ...objectToBePushed, mint_address: nft.mint, current_holder: nft.owner};

                 //get from DB then push
                const insertToDb = await supabase.from('monitor_mints').upsert(objectToBePushed);
                if (insertToDb.error !== null)
                    throw new Error('INSERT_TO_DB_FAILED');
            }
        }
        else
            throw new Error("NO_NFTS_IN_CM");
        
        res.status(200).json({
            success: true,
            message: "All Nfts in this CM",
            result: cm_mints
        }); 

    } catch (error:any) {
        if(error.message === "WRONG_NETWORK")
            res.status(400).json({
                success: false,
                message: "Invalid Network",
                result: []
            });
        else if(error.message === "INSERT_TO_DB_FAILED")
            res.status(400).json({
                success: false,
                message: "Could not insert to DB",
                result: []
            });
        else if(error.message === "NO_NFTS_IN_CM")
            res.status(404).json({
                success: false,
                message: "No Nfts found in CM",
                result: []
            });
        else
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                result: []
            }); 
    }
}
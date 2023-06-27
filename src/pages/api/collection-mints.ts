import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ShyftSdk, Network } from '@shyft-to/js';


const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const shyftClient = new ShyftSdk({ apiKey: process.env.NEXT_SHYFT_API_KEY ?? '', network: Network.Mainnet });

type ShyftArrayResultResponse = {
    success: boolean;
    message?: string;
    result: object[];
}

type EachNft = {
        mint: string,
        update_authority: string
        collection_data?: any
        creators?: [],
        is_mutable?: boolean,
        metadata_uri?: string,
        name?: string,
        primary_sale_happened?: boolean,
        royalty?: number,
        symbol?: string,
    }


export default async function handler(req: NextApiRequest, res: NextApiResponse<ShyftArrayResultResponse>) {

    try {
        var reference_address: string = '';
        var network:string = '';

        reference_address = (typeof req.body.reference_address === "string")?req.body.reference_address:"";
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

        var totalPages:number = 0;
        var mints:string[] = [];
        var current_page = 0;
        do {
            const getNftsInCollection = await shyftClient.nft.collection.getNfts({
                network:shyftNetwork,
                collectionAddress: reference_address,
                size: 10,
                page:current_page
            });

            if(totalPages === 0)
                totalPages = getNftsInCollection.total_pages;
            
            const nftReceived:any[] = getNftsInCollection.nfts;
            for (let index = 0; index < nftReceived.length; index++) 
            {
                const nftElement:string = nftReceived[index].mint;
                mints.push(nftElement); 
            }    

            current_page++;
        } while (current_page < totalPages);
        
        const populateMintsToDb = await pushMintsToDatabase(reference_address,mints,shyftNetwork)

        if(populateMintsToDb === false)
            throw new Error("DATA_PUSH_ERROR")
        
        res.status(200).json({
            success:true,
            message: "All NFT Owners added to database",
            result:[]
        });
    } catch (error:any) {
        if(error.message === "WRONG_NETWORK")
            res.status(400).json({
                success:false,
                message: "Wrong Network",
                result:[]
            });
        else if(error.message === "DATA_PUSH_ERROR")
            res.status(403).json({
                success:false,
                message: "Could not update the Database",
                result:[]
            });
        else
            res.status(500).json({
                success:false,
                message: "internal Server Error",
                result:[]
            });
    }
    

}

async function pushMintsToDatabase(reference_address: string, addresses_to_monitor: string[], network: Network) {
    try {
        if (reference_address && addresses_to_monitor.length && network) {
            const nftOwners = await shyftClient.nft.getOwners({ network: network, mints: addresses_to_monitor });
            console.log(nftOwners);
            if (nftOwners.length === 0)
                throw new Error('NO_NFT_DATA');

            const allOwners: object[] = nftOwners;
            // const allOwners:object[] = [];
            for (var i = 0; i < allOwners.length; i++) {
                const eachOwner: any = allOwners[i];
                //fetch NFT metadata here
                const insertToDb = await supabase.from('monitor_mints').upsert({
                    mint_address: eachOwner.nft_address,
                    current_holder: eachOwner.owner
                });
                if (insertToDb.error !== null)
                    throw new Error('INSERT_TO_DB_FAILED');
            }
            return true;
        }
    } catch (error:any) {
        if(error.message === "NO_NFT_DATA")
            console.log("NFT not found in DB");
        else if(error.message === "INSERT_TO_DB_FAILED")
            console.log("Could not insert data to database");
        return false;
    }

}
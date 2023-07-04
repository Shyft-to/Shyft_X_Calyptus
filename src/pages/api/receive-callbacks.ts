import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

type txnAction = {
    type: string;
    info: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const receivedTxn: [] = req.body.actions;

            for (let index = 0; index < receivedTxn.length; index++) {
                const action: txnAction = receivedTxn[index];
                if(action.type === 'NFT_TRANSFER' || action.type === 'NFT_SALE' || action.type === 'NFT_BURN')
                {
                    const current_nft: string = action.info.nft_address ?? '';
                    const getNftDetails: any = await supabase
                        .from('monitor_mints')
                        .select()
                        .eq('mint_address', current_nft);

                    if (getNftDetails.data.length < 1 || getNftDetails.error !== null)
                        throw new Error('NFT_RECORD_NOT_FOUND');

                    var newOwner: string = '';

                    if (action.type === 'NFT_TRANSFER') 
                        newOwner = action.info.receiver ?? '';
                    else if (action.type === 'NFT_SALE') 
                        newOwner = action.info.buyer ?? '';
                    else if (action.type === 'NFT_BURN') 
                        newOwner = "";

                    if (newOwner !== getNftDetails.current_holder) {
                        const updatedOwnerDetails = {
                            ...getNftDetails.data[0],
                            current_holder: newOwner,
                        };
                        const insertToDb = await supabase.from('monitor_mints').upsert(updatedOwnerDetails);
                        if (insertToDb.error !== null)
                            throw new Error('UPSERT_ERROR_OCCURED');

                        console.log(`Owner Updated for ${current_nft}`);
                    }
                }  
            }

            res.status(200).json({ status: 'ok' });
        } catch (error: any) {
            if (error.message === "NFT_RECORD_NOT_FOUND")
                console.log("NFT Record not available in records");
            else if (error.message === "UPSERT_ERROR_OCCURED")
                console.log("Database not updated");
            else
                console.log("Internal Server Error");
            res.status(500).json({ status: 'error' });
        }
    }
}

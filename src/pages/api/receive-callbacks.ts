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
                if (action.type === 'NFT_TRANSFER') {
                    const current_nft: string = action.info.nft_address ?? '';
                    const getNftDetails: any = await supabase
                        .from('monitor_mints')
                        .select()
                        .eq('mint_address', current_nft);

                    if (getNftDetails.data === null || getNftDetails.error !== null)
                        throw new Error('NFT_RECORD_NOT_FOUND');

                    const newOwner = action.info.receiver ?? '';
                    if (newOwner !== getNftDetails.current_owner) {
                        const updatedOwnerDetails = {
                            ...getNftDetails,
                            current_owner: newOwner,
                        };

                        const insertToDb = await supabase.from('monitor_mints').upsert(updatedOwnerDetails);

                        if (insertToDb.error) throw new Error('UPSERT_ERROR_OCCURED');

                        console.log(`Owner Updated for ${current_nft}`);
                    }
                }
            }

            res.status(200).json({ status: 'ok' });
        } catch (error: any) {
            console.log('Some error occ');
        }
    }
}

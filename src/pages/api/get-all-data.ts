import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
// import { ShyftSdk, Network, TxnAction } from '@shyft-to/js';

const supabaseUrl = process.env.NEXT_SUPABASE_DB_URL ?? '';
const supabaseKey = process.env.NEXT_SUPABASE_DB_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Responses = {
    success: boolean;
    message: string;
    result: {} | [];
};


export default async function handler(req: NextApiRequest, res: NextApiResponse<Responses>) {
    try {
        var address: string = '';
        var network: string = '';
        var allData:any = [];
        
        address = (typeof req.body.address === "string")?req.body.address:"";
        network = (typeof req.body.network === "string")?req.body.network:"mainnet-beta";
        
        const {data,error} = await supabase
            .from('monitor_mints')
            .select()
            .eq("reference_address",address);
        
        if(error === null)
        {
            // console.dir(data,{depth:null})
            res.status(200).json({
                success: true,
                message: 'all data from database',
                result: data,
            });
        }
        else
            throw new Error('FAILED_TO_GET_DATA');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            result: {},
        });
    }
}
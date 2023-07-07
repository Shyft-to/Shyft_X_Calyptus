import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ShyftSdk, Network } from '@shyft-to/js';
import axios from 'axios';


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
        console.log('------------Update Mints Called--------------');
        //console.log(req.body);
        var reference_address: string = '';
        var network: string = '';
        var newversion: string = '';

        reference_address = typeof req.body.reference_address === 'string' ? req.body.reference_address : '';
        network = typeof req.body.network === 'string' ? req.body.network : 'mainnet-beta';
        newversion = typeof req.body.version === 'string' ? req.body.version : 'mainnet-beta';

        var mintsToShare:any[] = [];
        var arrayPromises = [];
        var pages = 0;
        await axios.request({
            url: "https://api.shyft.to/sol/v1/candy_machine/nfts",
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_SHYFT_API_KEY
            },
            params: {
                network: network,
                address: reference_address, 
                page: 1,
                size: 1,
                version: "v3"    
            }
        })
        .then(res => {
            if(res.data.success === true)
            {
                console.dir(res.data.result,{depth:null});
                pages = res.data.result.total_page
            }
        })
        .catch(error => console.dir(error.response.data,{depth:null}));
        console.log("Pages:",pages);
        for (let index = 1; index <= pages; index++) {
            console.log("Executing for :",index);
            arrayPromises.push(storePageWise(network,reference_address,index,newversion))
        }
        await Promise.all(arrayPromises).then((values) => {
            console.log(values);
            values.forEach(respArray => {
                mintsToShare = [...mintsToShare,...respArray];
            });
            
        });
        var response:ShyftArrayResultResponse = {
            success: true,
            message: "All mints from CM",
            result: mintsToShare
        }
        res.status(200).json(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some Error Occured",
            result: []
        });
    }
    
}
async function storePageWise(network:string,address: string, page:number,version:string) {
    try {
        console.log("executing promise"+page);
        const dataForDB:any = [];
        const mints:any = [];
        
        await axios.request({
            url: "https://api.shyft.to/sol/v1/candy_machine/nfts",
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_SHYFT_API_KEY
            },
            params: {
                network: network,
                address: address, 
                page: page,
                size: 1,
                version: version    
            }
        })
        .then(res => {
            if(res.data.success === true)
            {
                res.data.result.nfts?.forEach((nft:any) => {
                    dataForDB.push({
                       current_holder: nft.owner,
                       mint_address: nft.mint,
                        network:network,
                        reference_address:address,
                        nft_data:nft
                    });
                    mints.push(nft.mint);
                });
            }
            
        })
        .catch(error => console.log("Cannot send to DB"));

        if(dataForDB.length > 0)
        {
            const insertToDb = await supabase.from('monitor_mints').insert(dataForDB);
            if (insertToDb.error !== null)
            {
                return [];  
            }
            else
                return mints;
        }
        else
            return [];
    } catch (error) {
        console.log(error);
    }
    
}

import type { NextApiRequest, NextApiResponse } from 'next';
//import { ShyftSdk, Network, TxnAction } from '@shyft-to/js';
import axios from 'axios';
type Responses = {
    success: boolean;
    message: string;
    result: {};
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Responses>) {
    if (req.method === 'POST') {
        var response: Responses = {
            success: false,
            message: '',
            result: {},
        };
        var statusCode = 0;
        try {
            var network:string = "";
            var wallet_address:string = "";
            var max_depth:number = 0;
            var max_buffer_size:number = 0;
            var canopy_depth:number = 0;
            var fee_payer: string = "";
        } catch (error:any) {
            if (error.message === 'WRONG_PARAM') {
                response = {
                    success: false,
                    message: 'Please Enter proper Params',
                    result: {},
                };
                statusCode = 400;
            }
            else if (error.message === 'CALLBACK_NOT_CREATED') {
                response = {
                    success: false,
                    message: 'Error Monitoring the addresses',
                    result: {},
                };
                statusCode = 403;
            }
            else if (error.message === 'INSERT_TO_DB_FAILED') {
                response = {
                    success: false,
                    message: 'Error Updating the DB',
                    result: {},
                };
                statusCode = 403;
            }
            else if (error.message === 'COULD_NOT_GET_CBDATA') {
                response = {
                    success: false,
                    message: 'Database unavailable',
                    result: {},
                };
                statusCode = 503;
            }
            else {
                response = {
                    success: false,
                    message: 'Internal Server Error',
                    result: {},
                };
                statusCode = 500;
            }
        }
        res.status(statusCode).json(response);
    }
    else
    {
        res.status(400).json({
            success: false,
            message: 'You cannot GET form this endpoint',
            result: {},
        });
    }
    
}
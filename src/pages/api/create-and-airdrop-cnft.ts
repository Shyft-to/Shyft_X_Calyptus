import type { NextApiRequest, NextApiResponse } from 'next';
import { clusterApiUrl, Connection, Transaction, Keypair } from '@solana/web3.js';
import { decode } from 'bs58';
import { Buffer } from 'buffer';
import axios from 'axios';

import type { Cluster, Signer } from '@solana/web3.js';
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
            var network: Cluster = 'devnet';
            var merkle_tree: string = '';
            var max_supply: number = 0;
            var metadata_uri: string = '';
            var collection_address: string = '';
            var holders: string[] = [];
            var confirmTxns: string[] = [];

            network = typeof req.body.network === 'string' ? req.body.network : 'mainnet-beta';
            merkle_tree = typeof req.body.merkle_tree === 'string' ? req.body.merkle_tree : '';
            max_supply = typeof req.body.max_supply === 'number' ? req.body.max_supply : 0;
            metadata_uri = typeof req.body.metadata_uri === 'string' ? req.body.metadata_uri : '';
            // collection_address = (typeof req.body.collection_address === "string") ? req.body.collection_address : '';

            holders = typeof req.body.holders !== 'string' && req.body.holders?.length > 0 ? req.body.holders : '';

            for (let index = 0; index < holders.length; index++) {
                const holder: string = holders[index];

                var raw = {
                    network: network,
                    creator_wallet: process.env.NEXT_PUBLIC_KEY,
                    metadata_uri: metadata_uri,
                    merkle_tree: merkle_tree,
                    // collection_address: collection_address,
                    max_supply: max_supply,
                    receiver: holder,
                };

                var response_from_api: any = {};

                await axios
                    .request({
                        url: 'https://api.shyft.to/sol/v1/nft/compressed/mint',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.NEXT_SHYFT_API_KEY,
                        },
                        data: JSON.stringify(raw),
                    })
                    .then((res) => {
                        //console.dir(res.data,{depth:null});
                        if (res.data.success === true) response_from_api = res.data;
                        else throw new Error('MINT_ERROR');
                    })
                    .catch((error) => {
                        //console.dir(error.message,{depth:null});
                        if (error.message === 'MINT_ERROR') throw new Error('MINT_ERROR');
                        else throw error;
                    });

                const recoveredTxn = await signAndSendTransactionWithPrivateKeys(
                    network,
                    response_from_api.result.encoded_transaction,
                    [process.env.NEXT_PRIVATE_KEY ?? '']
                );
                // console.log("Recovred",recoveredTxn);
                if (recoveredTxn) {
                    confirmTxns.push(recoveredTxn);
                } else throw new Error('COULD_NOT_SIGN');

                // break;
            }
            response = {
                success: true,
                message: 'Compressed NFTs Airdropped',
                result: {
                    tree: merkle_tree,
                    confirmed_transactions: confirmTxns,
                },
            };
            statusCode = 200;
            // total_tokens = Array.isArray(req.body.create_callbacks_on) ? req.body.create_callbacks_on : [];
        } catch (error: any) {
            if (error.message === 'COULD_NOT_SIGN') {
                response = {
                    success: false,
                    message: 'Could not sign the transaction',
                    result: {},
                };
                statusCode = 401;
            } else if (error.message === 'MINT_ERROR') {
                response = {
                    success: false,
                    message: 'Minting Transaction not generated',
                    result: {},
                };
                statusCode = 500;
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
        res.status(400).json({
            success: false,
            message: 'You cannot GET form this endpoint',
            result: {},
        });
    }
}

async function signAndSendTransactionWithPrivateKeys(
    network: Cluster,
    encodedTransaction: string,
    privateKeys: string[]
): Promise<string> {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const signedTxn = await partialSignTransactionWithPrivateKeys(encodedTransaction, privateKeys);

    const signature = await connection.sendRawTransaction(signedTxn.serialize({ requireAllSignatures: false }));
    return signature;
}

export async function partialSignTransactionWithPrivateKeys(
    encodedTransaction: string,
    privateKeys: string[]
): Promise<Transaction> {
    const recoveredTransaction = getRawTransaction(encodedTransaction);
    const signers = getSignersFromPrivateKeys(privateKeys);
    recoveredTransaction.partialSign(...signers);
    return recoveredTransaction;
}

function getRawTransaction(encodedTransaction: string): Transaction {
    const recoveredTransaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));
    return recoveredTransaction;
}
function getSignersFromPrivateKeys(privateKeys: string[]): Signer[] {
    return privateKeys.map((privateKey) => {
        const signer = Keypair.fromSecretKey(decode(privateKey)) as Signer;
        return signer;
    });
}

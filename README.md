
<!-- @TODO -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To install packages, run `npm ci --legacy-peer-deps`
To run, use `npm run dev` and open `localhost:3000`

## Important Information
`.env` requires the following variables. You can also rename the `sample.env` file to `.env` and fill in the details listed below.

NEXT_SUPABASE_DB_URL= supabase DB url
NEXT_SUPABASE_DB_KEY= supabase key
NEXT_SHYFT_API_EP= https://api.shyft.to/sol/v1/
NEXT_SHYFT_API_KEY= your SHYFT API key from shyft.to
NEXT_CALLBACK_URL=The url to which the callbacks will be reported to, when running on local environment you can set it up using ngrok, localtunnel,serveo etc
NEXT_PUBLIC_KEY= public key of the user who setup the project, merkle tree auth and Compressed NFT authority remains with this,this will also be the feepayer while creating merkle tree and compressed NFTs
NEXT_PRIVATE_KEY=private key of the above user
## Supabase setup

**Manual database setup**  
Supabase project setup should have two tables, and `RLS` should be disabled.

table name-> callback_details

id,created_at auto
reference_address:text
monitor_addresses: json
callback_id: text
network: text

table name -> monitor_mints

id,created_at auto
mint_address: text
current_holder: text
nft_data: json
network: text
refernece_address

## Setting up from csv
you can also setup the project from the csv files provided in `db_exports`, 

### Table Callback Details
1. import the file `callback_details_rows` in a table named `callback_details`
2. set the `id` column to be not null and primary key(and remove `RLS`)
3. clear out the rows before starting the project 

### Table Monitor mints
1. import the file `monitor_mints_rows` in a table named `monitor_mints`
2. set the `id` column to be not null and primary key(and remove `RLS`)
3. clear out the rows before starting the project 

Thats all the setup you need.

## Removing Created callbacks

This project uses live callbacks to manage data.
- To list your callbacks, use our [List callback Docs](https://docs.shyft.to/start-hacking/callbacks#list-callbacks). You can also view the id on the `callback_details` table in supabase.
- To remove already created callback, use our [Remove callback Docs](https://docs.shyft.to/start-hacking/callbacks#remove-a-callback). You can view the id on the `callback_details` table in supabase.

or you can also use our [swagger interface](https://api.shyft.to/sol/api/explore/) to do the same.

For more details, visit [https://docs.shyft.to/](https://docs.shyft.to/), or [SHYFT website](https://shyft.to/).


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

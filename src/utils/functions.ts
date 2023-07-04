
export default function formatAddresses(address:string):string
{
    try {
        if(address.length > 20)
        {
            const firstPart = address.substring(0,4);
            const lastPart = address.substring(address.length - 2);

            return `${firstPart}...${lastPart}`;
        }
        else
            return address
    } catch (error) {
        console.log("Format Error Occured");
        return address;
    }
    
}
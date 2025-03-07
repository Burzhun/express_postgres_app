import axios from "axios";
import redisClient from "../config/redis";

type Item = {
    market_hash_name: string;
    currency: string;
    suggested_price: number;
    item_page: string;
    market_page: string;
    min_price: number;
    min_tradable_price?: number;
    max_price: number;
    mean_price: number;
    median_price: number;
    quantity: number;
    created_at: number;
    updated_at: number;
}

const loadItems = (tradable=false) => {
    const params = new URLSearchParams({
        tradable: tradable ? '1' : '0'
    })
    console.log(`https://api.skinport.com/v1/items?${params}`)
    return axios.get<Item[]>(`https://api.skinport.com/v1/items?${params}`,{
        headers:{
            'Accept-Encoding': 'br',
            Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsIm9yZyI6ItCi0LXRgdGC0L7QstCw0Y8g0L7RgNCz0LDQvdC40LfQsNGG0LjRjyIsIm9yZ0lEIjoyLCJhZG1pbiI6dHJ1ZSwib2JzZXJ2ZXIiOmZhbHNlLCJzZXNzaW9uSWQiOiIyMTZjNWFmNS1mYjZmLTExZWYtYmJkZS0wMjQyMGEwMDAwODYiLCJleHAiOjE3NDM5NTYwMTksImlzcyI6IlNBUy1QUk9EIn0.OErZNZQ8WuZtmrUKoRFx06Gbo50KJORpWnmj4KsNTXU`
        }
    })
}

const getItems = async (request, response) => {
    try {
        const itemsData = await redisClient.get('itemsData')
        if(itemsData){
            response.status(200).json(JSON.parse(itemsData))
        }else{
            const [items, tradableItems] = await Promise.all([loadItems(),loadItems(true)])
            console.log(items.data.length, tradableItems.data.length)
            const itemsData:Item[] =items.data; // items.data.map((item,i)=>({...item,min_tradable_price:tradableItems[i].min_price}))
            response.status(200).json(itemsData)
            redisClient.setEx('itemsData',3600 * 24, JSON.stringify(itemsData))
        }
        // // Promise.all([loadItems(),loadItems(true)]).then((values) => {
        // //     console.log(values);
        // //     console.log('loading2')
        // // });

        // console.log(items.data.slice(0,1))
        // console.log(tradableItems.data.slice(0,1))
    } catch (err) {
        //console.log(err)
        response.status(500).json({ error: err.message });
    }
};


export default {
    getItems
}
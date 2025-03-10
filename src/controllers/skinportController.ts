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
    return axios.get<Item[]>(`https://api.skinport.com/v1/items?${params}`,{
        headers:{
            'Accept-Encoding': 'br',
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
            const itemsData:Item[] = items.data.map((item,i)=>({...item,min_tradable_price:tradableItems.data[i].min_price}))
            response.status(200).json(itemsData)
            redisClient.setEx('itemsData',3600 * 24, JSON.stringify(itemsData))
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
};


export default {
    getItems
}
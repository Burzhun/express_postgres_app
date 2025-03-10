import pool from '../config/db';
import productModel from './productModel';

const updateBalance = async (userId:number, productId:number) => {
    const product = await productModel.getProduct(productId);
    if(!product){
        return {error: 'Product not found'}
    }
    const price = parseFloat(product.price)
    const client = await pool.connect()
    const values = [price, userId];
    const purchaseValues = [userId, productId, price];
    try{
        await client.query('BEGIN')
        const result = await client.query(`UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING *`,values)
        await client.query(`INSERT INTO purchase (user_id, product_id, price) VALUES ($1, $2, $3) `,purchaseValues)
        await client.query('End')
        if(result?.rows?.length){
            return result.rows[0]
        }
        return {error: 'User not found'}
    }catch(e){
        console.log(e)
        await pool.query('ROLLBACK')
        return {error: 'Error occured when updating balance'}
    }finally{
        client.release()
    }
}

export default {
    updateBalance
}
import pool from '../config/db';

const getProduct = async ( productId:number) => {
    try{
        const result = await pool.query(`SELECT * FROM products WHERE id = $1`,[productId])
        if(result.rows?.length){
            return result.rows[0]
        }else{
            return null
        }
    }catch(e){
        console.log(e)
        return null;
    }
}

export default {
    getProduct
}
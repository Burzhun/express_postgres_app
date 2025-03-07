import userModel from '../models/userModel';
import productModel from '../models/productModel';
import { Request, Response } from 'express';


const updateUserBalance = async (request: Request, response: Response) => {
    try {
        const userId:number = parseInt(request.query.userId as string);
        const productId:number = parseInt(request.query.productId as string);
        if(userId && productId){
            const result = await userModel.updateBalance(userId, productId)
            response.status(200).json(result)
        }else{
            response.status(200).json({error: 'Empty request'})
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
};

const getProduct = async (request: Request, response: Response) => {
    try {
        const id:number = parseInt(request.params.id);
        if(id){
            const result = await productModel.getProduct(id)
            response.status(200).json(result)
        }else{
            response.status(200).json({error: 'Empty request'})
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
};

export default {
    updateUserBalance,
    getProduct
}

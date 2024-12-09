import { 
    getFiatWalletsByUser, 
    createFiatWallet, 
    updateFiatWallet, 
    deleteFiatWallet 
  } from '../services/fiatWalletService.js';
  
  export const getFiatWalletsByUserController = async (req, res) => {
    try {
      
  
      const {walletuser_id}= req.user
  

      const wallets = await getFiatWalletsByUser(walletuser_id);
      res.status(200).json(wallets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const createFiatWalletController = async (req, res) => {
    try {
      const { walletuser_id, fiat_id } = req.body;
 
      
      const wallet = await createFiatWallet(walletuser_id, fiat_id);
      res.status(201).json(wallet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateFiatWalletController = async (req, res) => {
    
      const {wallet_id , amount } = req.body;
    
      
    try {

   
      const updatedWallet = await updateFiatWallet(wallet_id, amount);
      res.status(200).json(updatedWallet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteFiatWalletController = async (req, res) => {
    try {
      const { walletId } = req.params;
      await deleteFiatWallet(walletId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
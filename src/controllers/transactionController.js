import { handleTransferService } from '../services/transactionService.js';

export const handleTransactionController = async (req, res) => {
  const { cryptoId, quantity, receiverwalletuser } = req.body;
  const { walletuser_id } = req.user;

  
  try {
    const result = await handleTransferService(walletuser_id, receiverwalletuser, cryptoId, quantity);
   
    
    res.status(200).json({ message: 'Transaction successful', result });
  } catch (error) {
    res.status(500).json({ message: 'Transaction failed', error: error.message });
  }
};


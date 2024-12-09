import {
    getAllFiatCurrencies,
    createFiatCurrency,
    updateFiatCurrency,
    deleteFiatCurrency,
  } from '../services/fiatService.js';
  
  export const getFiatCurrenciesController = async (req, res) => {
    try {
      const currencies = await getAllFiatCurrencies();
      res.status(200).json(currencies);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching fiat currencies', error: error.message });
    }
  };
  
  export const createFiatCurrencyController = async (req, res) => {
    try {
      const fiat = await createFiatCurrency(req.body);
      res.status(201).json(fiat);
    } catch (error) {
      res.status(500).json({ message: 'Error creating fiat currency', error: error.message });
    }
  };
  
  export const updateFiatCurrencyController = async (req, res) => {
    try {
      const fiat = await updateFiatCurrency(parseInt(req.params.fiatId), req.body);
      res.status(200).json(fiat);
    } catch (error) {
      res.status(500).json({ message: 'Error updating fiat currency', error: error.message });
    }
  };
  
  export const deleteFiatCurrencyController = async (req, res) => {
    try {
      await deleteFiatCurrency(parseInt(req.params.fiatId));
      res.status(204).json({ message: 'Fiat currency deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting fiat currency', error: error.message });
    }
  };
  
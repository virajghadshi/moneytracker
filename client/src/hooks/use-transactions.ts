import { useState } from 'react';
import { Transaction, InsertTransaction, TimeFilter } from '@shared/schema';
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useTransactions() {
  const [currentFilter, setCurrentFilter] = useState<TimeFilter>('all');
  const queryClient = useQueryClient();

  // Fetch transactions from API
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/transactions');
      return await response.json();
    },
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      const response = await apiRequest('POST', '/api/transactions', transaction);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transaction }: { id: number; transaction: InsertTransaction }) => {
      const response = await apiRequest('PUT', `/api/transactions/${id}`, transaction);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
  });

  const addTransaction = (insertTransaction: InsertTransaction) => {
    addTransactionMutation.mutate(insertTransaction);
  };

  const updateTransaction = (id: number, transaction: InsertTransaction) => {
    updateTransactionMutation.mutate({ id, transaction });
  };

  const deleteTransaction = (id: number) => {
    deleteTransactionMutation.mutate(id);
  };

  const getFilteredTransactions = () => {
    if (currentFilter === 'all') return allTransactions;

    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (currentFilter) {
        case 'daily':
          return isToday(transactionDate);
        case 'weekly':
          return isThisWeek(transactionDate, { weekStartsOn: 1 });
        case 'monthly':
          return isThisMonth(transactionDate);
        case 'yearly':
          return isThisYear(transactionDate);
        default:
          return true;
      }
    });
  };

  const getCurrentBalance = () => {
    return allTransactions.length > 0 ? parseFloat(allTransactions[0].balance) : 0;
  };

  const formatTransactionDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'EEE, dd MMM yyyy hh:mm a');
  };

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString();
  };

  return {
    transactions: getFilteredTransactions(),
    allTransactions,
    currentFilter,
    setCurrentFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentBalance,
    formatTransactionDate,
    formatAmount,
    isLoading,
    isAddingTransaction: addTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
  };
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, FileText, Search, MoreVertical, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { TransactionModal } from '@/components/transaction-modal';
import { useTransactions } from '@/hooks/use-transactions';
import { TimeFilter, Transaction } from '@shared/schema';

const timeFilters: { key: TimeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

export default function CashBook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'cashIn' | 'cashOut'>('cashIn');
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  
  const {
    transactions,
    currentFilter,
    setCurrentFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentBalance,
    formatTransactionDate,
    formatAmount,
    isLoading,
  } = useTransactions();

  const openCashInModal = () => {
    setEditTransaction(null);
    setModalType('cashIn');
    setIsModalOpen(true);
  };

  const openCashOutModal = () => {
    setEditTransaction(null);
    setModalType('cashOut');
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setModalType(transaction.type as 'cashIn' | 'cashOut');
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTransaction(null);
  };

  const currentFilterLabel = timeFilters.find(f => f.key === currentFilter)?.label || 'All';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-primary-blue text-white px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="p-2 -ml-2 text-white hover:bg-blue-600">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold">Cash Book</h1>
            <ChevronDown className="h-4 w-4" />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-blue-600">
              <FileText className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-blue-600">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-blue-600">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Ad Banner */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
          <span className="text-gray-700 text-sm font-medium">Enjoy Ad Free Experience</span>
          <Button 
            size="sm" 
            className="bg-primary-blue text-white hover:bg-blue-600 px-4 py-2 text-sm"
          >
            Remove Ads
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-primary-blue px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => setCurrentFilter(filter.key)}
              className={`whitespace-nowrap flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full ${
                currentFilter === filter.key
                  ? 'bg-white text-primary-blue hover:bg-gray-100'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <h2 className="text-white text-lg font-medium">{currentFilterLabel}</h2>
        </div>
      </div>

      {/* Transaction Header */}
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Date</span>
          <div className="flex space-x-8">
            <span className="text-cash-in-green font-medium">Cash In</span>
            <span className="text-cash-out-red font-medium">Cash Out</span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {transactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p>No transactions found</p>
            <p className="text-sm mt-1">Add your first transaction using the buttons below</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatTransactionDate(transaction.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(transaction)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'cashIn' ? 'text-cash-in-green' : 'text-cash-out-red'
                  }`}>
                    {formatAmount(transaction.amount)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Balance {formatAmount(transaction.balance)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <Button
            onClick={openCashInModal}
            className="flex-1 bg-cash-in-green text-white py-4 text-lg font-semibold hover:bg-green-600"
          >
            Cash In
          </Button>
          <Button
            onClick={openCashOutModal}
            className="flex-1 bg-cash-out-red text-white py-4 text-lg font-semibold hover:bg-red-600"
          >
            Cash Out
          </Button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addTransaction}
        onUpdate={updateTransaction}
        type={modalType}
        editTransaction={editTransaction}
      />
    </div>
  );
}

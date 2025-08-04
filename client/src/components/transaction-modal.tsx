import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InsertTransaction, Transaction } from '@shared/schema';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: InsertTransaction) => void;
  onUpdate?: (id: number, transaction: InsertTransaction) => void;
  type: 'cashIn' | 'cashOut';
  editTransaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, onSubmit, onUpdate, type, editTransaction }: TransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const isEditing = !!editTransaction;

  // Populate form when editing
  useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount);
    } else {
      setDescription('');
      setAmount('');
    }
  }, [editTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const transaction: InsertTransaction = {
      description: description.trim(),
      amount: amount,
      type,
      date: isEditing ? editTransaction.date : new Date(),
    };

    if (isEditing && onUpdate && editTransaction) {
      onUpdate(editTransaction.id, transaction);
    } else {
      onSubmit(transaction);
    }
    
    // Reset form
    setDescription('');
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    onClose();
  };

  const isValidForm = description.trim() && amount && parseFloat(amount) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full mx-4 rounded-t-lg sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditing 
              ? `Edit ${type === 'cashIn' ? 'Cash In' : 'Cash Out'}` 
              : `Add ${type === 'cashIn' ? 'Cash In' : 'Cash Out'}`
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing 
              ? `Edit transaction details for this ${type === 'cashIn' ? 'cash in' : 'cash out'} record`
              : `Enter transaction details to add a new ${type === 'cashIn' ? 'cash in' : 'cash out'} record`
            }
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-auto p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              className="w-full px-3 py-3 text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0.01"
              step="0.01"
              className="w-full px-3 py-3 text-base"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidForm}
              className={`flex-1 py-3 text-base font-medium text-white ${
                type === 'cashIn' 
                  ? 'bg-cash-in-green hover:bg-green-600' 
                  : 'bg-cash-out-red hover:bg-red-600'
              }`}
            >
              {isEditing 
                ? `Update ${type === 'cashIn' ? 'Cash In' : 'Cash Out'}`
                : `Add ${type === 'cashIn' ? 'Cash In' : 'Cash Out'}`
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

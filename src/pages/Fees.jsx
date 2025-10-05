/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Plus, Search, Filter, DollarSign, Calendar, User } from 'lucide-react';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_method: '',
    term: '',
    academic_year: '',
    receipt_number: '',
    notes: ''
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await api.get('/api/fees');
      setFees(response.data);
    } catch (error) {
      toast.error('Failed to load fees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to load students');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/fees', formData);
      toast.success('Fee payment recorded successfully');
      setIsDialogOpen(false);
      setFormData({
        student_id: '',
        amount: '',
        payment_method: '',
        term: '',
        academic_year: '',
        receipt_number: '',
        notes: ''
      });
      fetchFees();
    } catch (error) {
      toast.error('Failed to record fee payment');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: 'default', label: 'Paid' },
      pending: { variant: 'secondary', label: 'Pending' },
      overdue: { variant: 'destructive', label: 'Overdue' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const totalPending = fees.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
  const totalOverdue = fees.filter(fee => fee.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 mt-1">Track and manage student fee payments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record Fee Payment</DialogTitle>
              <DialogDescription>
                Add a new fee payment record for a student.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student</Label>
                <Select name="student_id" value={formData.student_id} onValueChange={(value) => setFormData({...formData, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name} - {student.roll_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select name="payment_method" value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select name="term" value={formData.term} onValueChange={(value) => setFormData({...formData, term: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Term</SelectItem>
                      <SelectItem value="second">Second Term</SelectItem>
                      <SelectItem value="third">Third Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleInputChange}
                    placeholder="2024-2025"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt_number">Receipt Number</Label>
                <Input
                  id="receipt_number"
                  name="receipt_number"
                  value={formData.receipt_number}
                  onChange={handleInputChange}
                  placeholder="Enter receipt number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes"
                />
              </div>
              <Button type="submit" className="w-full">
                Record Payment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Paid
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-lg font-bold text-green-600">₦</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Received payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-lg font-bold text-yellow-600">₦</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPending.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-lg font-bold text-red-600">₦</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Past due date</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fee Records</CardTitle>
              <CardDescription>View and manage all fee payments</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search fees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {fee.student_name}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₦{fee.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(fee.status)}</TableCell>
                  <TableCell className="capitalize">{fee.payment_method?.replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize">{fee.term} Term</TableCell>
                  <TableCell>{fee.academic_year}</TableCell>
                  <TableCell>{new Date(fee.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredFees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fee records found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Fees;
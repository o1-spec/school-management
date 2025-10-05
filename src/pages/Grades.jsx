'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Plus, Search } from 'lucide-react';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    marks: '',
    term: '',
    academic_year: '',
    remarks: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get('/api/grades/all');
      setGrades(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/grades', formData);
      toast.success('Grade added successfully!');
      setIsDialogOpen(false);
      fetchGrades();
      setFormData({
        student_id: '',
        subject: '',
        marks: '',
        term: '',
        academic_year: '',
        remarks: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add grade');
      console.error(error);
    }
  };

  const getGradeBadgeVariant = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'default';
    if (grade === 'B') return 'secondary';
    if (grade === 'C') return 'outline';
    return 'destructive';
  };

  const filteredGrades = grades.filter(
    (grade) =>
      grade.student_id?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      grade.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Grades Management
          </h1>
          <p className='text-sm sm:text-base text-gray-500 mt-1'>
            Track and manage student academic performance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='w-full sm:w-auto'>
              <Plus className='h-4 w-4 mr-2' />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
              <DialogDescription>
                Enter student grade information below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='student_id'>Student *</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) =>
                    handleSelectChange('student_id', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select student' />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='subject'>Subject *</Label>
                <Input
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder='e.g., Mathematics'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='marks'>Marks (0-100) *</Label>
                <Input
                  id='marks'
                  name='marks'
                  type='number'
                  min='0'
                  max='100'
                  value={formData.marks}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='term'>Term *</Label>
                <Select
                  value={formData.term}
                  onValueChange={(value) => handleSelectChange('term', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select term' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='First Term'>First Term</SelectItem>
                    <SelectItem value='Second Term'>Second Term</SelectItem>
                    <SelectItem value='Third Term'>Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='academic_year'>Academic Year *</Label>
                <Input
                  id='academic_year'
                  name='academic_year'
                  value={formData.academic_year}
                  onChange={handleChange}
                  placeholder='e.g., 2024-2025'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='remarks'>Remarks</Label>
                <Input
                  id='remarks'
                  name='remarks'
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder='Optional comments'
                />
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button type='submit' className='flex-1'>
                  Add Grade
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Search Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search by student name or subject...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[120px] sm:w-auto'>Student</TableHead>
                  <TableHead className='w-[80px] sm:w-auto hidden sm:table-cell'>
                    Roll No.
                  </TableHead>
                  <TableHead className='w-[100px] sm:w-auto'>Subject</TableHead>
                  <TableHead className='w-[70px] sm:w-auto'>Marks</TableHead>
                  <TableHead className='w-[70px] sm:w-auto hidden sm:table-cell'>
                    Grade
                  </TableHead>
                  <TableHead className='w-[80px] sm:w-auto hidden md:table-cell'>
                    Term
                  </TableHead>
                  <TableHead className='w-[100px] sm:w-auto hidden lg:table-cell'>
                    Academic Year
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8 text-gray-500 text-sm'
                    >
                      No grades found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrades.map((grade) => (
                    <TableRow key={grade._id}>
                      <TableCell className='font-medium text-xs sm:text-sm'>
                        {grade.student_id?.name || 'N/A'}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm hidden sm:table-cell'>
                        {grade.student_id?.rollNumber || 'N/A'}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm'>
                        {grade.subject}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm'>
                        {grade.marks}/100
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <Badge
                          variant={getGradeBadgeVariant(grade.grade)}
                          className='text-xs'
                        >
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm hidden md:table-cell'>
                        {grade.term}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm hidden lg:table-cell'>
                        {grade.academic_year}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;

'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    remarks: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students?status=active');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/api/attendance?date=${dateStr}`);
      setAttendance(response.data);
    } catch (error) {
      console.error(error);
    }
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
      await api.post('/api/attendance', formData);
      toast.success('Attendance marked successfully!');
      setIsDialogOpen(false);
      fetchAttendance();
      setFormData({
        student_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        remarks: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
      console.error(error);
    }
  };

  const markBulkAttendance = async (status) => {
    try {
      const promises = students.map((student) =>
        api.post('/api/attendance', {
          student_id: student._id,
          date: selectedDate.toISOString().split('T')[0],
          status: status,
          remarks: `Bulk marked as ${status}`,
        })
      );
      await Promise.all(promises);
      toast.success(`All students marked as ${status}!`);
      fetchAttendance();
    } catch (error) {
      toast.error('Failed to mark bulk attendance');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary',
      excused: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Attendance Management
          </h1>
          <p className='text-gray-500 mt-1 text-sm sm:text-base'>
            Track daily student attendance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='w-full sm:w-auto'>
              <Plus className='h-4 w-4 mr-2' />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for a student
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
                <Label htmlFor='status'>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='present'>Present</SelectItem>
                    <SelectItem value='absent'>Absent</SelectItem>
                    <SelectItem value='late'>Late</SelectItem>
                    <SelectItem value='excused'>Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex gap-3'>
                <Button type='submit' className='flex-1'>
                  Submit
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

      <div className='grid grid-cols-1 xl:grid-cols-4 gap-6'>
        <Card className='xl:col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg'>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-center'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={setSelectedDate}
                className='rounded-md border'
              />
            </div>
            <div className='mt-4 space-y-2'>
              <Button
                variant='outline'
                className='w-full text-sm bg-transparent'
                onClick={() => markBulkAttendance('present')}
              >
                Mark All Present
              </Button>
              <Button
                variant='outline'
                className='w-full text-sm bg-transparent'
                onClick={() => markBulkAttendance('absent')}
              >
                Mark All Absent
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='xl:col-span-3'>
          <CardHeader>
            <CardTitle className='text-lg sm:text-xl'>
              Attendance for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {students.map((student) => {
                const studentAttendance = attendance.find(
                  (a) => a.student_id._id === student._id
                );
                return (
                  <div
                    key={student._id}
                    className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg'
                  >
                    <div>
                      <p className='font-medium text-sm sm:text-base'>
                        {student.name}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {student.rollNumber} - {student.class}
                      </p>
                    </div>
                    {studentAttendance ? (
                      getStatusBadge(studentAttendance.status)
                    ) : (
                      <Badge variant='outline'>Not Marked</Badge>
                    )}
                  </div>
                );
              })}
              {students.length === 0 && (
                <p className='text-center text-gray-500 py-8 text-sm'>
                  No active students found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;

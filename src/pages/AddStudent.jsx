'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
  });

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
    setLoading(true);

    try {
      await api.post('/api/students', formData);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add student');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate('/students')}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Add New Student
          </h1>
          <p className='text-gray-500 mt-1 text-sm sm:text-base'>
            Fill in the student information below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          <div className='xl:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name *</Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='rollNumber'>Roll Number *</Label>
                    <Input
                      id='rollNumber'
                      name='rollNumber'
                      value={formData.rollNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='class'>Class *</Label>
                    <Input
                      id='class'
                      name='class'
                      value={formData.class}
                      onChange={handleChange}
                      placeholder='e.g., 10A'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='age'>Age *</Label>
                    <Input
                      id='age'
                      name='age'
                      type='number'
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='gender'>Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange('gender', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Male'>Male</SelectItem>
                        <SelectItem value='Female'>Female</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address'>Address</Label>
                  <Textarea
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='guardianName'>Guardian Name</Label>
                    <Input
                      id='guardianName'
                      name='guardianName'
                      value={formData.guardianName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='guardianPhone'>Guardian Phone</Label>
                    <Input
                      id='guardianPhone'
                      name='guardianPhone'
                      value={formData.guardianPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? 'Adding Student...' : 'Add Student'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full bg-transparent'
                  onClick={() => navigate('/students')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600'>
                  Fields marked with * are required. Make sure all information
                  is accurate before submitting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

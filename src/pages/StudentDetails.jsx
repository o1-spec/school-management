/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowLeft, Edit, Mail, Phone, MapPin, User } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
    fetchGrades();
    fetchAttendance();
    fetchFees();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const response = await api.get(`/api/students/${id}`);
      setStudent(response.data);
    } catch (error) {
      toast.error('Failed to load student details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get(`/api/grades/student/${id}`);
      setGrades(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get(`/api/attendance/student/${id}`);
      setAttendance(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await api.get(`/api/fees/student/${id}`);
      setFees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Student not found</p>
        <Button onClick={() => navigate('/students')} className='mt-4'>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/students')}
            className='shrink-0'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div className='min-w-0'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 truncate'>
              {student.name}
            </h1>
            <p className='text-gray-500 mt-1 text-sm sm:text-base'>
              Roll Number: {student.rollNumber}
            </p>
          </div>
        </div>
        <Button className='w-full sm:w-auto'>
          <Edit className='h-4 w-4 mr-2' />
          Edit Student
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg sm:text-xl'>
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-center'>
              <div className='h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='h-10 w-10 sm:h-12 sm:w-12 text-primary' />
              </div>
            </div>
            <div className='space-y-3 pt-4'>
              <div>
                <p className='text-sm text-gray-500'>Status</p>
                <Badge
                  variant={
                    student.status === 'active' ? 'default' : 'secondary'
                  }
                  className='text-xs'
                >
                  {student.status}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Class</p>
                <p className='font-medium text-sm sm:text-base'>
                  {student.class}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Age</p>
                <p className='font-medium text-sm sm:text-base'>
                  {student.age} years
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Gender</p>
                <p className='font-medium text-sm sm:text-base'>
                  {student.gender}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-gray-500 shrink-0' />
                <p className='text-sm break-all'>{student.email}</p>
              </div>
              {student.phone && (
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-gray-500 shrink-0' />
                  <p className='text-sm'>{student.phone}</p>
                </div>
              )}
              {student.address && (
                <div className='flex items-start gap-2'>
                  <MapPin className='h-4 w-4 text-gray-500 mt-1 shrink-0' />
                  <p className='text-sm'>{student.address}</p>
                </div>
              )}
            </div>
            {(student.guardianName || student.guardianPhone) && (
              <div className='pt-4 border-t'>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Guardian Information
                </p>
                {student.guardianName && (
                  <p className='text-sm text-gray-600'>
                    Name: {student.guardianName}
                  </p>
                )}
                {student.guardianPhone && (
                  <p className='text-sm text-gray-600'>
                    Phone: {student.guardianPhone}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className='lg:col-span-2'>
          <Tabs defaultValue='grades' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='grades' className='text-xs sm:text-sm'>
                Grades
              </TabsTrigger>
              <TabsTrigger value='attendance' className='text-xs sm:text-sm'>
                Attendance
              </TabsTrigger>
              <TabsTrigger value='fees' className='text-xs sm:text-sm'>
                Fees
              </TabsTrigger>
            </TabsList>

            <TabsContent value='grades'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg sm:text-xl'>
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {grades.length === 0 ? (
                    <p className='text-center text-gray-500 py-8 text-sm sm:text-base'>
                      No grades recorded yet
                    </p>
                  ) : (
                    <div className='space-y-3'>
                      {grades.map((grade) => (
                        <div
                          key={grade._id}
                          className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 rounded-lg'
                        >
                          <div className='min-w-0'>
                            <p className='font-medium text-sm sm:text-base truncate'>
                              {grade.subject}
                            </p>
                            <p className='text-xs sm:text-sm text-gray-500'>
                              {grade.term} - {grade.academic_year}
                            </p>
                          </div>
                          <div className='text-left sm:text-right shrink-0'>
                            <p className='text-xl sm:text-2xl font-bold text-primary'>
                              {grade.grade}
                            </p>
                            <p className='text-xs sm:text-sm text-gray-500'>
                              {grade.marks}/100
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='attendance'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg sm:text-xl'>
                    Attendance Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendance.length === 0 ? (
                    <p className='text-center text-gray-500 py-8 text-sm sm:text-base'>
                      No attendance records yet
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {attendance.slice(0, 10).map((record) => (
                        <div
                          key={record._id}
                          className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                        >
                          <p className='text-sm'>
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          <Badge
                            variant={
                              record.status === 'present'
                                ? 'default'
                                : 'destructive'
                            }
                            className='text-xs'
                          >
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='fees'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg sm:text-xl'>
                    Fee Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fees.length === 0 ? (
                    <p className='text-center text-gray-500 py-8 text-sm sm:text-base'>
                      No fee records yet
                    </p>
                  ) : (
                    <div className='space-y-3'>
                      {fees.map((fee) => (
                        <div
                          key={fee._id}
                          className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 rounded-lg'
                        >
                          <div className='min-w-0'>
                            <p className='font-medium text-sm sm:text-base'>
                              ₦{fee.amount.toLocaleString()}
                            </p>
                            <p className='text-xs sm:text-sm text-gray-500'>
                              {fee.term} - {fee.academic_year}
                            </p>
                            <p className='text-xs text-gray-400'>
                              {new Date(fee.payment_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              fee.status === 'paid' ? 'default' : 'destructive'
                            }
                            className='text-xs shrink-0'
                          >
                            {fee.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

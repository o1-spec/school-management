import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { BarChart, PieChart, Download, TrendingUp, Users, BookOpen } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [classDistribution, setClassDistribution] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [classRes, performersRes] = await Promise.all([
        api.get('/api/reports/class-distribution'),
        api.get('/api/reports/top-performers')
      ]);

      setClassDistribution(classRes.data);
      setTopPerformers(performersRes.data);
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    toast.success(`Exporting ${type} report...`);
    // Implement export functionality here
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View comprehensive school statistics and reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => exportReport('PDF')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('Excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Classes
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classDistribution.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classDistribution.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Performance
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topPerformers.length > 0 
                ? (topPerformers.reduce((sum, p) => sum + p.averageMarks, 0) / topPerformers.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
            <CardDescription>Number of students per class</CardDescription>
          </CardHeader>
          <CardContent>
            {classDistribution.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {classDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Class {item._id}</p>
                        <p className="text-sm text-gray-500">{item.count} students</p>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / classDistribution.reduce((sum, i) => sum + i.count, 0)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Students with highest average marks</CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {topPerformers.slice(0, 10).map((performer, index) => (
                  <div key={performer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-gray-500">
                          {performer.rollNumber} - {performer.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {performer.averageMarks.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {performer.totalSubjects} subjects
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
          <CardDescription>Overview of key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {classDistribution.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Classes</p>
              <p className="text-2xl font-bold text-green-600">
                {classDistribution.length}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Top Performers</p>
              <p className="text-2xl font-bold text-purple-600">
                {topPerformers.length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
              <p className="text-2xl font-bold text-orange-600">
                {topPerformers.length > 0 
                  ? (topPerformers.reduce((sum, p) => sum + p.averageMarks, 0) / topPerformers.length).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
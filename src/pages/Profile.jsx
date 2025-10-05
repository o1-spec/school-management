import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import api from '@/lib/api';
import { User, Mail, Shield, Key, Save } from 'lucide-react';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/api/users/profile', formData);

      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 max-w-4xl'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Profile Settings
        </h1>
        <p className='text-gray-500 mt-1 text-sm sm:text-base'>
          Manage your account settings and preferences
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg sm:text-xl'>
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex justify-center'>
              <div className='h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='h-10 w-10 sm:h-12 sm:w-12 text-primary' />
              </div>
            </div>
            <div className='text-center space-y-2'>
              <h3 className='font-semibold text-lg sm:text-xl'>
                {user?.full_name}
              </h3>
              <p className='text-sm sm:text-base text-gray-500 break-all'>
                {user?.email}
              </p>
              <Badge
                variant='outline'
                className='capitalize text-xs sm:text-sm'
              >
                <Shield className='h-3 w-3 mr-1' />
                {user?.role}
              </Badge>
            </div>
            <Separator />
            <div className='space-y-2 text-sm'>
              <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                <span className='text-gray-600'>Member Since</span>
                <span className='font-medium text-sm sm:text-base'>
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                <span className='text-gray-600'>Account Status</span>
                <Badge variant='default' className='text-xs sm:text-sm w-fit'>
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                <div>
                  <CardTitle className='text-lg sm:text-xl'>
                    Personal Information
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base'>
                    Update your personal details
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant='outline'
                    onClick={() => setIsEditing(true)}
                    className='w-full sm:w-auto'
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='full_name' className='text-sm sm:text-base'>
                    Full Name
                  </Label>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      id='full_name'
                      name='full_name'
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className='text-sm sm:text-base'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-sm sm:text-base'>
                    Email Address
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className='text-sm sm:text-base'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label className='text-sm sm:text-base'>Role</Label>
                  <div className='flex items-center gap-2'>
                    <Shield className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      value={user?.role}
                      disabled
                      className='capitalize text-sm sm:text-base'
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full sm:w-auto'
                    >
                      <Save className='h-4 w-4 mr-2' />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: user?.full_name || '',
                          email: user?.email || '',
                        });
                      }}
                      className='w-full sm:w-auto'
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg sm:text-xl'>
                Change Password
              </CardTitle>
              <CardDescription className='text-sm sm:text-base'>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='currentPassword'
                    className='text-sm sm:text-base'
                  >
                    Current Password
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Key className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      id='currentPassword'
                      name='currentPassword'
                      type='password'
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder='••••••••'
                      required
                      className='text-sm sm:text-base'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword' className='text-sm sm:text-base'>
                    New Password
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Key className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      id='newPassword'
                      name='newPassword'
                      type='password'
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder='••••••••'
                      required
                      className='text-sm sm:text-base'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='confirmPassword'
                    className='text-sm sm:text-base'
                  >
                    Confirm New Password
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Key className='h-4 w-4 text-gray-400 shrink-0' />
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      type='password'
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder='••••••••'
                      required
                      className='text-sm sm:text-base'
                    />
                  </div>
                </div>
                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full sm:w-auto'
                >
                  <Key className='h-4 w-4 mr-2' />
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

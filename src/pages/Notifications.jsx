import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  AlertCircle,
  Info,
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(
        notifications.map((notif) => ({ ...notif, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter((notif) => notif._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: Info,
      warning: AlertCircle,
      success: Check,
      error: AlertCircle,
    };
    const Icon = icons[type] || Info;
    return <Icon className='h-5 w-5' />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      success: 'text-green-600 bg-green-100',
      error: 'text-red-600 bg-red-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.read;
    if (activeTab === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((notif) => !notif.read).length;

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
            Notifications
          </h1>
          <p className='text-gray-500 mt-1 text-sm sm:text-base'>
            Stay updated with system activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} className='w-full sm:w-auto'>
            <CheckCheck className='h-4 w-4 mr-2' />
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='all' className='text-xs sm:text-sm'>
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value='unread' className='text-xs sm:text-sm'>
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value='read' className='text-xs sm:text-sm'>
            Read ({notifications.filter((n) => n.read).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='space-y-4'>
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Bell className='h-12 w-12 text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No notifications
                </h3>
                <p className='text-gray-500 text-center text-sm sm:text-base'>
                  {activeTab === 'unread'
                    ? "You're all caught up!"
                    : 'No notifications in this category.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={
                  notification.read
                    ? 'bg-gray-50'
                    : 'bg-white border-l-4 border-l-primary'
                }
              >
                <CardContent className='p-4 sm:p-6'>
                  <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                    <div className='flex items-start gap-4 min-w-0'>
                      <div
                        className={`p-2 rounded-full ${getNotificationColor(
                          notification.type
                        )} shrink-0`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-2'>
                          <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge
                              variant='secondary'
                              className='text-xs w-fit shrink-0'
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className='text-gray-600 mb-3 text-sm sm:text-base'>
                          {notification.message}
                        </p>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500'>
                          <div className='flex items-center gap-1'>
                            <Clock className='h-4 w-4 shrink-0' />
                            <span className='text-xs sm:text-sm'>
                              {new Date(
                                notification.created_at
                              ).toLocaleString()}
                            </span>
                          </div>
                          {notification.category && (
                            <Badge variant='outline' className='text-xs w-fit'>
                              {notification.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2 shrink-0'>
                      {!notification.read && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => markAsRead(notification._id)}
                          className='h-8 w-8 p-0'
                        >
                          <Check className='h-4 w-4' />
                        </Button>
                      )}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteNotification(notification._id)}
                        className='h-8 w-8 p-0'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;

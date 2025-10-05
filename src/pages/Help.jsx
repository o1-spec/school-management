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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
  Search,
  Users,
  BookOpen as GradesIcon,
  Calendar,
  DollarSign,
  BarChart3,
  Bell,
  ExternalLink,
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: 'How do I add a new student?',
      answer:
        "Go to the Students page and click 'Add Student'. Fill in the required information including name, roll number, class, and contact details. Click 'Save' to add the student to the system.",
    },
    {
      question: 'How do I record attendance?',
      answer:
        "Navigate to the Attendance page. Select a date from the calendar, then mark students as present, absent, late, or excused. You can also use the 'Mark All Present' or 'Mark All Absent' buttons for bulk actions.",
    },
    {
      question: 'How do I add grades for students?',
      answer:
        "Go to the Grades page and click 'Add Grade'. Select a student, enter the subject, marks (0-100), term, academic year, and any remarks. The system will automatically calculate the grade.",
    },
    {
      question: 'How do I record fee payments?',
      answer:
        "Visit the Fees page and click 'Record Payment'. Select the student, enter the amount, choose payment method, term, and academic year. Add a receipt number if available.",
    },
    {
      question: 'How do I view reports?',
      answer:
        'The Reports page provides comprehensive analytics including class distribution, top performers, and fee statistics. You can also export reports in PDF or Excel format.',
    },
    {
      question: 'How do I manage notifications?',
      answer:
        'Check the Notifications page to view all system notifications. You can mark them as read, delete them, or filter by read/unread status.',
    },
    {
      question: 'How do I change my password?',
      answer:
        "Go to your Profile page and use the 'Change Password' section. Enter your current password and choose a new secure password.",
    },
    {
      question: 'How do I export data?',
      answer:
        "Most pages have export functionality. Look for 'Export PDF' or 'Export Excel' buttons in the Reports page or individual data tables.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickLinks = [
    {
      title: 'Students Management',
      icon: Users,
      path: '/students',
      description: 'Add, edit, and manage student records',
    },
    {
      title: 'Grade Management',
      icon: GradesIcon,
      path: '/grades',
      description: 'Record and track student grades',
    },
    {
      title: 'Attendance Tracking',
      icon: Calendar,
      path: '/attendance',
      description: 'Mark daily student attendance',
    },
    {
      title: 'Fee Management',
      icon: DollarSign,
      path: '/fees',
      description: 'Track payments and outstanding fees',
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      path: '/reports',
      description: 'View comprehensive school statistics',
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/notifications',
      description: 'Manage system notifications',
    },
  ];

  return (
    <div className='space-y-6 max-w-6xl'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Help & Support
        </h1>
        <p className='text-gray-500 mt-1 text-sm sm:text-base'>
          Find answers to common questions and get support
        </p>
      </div>

      <Tabs defaultValue='faq' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-2 sm:grid-cols-4'>
          <TabsTrigger value='faq' className='text-xs sm:text-sm'>
            FAQ
          </TabsTrigger>
          <TabsTrigger value='guide' className='text-xs sm:text-sm'>
            User Guide
          </TabsTrigger>
          <TabsTrigger value='contact' className='text-xs sm:text-sm'>
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value='faq' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <HelpCircle className='h-5 w-5' />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className='text-sm sm:text-base'>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    placeholder='Search FAQs...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10 text-sm sm:text-base'
                  />
                </div>

                <Accordion type='single' collapsible className='w-full'>
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className='text-left text-sm sm:text-base'>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className='text-sm sm:text-base'>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && (
                  <div className='text-center py-8 text-gray-500 text-sm sm:text-base'>
                    No FAQs found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='guide' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <BookOpen className='h-5 w-5' />
                Quick Start Guide
              </CardTitle>
              <CardDescription className='text-sm sm:text-base'>
                Get started with the main features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Card
                      key={index}
                      className='cursor-pointer hover:shadow-md transition-shadow'
                    >
                      <CardContent className='p-4 sm:p-6'>
                        <div className='flex items-start gap-4'>
                          <div className='p-2 bg-primary/10 rounded-lg shrink-0'>
                            <Icon className='h-6 w-6 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h3 className='font-semibold text-gray-900 mb-1 text-sm sm:text-base'>
                              {link.title}
                            </h3>
                            <p className=' text-gray-600 mb-3 text-xs sm:text-sm'>
                              {link.description}
                            </p>
                            <Button
                              variant='outline'
                              size='sm'
                              className='w-full'
                            >
                              <ExternalLink className='h-4 w-4 mr-2' />
                              Go to {link.title}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg sm:text-xl'>
                Getting Started
              </CardTitle>
              <CardDescription className='text-sm sm:text-base'>
                Step-by-step guide to set up your school management system
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Badge variant='outline' className='mt-1 text-xs'>
                    1
                  </Badge>
                  <div className='min-w-0'>
                    <h4 className='font-medium text-sm sm:text-base'>
                      Create Your Account
                    </h4>
                    <p className=' text-gray-600 text-xs sm:text-sm'>
                      Register as an admin or teacher to access the system.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Badge variant='outline' className='mt-1 text-xs'>
                    2
                  </Badge>
                  <div className='min-w-0'>
                    <h4 className='font-medium text-sm sm:text-base'>
                      Add Students
                    </h4>
                    <p className=' text-gray-600 text-xs sm:text-sm'>
                      Start by adding student records with their basic
                      information.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Badge variant='outline' className='mt-1 text-xs'>
                    3
                  </Badge>
                  <div className='min-w-0'>
                    <h4 className='font-medium text-sm sm:text-base'>
                      Configure Classes
                    </h4>
                    <p className=' text-gray-600 text-xs sm:text-sm'>
                      Set up class structures and assign students to appropriate
                      classes.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Badge variant='outline' className='mt-1 text-xs'>
                    4
                  </Badge>
                  <div className='min-w-0'>
                    <h4 className='font-medium text-sm sm:text-base'>
                      Start Tracking
                    </h4>
                    <p className=' text-gray-600 text-xs sm:text-sm'>
                      Begin recording attendance, grades, and fees as needed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='contact' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <MessageSquare className='h-5 w-5' />
                Contact Support
              </CardTitle>
              <CardDescription className='text-sm sm:text-base'>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Mail className='h-5 w-5 text-primary shrink-0' />
                    <div className='min-w-0'>
                      <h4 className='font-medium text-sm sm:text-base'>
                        Email Support
                      </h4>
                      <p className=' text-gray-600 text-xs sm:text-sm break-all'>
                        support@schoolmanagement.com
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Phone className='h-5 w-5 text-primary shrink-0' />
                    <div className='min-w-0'>
                      <h4 className='font-medium text-sm sm:text-base'>
                        Phone Support
                      </h4>
                      <p className=' text-gray-600 text-xs sm:text-sm'>
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='subject' className='text-sm sm:text-base'>
                      Subject
                    </Label>
                    <Input
                      id='subject'
                      placeholder='Brief description of your issue'
                      className='text-sm sm:text-base'
                    />
                  </div>
                  <div>
                    <Label htmlFor='message' className='text-sm sm:text-base'>
                      Message
                    </Label>
                    <textarea
                      id='message'
                      className='w-full p-3 border border-gray-300 rounded-md resize-none text-sm sm:text-base'
                      rows={4}
                      placeholder='Describe your issue or question...'
                    />
                  </div>
                  <Button className='w-full'>Send Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;

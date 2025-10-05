"use client"

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, BookOpen, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"
import { toast } from "sonner"

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    total_classes: 0,
    present_today: 0,
    pending_fees: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivities()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/api/stats/dashboard")
      setStats(response.data)
    } catch (error) {
      toast.error("Failed to load dashboard statistics")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const response = await api.get("/api/activities/recent")
      setRecentActivities(response.data)
    } catch (error) {
      console.error("Failed to load recent activities")
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      student: Users,
      attendance: Calendar,
      grade: BookOpen,
      fee: DollarSign,
    }
    const Icon = icons[type] || Users
    return Icon
  }

  const getActivityColor = (type) => {
    const colors = {
      student: "bg-blue-100 text-blue-600",
      attendance: "bg-green-100 text-green-600",
      grade: "bg-purple-100 text-purple-600",
      fee: "bg-orange-100 text-orange-600",
    }
    return colors[type] || "bg-gray-100 text-gray-600"
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: Users,
      description: `${stats.active_students} active students`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Classes",
      value: stats.total_classes,
      icon: BookOpen,
      description: "Across all grades",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Present Today",
      value: stats.present_today,
      icon: Calendar,
      description: "Students in attendance",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Fees",
      value: `₦${stats.pending_fees.toLocaleString()}`,
      icon: null,
      description: "Outstanding payments",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      isCurrency: true,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.isCurrency ? (
                    <span className={`text-lg font-bold ${stat.color}`}>₦</span>
                  ) : (
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No recent activities</p>
                  <p className="text-xs sm:text-sm">Activities will appear here as they happen</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  const colorClass = getActivityColor(activity.type)

                  return (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0">{activity.timeAgo}</div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/students/add"
                className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
              >
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mb-2" />
                <p className="text-xs sm:text-sm font-medium">Add Student</p>
              </Link>
              <Link to="/attendance" className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mb-2" />
                <p className="text-xs sm:text-sm font-medium">Mark Attendance</p>
              </Link>
              <Link to="/grades" className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mb-2" />
                <p className="text-xs sm:text-sm font-medium">Add Grades</p>
              </Link>
              <Link to="/fees" className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors block">
                <span className="text-xl sm:text-2xl text-orange-600 mb-2 block">₦</span>
                <p className="text-xs sm:text-sm font-medium">Record Fee</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

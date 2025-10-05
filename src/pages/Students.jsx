"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"
import { toast } from "sonner"

const Students = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchStudents()
  }, [filterClass, filterStatus])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (filterClass !== "all") params.append("class", filterClass)
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (searchTerm) params.append("search", searchTerm)

      const response = await api.get(`/api/students?${params.toString()}`)
      setStudents(response.data)
    } catch (error) {
      toast.error("Failed to load students")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchStudents()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return

    try {
      await api.delete(`/api/students/${id}`)
      toast.success("Student deleted successfully")
      fetchStudents()
    } catch (error) {
      toast.error("Failed to delete student")
      console.error(error)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      graduated: "outline",
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage all student records</p>
        </div>
        <Button onClick={() => navigate("/students/add")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, roll number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="10A">Class 10A</SelectItem>
                  <SelectItem value="10B">Class 10B</SelectItem>
                  <SelectItem value="11A">Class 11A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] sm:w-auto hidden sm:table-cell">Roll No.</TableHead>
                  <TableHead className="w-[120px] sm:w-auto">Name</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Class</TableHead>
                  <TableHead className="w-[180px] sm:w-auto hidden md:table-cell">Email</TableHead>
                  <TableHead className="w-[80px] sm:w-auto">Status</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-auto">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium text-xs sm:text-sm hidden sm:table-cell">
                        {student.rollNumber}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{student.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.class}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm">{student.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "active"
                              ? "default"
                              : student.status === "inactive"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                           {getStatusBadge(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/students/${student._id}`)}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/students/${student._id}/edit`)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student._id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
  )
}

export default Students

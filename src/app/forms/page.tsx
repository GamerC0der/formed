"use client"

import { useState, useEffect } from "react"
import { Trash2, Search, Eye, Lock } from "lucide-react"

export default function FormsPage() {
  const [forms, setForms] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/forms', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        fetchForms()
      } else {
        alert("Incorrect password")
      }
    } catch (error) {
      alert("Login failed")
    }
  }

  const fetchForms = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/forms', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    }
    setLoading(false)
  }

  const deleteForm = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return
    
    try {
      const response = await fetch(`/api/forms/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      if (response.ok) {
        setForms(forms.filter(form => form.uuid !== uuid))
      }
    } catch (error) {
      console.error('Error deleting form:', error)
    }
  }

  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.uuid.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Forms Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search forms..."
                className="bg-gray-800 text-white border border-gray-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-white"
              />
            </div>
            <button
              onClick={fetchForms}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading forms...</div>
        ) : (
          <div className="grid gap-4">
            {filteredForms.map((form) => (
              <div key={form.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {form.name || 'Untitled Form'}
                    </h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>UUID: {form.uuid}</p>
                      <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                      <p>Components: {form.content?.formComponents?.length || 0}</p>
                      <p>Submissions: {form.submissions?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`/f/${form.uuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </a>
                    {form.submissions && form.submissions.length > 0 && (
                      <div className="bg-gray-800 rounded-lg p-4 max-w-md">
                        <h4 className="text-white font-medium mb-2">Recent Submissions:</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {form.submissions.slice(0, 3).map((submission: any) => (
                            <div key={submission.id} className="text-xs text-gray-300 bg-gray-700 p-2 rounded">
                              <p>Date: {new Date(submission.createdAt).toLocaleString()}</p>
                              <details className="mt-1">
                                <summary className="cursor-pointer text-blue-400">View Data</summary>
                                <pre className="mt-1 text-xs overflow-x-auto">
                                  {JSON.stringify(submission.data, null, 2)}
                                </pre>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => deleteForm(form.uuid)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredForms.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'No forms found matching your search.' : 'No forms created yet.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

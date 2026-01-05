import { useEffect, useState } from 'react'
import api from './api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Main application component for Snippet Locker
 * 
 * A full-stack code snippet management application that allows users to:
 * - Create new code snippets with syntax highlighting
 * - Edit existing snippets with a modal interface
 * - View all saved snippets in a responsive grid layout
 * - Search and filter snippets by title, code, or language
 * - Copy snippets to clipboard with visual feedback
 * - Delete snippets with confirmation
 * - Authentication: Secure Login/Register and Token storage
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 */
function App() {
  // ============================================================================
  // AUTHENTICATION STATE
  // ============================================================================
  
  /** @type {[boolean, Function]} Tracks if a valid token exists in storage */
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  /** @type {[boolean, Function]} Toggles between Login and Registration forms */
  const [isRegistering, setIsRegistering] = useState(false);

  /** @type {[string, Function]} Username for Auth forms */
  const [username, setUsername] = useState('');

  /** @type {[string, Function]} Password for Auth forms */
  const [password, setPassword] = useState('');

  // ============================================================================
  // SNIPPET STATE MANAGEMENT
  // ============================================================================
  
  /** @type {[Array, Function]} List of all code snippets from the backend */
  const [snippets, setSnippets] = useState([])
  
  /** @type {[string, Function]} Title input for new snippet */
  const [title, setTitle] = useState('')
  
  /** @type {[string, Function]} Code content for new snippet */
  const [code, setCode] = useState('')
  
  /** @type {[string, Function]} Selected programming language for new snippet */
  const [language, setLanguage] = useState('javascript')
  
  /** @type {[number|null, Function]} ID of the snippet that was just copied (for UI feedback) */
  const [copiedId, setCopiedId] = useState(null)
  
  // Loading States
  /** @type {[boolean, Function]} Loading state for initial snippet fetch */
  const [isLoading, setIsLoading] = useState(true)
  
  /** @type {[boolean, Function]} Loading state for form submission */
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  /** @type {[number|null, Function]} ID of snippet currently being deleted */
  const [deletingId, setDeletingId] = useState(null)

  // Search and Filter States
  /** @type {[string, Function]} Search query for filtering snippets */
  const [searchQuery, setSearchQuery] = useState('')
  
  /** @type {[string, Function]} Selected language filter (empty string = all languages) */
  const [languageFilter, setLanguageFilter] = useState('')

  // Edit States
  /** @type {[Object|null, Function]} The snippet currently being edited */
  const [editingSnippet, setEditingSnippet] = useState(null)
  
  /** @type {[string, Function]} Title of snippet being edited */
  const [editTitle, setEditTitle] = useState('')
  
  /** @type {[string, Function]} Code of snippet being edited */
  const [editCode, setEditCode] = useState('')
  
  /** @type {[string, Function]} Language of snippet being edited */
  const [editLanguage, setEditLanguage] = useState('javascript')

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
  ]

  // ============================================================================
  // AUTHENTICATION FUNCTIONS
  // ============================================================================

  /**
   * Handles user login by sending credentials to Django /auth/ endpoint
   * @async
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  /**
   * Handles user registration by sending data to Django /register/ endpoint
   * @async
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', { username, password });
      alert("Account created! Please log in.");
      setIsRegistering(false);
    } catch (error) {
      console.error("Registration failed", error);
      alert("Error creating account.");
    }
  };

  /**
   * Logs user out by clearing local storage and resetting state
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchSnippets = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true)
      const response = await api.get('snippets/')
      setSnippets(response.data)
    } catch (error) {
      console.error("Error fetching snippets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchSnippets()
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.post('snippets/', { title, code, language })
      setTitle('')
      setCode('')
      setLanguage('javascript')
      await fetchSnippets()
    } catch (error) {
      console.error("Error saving snippet:", error)
      alert("Error saving snippet")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (snippet) => {
    setEditingSnippet(snippet)
    setEditTitle(snippet.title)
    setEditCode(snippet.code)
    setEditLanguage(snippet.language)
  }

  const handleCancelEdit = () => {
    setEditingSnippet(null)
    setEditTitle('')
    setEditCode('')
    setEditLanguage('javascript')
  }

  const handleUpdateSnippet = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.put(`snippets/${editingSnippet.id}/`, {
        title: editTitle,
        code: editCode,
        language: editLanguage
      })
      handleCancelEdit()
      await fetchSnippets()
    } catch (error) {
      console.error("Error updating snippet:", error)
      alert("Error updating snippet")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = async (snippetCode, snippetId) => {
    try {
      await navigator.clipboard.writeText(snippetCode)
      setCopiedId(snippetId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this snippet?")) return
    setDeletingId(id)
    try {
      await api.delete(`snippets/${id}/`)
      await fetchSnippets()
    } catch (error) {
      console.error("Error deleting snippet:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const getFilteredSnippets = () => {
    return snippets.filter(snippet => {
      const matchesLanguage = !languageFilter || snippet.language === languageFilter
      const matchesSearch = !searchQuery || 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLanguage && matchesSearch
    })
  }

  const filteredSnippets = getFilteredSnippets()

  // ============================================================================
  // RENDER: GATEKEEPER (LOGIN/REGISTER PAGE)
  // ============================================================================

  if (!isAuthenticated) {
    return (
      <div className="h-[100vh] w-screen flex items-center justify-center bg-[#242424]">
        <div className="bg-[#1a1a1a] p-10 rounded-xl shadow-2xl w-[400px] border border-gray-800">
          <h1 className="text-4xl font-bold text-blue-400 mb-2 text-center">Snippet Locker</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {isRegistering ? 'Join our community' : 'Please sign in to continue'}
          </p>
          
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            <input 
              type="text" placeholder="Username" required
              className="w-full bg-[#242424] p-3 rounded text-white outline-none border border-gray-700 focus:border-blue-500"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-[#242424] p-3 rounded text-white outline-none border border-gray-700 focus:border-blue-500"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold transition">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-4 text-gray-500 hover:text-gray-300 text-sm transition"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN DASHBOARD
  // ============================================================================

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="w-full px-4 md:px-8 py-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-400">Snippet Locker</h1>
          <p className="text-gray-400 mt-2">Welcome back, {localStorage.getItem('username')}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="!bg-red-600 hover:!bg-red-700 !text-white px-4 py-2 rounded-md font-bold transition-colors shadow-lg border-none"
          style={{ backgroundColor: '#dc2626', color: 'white' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-0 h-[calc(100vh-140px)]">
        
        {/* Left Column - Create Form */}
        <div className="lg:col-span-1 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Create New Snippet</h2>
              <div className="space-y-4">
                <input 
                  className="w-full bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Language</label>
                  <select 
                    className="w-full bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500 cursor-pointer"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isSubmitting}
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea 
                  className="w-full bg-gray-700 p-2 rounded h-48 font-mono text-sm outline-none focus:ring-2 ring-blue-500"
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button 
                  type="submit" 
                  style={{ backgroundColor: isSubmitting ? '#4b5563' : '#3b82f6' }}
                  className="w-full hover:bg-blue-600 text-white font-bold p-3 rounded-md transition duration-200 disabled:cursor-not-allowed shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '💾 Saving...' : '💾 Save Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Snippets List */}
        <div className="lg:col-span-3 p-6 overflow-y-auto bg-gray-900 flex flex-col">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search snippets by title or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg outline-none focus:ring-2 ring-blue-500 text-white placeholder-gray-500"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg outline-none focus:ring-2 ring-blue-500 text-white cursor-pointer"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Counter */}
          {!isLoading && snippets.length > 0 && (
            <div className="mb-4 text-gray-400 text-sm flex-shrink-0">
              Showing {filteredSnippets.length} of {snippets.length} snippets
              {(searchQuery || languageFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLanguageFilter('')
                  }}
                  className="ml-4 text-blue-400 hover:text-blue-300 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Content Area - Takes remaining space */}
          <div className="flex-1 flex flex-col min-h-0">

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 px-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                <p className="text-gray-400 text-lg">Loading your snippets...</p>
              </div>
            </div>
          )}

          {/* Empty State - When user has no snippets */}
          {!isLoading && snippets.length === 0 && (
            <div className="flex items-center justify-center flex-1 w-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-2xl mb-2 font-semibold">No snippets yet!</p>
                <p className="text-gray-500 text-lg">Create your first snippet to get started.</p>
              </div>
            </div>
          )}

          {/* No Results State - When filter returns nothing */}
          {!isLoading && snippets.length > 0 && filteredSnippets.length === 0 && (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 px-8">
                <p className="text-gray-400 text-lg mb-2">🔍 No snippets found</p>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLanguageFilter('')
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          {/* Snippets Grid */}
          {!isLoading && filteredSnippets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 overflow-y-auto">
              {filteredSnippets.map(snip => (
               <div key={snip.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative group flex flex-col h-full">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex-1">
                     <h2 className="text-lg font-semibold text-blue-300 mb-2">{snip.title}</h2>
                     <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                       {languages.find(l => l.value === snip.language)?.label || snip.language}
                     </span>
                   </div>
                   <div className="flex gap-2 ml-2">
                     <button 
                       onClick={() => handleEditClick(snip)} 
                       className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold px-3 py-1 rounded transition duration-200"
                       title="Edit snippet"
                     >
                       ✏️
                     </button>
                     <button 
                       onClick={() => handleCopy(snip.code, snip.id)} 
                       className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-1 rounded transition duration-200"
                       title="Copy to clipboard"
                     >
                       {copiedId === snip.id ? '✓' : '📋'}
                     </button>
                     <button 
                       onClick={() => handleDelete(snip.id)} 
                       className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-1 rounded transition duration-200" 
                       disabled={deletingId === snip.id}
                       title="Delete snippet"
                     >
                       {deletingId === snip.id ? '⏳' : '🗑️'}
                     </button>
                   </div>
                 </div>
                 <div className="mt-4 overflow-hidden rounded-lg border border-gray-900 shadow-inner flex-1">
                   <SyntaxHighlighter 
                     language={snip.language ? snip.language.toLowerCase() : 'javascript'} 
                     style={atomDark}
                     customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem', backgroundColor: '#000000', height: '100%' }}
                     showLineNumbers={true}
                   >
                     {snip.code}
                   </SyntaxHighlighter>
                 </div>
               </div>
              ))}
            </div>
          )}
          </div>{/* End Content Area */}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-300 mb-6">Edit Snippet</h2>
              <form onSubmit={handleUpdateSnippet} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input 
                    className="w-full bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Language</label>
                  <select 
                    className="w-full bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500 cursor-pointer" 
                    value={editLanguage} 
                    onChange={(e) => setEditLanguage(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code</label>
                  <textarea 
                    className="w-full bg-gray-700 p-2 rounded h-64 font-mono text-sm outline-none focus:ring-2 ring-blue-500" 
                    value={editCode} 
                    onChange={(e) => setEditCode(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    style={{ backgroundColor: isSubmitting ? '#4b5563' : '#3b82f6' }}
                    className="flex-1 hover:bg-blue-600 text-white font-bold p-3 rounded-md transition duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Snippet'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    style={{ backgroundColor: '#374151' }}
                    className="flex-1 hover:bg-gray-600 text-white font-bold p-3 rounded-md transition duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
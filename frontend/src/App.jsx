import { useEffect, useState } from 'react'
import api from './api'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Main application component for Snippet Locker
 * 
 * A full-stack code snippet management application that allows users to:
 * - Create new code snippets with syntax highlighting
 * - View all saved snippets in a responsive grid layout
 * - Copy snippets to clipboard with visual feedback
 * - Delete snippets with confirmation
 * - Filter snippets by programming language
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 */
function App() {
  // ============================================================================
  // STATE MANAGEMENT
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

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  /**
   * Supported programming languages for syntax highlighting
   * Each language has a value (for API/highlighting) and label (for display)
   */
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
  // API FUNCTIONS
  // ============================================================================

  /**
   * Fetches all snippets from the backend API
   * Sets loading state during the request and handles errors gracefully
   * 
   * @async
   * @function fetchSnippets
   * @returns {Promise<void>}
   */
  const fetchSnippets = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('snippets/')
      setSnippets(response.data)
    } catch (error) {
      console.error("Error fetching snippets:", error)
      alert("Failed to load snippets. Make sure the backend is running!")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetches snippets on component mount
   * Empty dependency array ensures this runs only once
   */
  useEffect(() => {
    fetchSnippets()
  }, [])

  /**
   * Handles form submission to create a new snippet
   * Validates form, submits to API, resets form, and refreshes snippet list
   * 
   * @async
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send new snippet to backend
      await api.post('snippets/', { title, code, language })
      
      // Reset form to initial state
      setTitle('')
      setCode('')
      setLanguage('javascript')
      
      // Refresh the snippet list to show the new snippet
      await fetchSnippets()
    } catch (error) {
      console.error("Error saving snippet:", error)
      alert("Error saving snippet")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Copies snippet code to clipboard using the Clipboard API
   * Shows visual feedback by updating the button text for 2 seconds
   * 
   * @async
   * @function handleCopy
   * @param {string} snippetCode - The code content to copy
   * @param {number} snippetId - The ID of the snippet being copied (for UI feedback)
   * @returns {Promise<void>}
   */
  const handleCopy = async (snippetCode, snippetId) => {
    try {
      await navigator.clipboard.writeText(snippetCode)
      
      // Show "Copied!" feedback
      setCopiedId(snippetId)
      
      // Reset feedback after 2 seconds
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      alert("Failed to copy to clipboard")
    }
  }

  /**
   * Deletes a snippet after user confirmation
   * Shows loading state during deletion and refreshes the list on success
   * 
   * @async
   * @function handleDelete
   * @param {number} id - The ID of the snippet to delete
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    if (!confirm("Delete this snippet?")) return
    
    setDeletingId(id)
    
    try {
      await api.delete(`snippets/${id}/`)
      // Refresh the list to remove the deleted snippet
      await fetchSnippets()
    } catch (error) {
      console.error("Error deleting snippet:", error)
      alert("Failed to delete snippet")
    } finally {
      setDeletingId(null)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="px-4 md:px-8 py-6 border-b border-gray-800">
        <h1 className="text-4xl font-bold text-blue-400">🔒 Snippet Locker</h1>
        <p className="text-gray-400 mt-2">Your personal code snippet manager</p>
      </div>

      {/* Main Content - Two Column Layout on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[calc(100vh-140px)]">
        
        {/* Left Column - Create Form */}
        <div className="lg:col-span-1 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Create New Snippet</h2>
              
              <div className="space-y-4">
                {/* Title Input */}
                <input 
                  className="bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                
                {/* Language Dropdown */}
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

                {/* Code Textarea */}
                <textarea 
                  className="bg-gray-700 p-2 rounded h-48 font-mono text-sm outline-none focus:ring-2 ring-blue-500"
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '💾 Saving...' : '💾 Save Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Snippets List */}
        <div className="lg:col-span-3 p-6 overflow-y-auto bg-gray-900">
          {/* Loading State - Shown while fetching snippets */}
          {isLoading && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading your snippets...</p>
            </div>
          )}

          {/* Empty State - Shown when no snippets exist */}
          {!isLoading && snippets.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-lg mb-2">📭 No snippets yet!</p>
              <p className="text-gray-500">Create your first snippet to get started.</p>
            </div>
          )}

          {/* Snippets Grid - Responsive layout that adjusts to screen size */}
          {!isLoading && snippets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {snippets.map(snip => (
               <div key={snip.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative group flex flex-col h-full">
                 {/* Snippet Header - Title, Language Badge, and Action Buttons */}
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex-1">
                     <h2 className="text-lg font-semibold text-blue-300 mb-2">{snip.title}</h2>
                     {/* Language Badge */}
                     <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                       {languages.find(l => l.value === snip.language)?.label || snip.language}
                     </span>
                   </div>
                   
                   {/* Action Buttons */}
                   <div className="flex gap-2 ml-2">
                     {/* Copy Button - Changes to checkmark when clicked */}
                     <button 
                       onClick={() => handleCopy(snip.code, snip.id)}
                       className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-3 py-1 rounded transition duration-200"
                       title="Copy to clipboard"
                     >
                       {copiedId === snip.id ? '✓' : '📋'}
                     </button>
                     
                     {/* Delete Button - Shows loading state during deletion */}
                     <button 
                       onClick={() => handleDelete(snip.id)}
                       className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-1 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                       disabled={deletingId === snip.id}
                       title="Delete snippet"
                     >
                       {deletingId === snip.id ? '⏳' : '🗑️'}
                     </button>
                   </div>
                 </div>
              
                 {/* Code Display with Syntax Highlighting */}
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
        </div>
      </div>
    </div>
  )
}

export default App
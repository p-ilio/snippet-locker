import { useEffect, useState } from 'react'
import api from './api'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [snippets, setSnippets] = useState([])
  // 1. Form State
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')

  const fetchSnippets = async () => {
    try {
      const response = await api.get('snippets/')
      setSnippets(response.data)
    } catch (error) {
      console.error("Error fetching snippets:", error)
    }
  }

  useEffect(() => {
    fetchSnippets()
  }, [])

  // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('snippets/', { title, code, language })
      setTitle('')
      setCode('')
      fetchSnippets() // Refresh the list after adding
    } catch (error) {
      alert("Error saving snippet")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Snippet Locker</h1>

        {/* 3. The Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            <input 
              className="bg-gray-700 p-2 rounded outline-none focus:ring-2 ring-blue-500"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea 
              className="bg-gray-700 p-2 rounded h-32 font-mono outline-none focus:ring-2 ring-blue-500"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-black font-bold p-3 rounded-md transition duration-200">
              Save Snippet
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          {snippets.map(snip => (
           <div key={snip.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative group">
             <div className="flex justify-between items-center mb-2">
               <h2 className="text-xl font-semibold text-blue-300">{snip.title}</h2>
               <button 
                  onClick={async () => {
                    if(confirm("Delete this snippet?")) {
                       await api.delete(`snippets/${snip.id}/`)
                      fetchSnippets()
                   }
                  }}
                  className="text-red-500 hover:text-red-400 font-bold px-2 py-1"
                >
                    Delete
               </button>
          </div>
          
          {/* --- SYNTAX HIGHLIGHTER REPLACED THE OLD PRE/CODE TAGS HERE --- */}
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-900 shadow-inner">
            <SyntaxHighlighter 
              language={snip.language ? snip.language.toLowerCase() : 'javascript'} 
              style={atomDark}
              customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', backgroundColor: '#000000' }}
            >
              {snip.code}
            </SyntaxHighlighter>
          </div>

          </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
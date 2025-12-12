import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

function App() {
    const [requirements, setRequirements] = useState([])
    const [formData, setFormData] = useState({
        attribute: '',
        description: '',
        domain: '',
        source_system: '',
        source_entity: '',
        responsible_analyst: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme || 'dark'
    })

    const domains = ['Analytics', 'Reporting', 'ETL', 'Visualization', 'Data Quality', 'Other']

    useEffect(() => {
        fetchRequirements()
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
    }

    const fetchRequirements = async () => {
        try {
            const res = await fetch(`${API_URL}/requirements`)
            const data = await res.json()
            setRequirements(data)
        } catch (error) {
            console.error('Failed to fetch requirements:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/requirements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setFormData({ attribute: '', description: '', domain: '', source_system: '', source_entity: '', responsible_analyst: '' })
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
                fetchRequirements()
            }
        } catch (error) {
            console.error('Failed to submit:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id) => {
        // Only remove from UI, not from database
        setRequirements(requirements.filter(req => req.id !== id))
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <div className="header-row">
                <div className="header-content">
                    <h1>Requirements for data mart</h1>
                    <p className="subtitle">Submit data requirements for analysis</p>
                </div>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    <span className="theme-toggle-icon">
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </span>
                </button>
            </div>

            <div className="main-layout">
                <div className="form-section">
                    <div className="form-card">
                        {success && (
                            <div className="success-message">Requirement submitted successfully!</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="attribute">Attribute</label>
                                <input
                                    type="text"
                                    id="attribute"
                                    name="attribute"
                                    value={formData.attribute}
                                    onChange={handleChange}
                                    placeholder="e.g., customer_id, loan_type"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Attribute description"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="domain">Domain</label>
                                <input
                                    type="text"
                                    id="domain"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    placeholder="e.g., onboarding, collection, telesales"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="source_system">Source System</label>
                                <input
                                    type="text"
                                    id="source_system"
                                    name="source_system"
                                    value={formData.source_system}
                                    onChange={handleChange}
                                    placeholder="e.g., crm, iabs"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="source_entity">Source Entity</label>
                                <input
                                    type="text"
                                    id="source_entity"
                                    name="source_entity"
                                    value={formData.source_entity}
                                    onChange={handleChange}
                                    placeholder="e.g., customers, loans"
                                    required
                                />
                            </div>



                            <div className="form-group">
                                <label htmlFor="responsible_analyst">Responsible Person</label>
                                <input
                                    type="text"
                                    id="responsible_analyst"
                                    name="responsible_analyst"
                                    value={formData.responsible_analyst}
                                    onChange={handleChange}
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Requirement'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="list-section">
                    <div className="requirements-list">
                        <h2 className="requirements-header">
                            Submitted Requirements ({requirements.length})
                        </h2>

                        {requirements.length === 0 ? (
                            <div className="empty-state">No requirements submitted yet</div>
                        ) : (
                            requirements.map(req => (
                                <div key={req.id} className="requirement-item">
                                    <div className="requirement-header">
                                        <div className="requirement-attribute">{req.attribute}</div>
                                        <div className="requirement-datetime">
                                            {new Date(req.created_at).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className="requirement-description">{req.description}</div>
                                    <div className="requirement-meta">
                                        <div className="meta-info">
                                            <span className="domain-badge">{req.domain}</span>
                                            <span className="analyst-badge">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                                {req.responsible_analyst}
                                            </span>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(req.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App

import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

function App() {
    const [requirements, setRequirements] = useState([])
    const [stewardFilter, setStewardFilter] = useState('')
    const [datamartFilter, setDatamartFilter] = useState('')
    const [targetFieldFilter, setTargetFieldFilter] = useState('')

    const FIELDS = [
        { id: 'target_field_name', label: 'Final field name in the target model(ODS/DWD/DWS/MART)' },
        { id: 'description', label: 'Business definition in plain English (what the field represents)', type: 'textarea' },
        { id: 'target_datamart', label: 'Target Datamart' },
        { id: 'target_field_type', label: 'Data type in target layer' },
        { id: 'primary_key', label: 'Primary Key (Y/N)' },
        { id: 'business_key', label: 'Business Key (Y/N)' },
        { id: 'nullable', label: 'Nullable (Y/N)' },
        { id: 'default_value', label: 'Default Value' },
        { id: 'source_field', label: 'Source Field' },
        { id: 'source_object_event', label: 'Source Object / Event' },
        { id: 'source_system_topic', label: 'Source System / Topic' },
        { id: 'source_type', label: 'Source Type (Primary/Secondary)' },
        { id: 'transformation_rules', label: 'Transformation Rules', type: 'textarea' },
        { id: 'is_derived_value', label: 'Is Derived Value (Y/N)' },
        { id: 'derived_value_logic', label: 'Derived Value Logic', type: 'textarea' },
        { id: 'data_quality_rules', label: 'Data Quality Rules', type: 'textarea' },
        { id: 'foreign_key_reference_table', label: 'Foreign Key Reference Table' },
        { id: 'foreign_key_reference_field', label: 'Foreign Key Reference Field' },
        { id: 'pii_flag', label: 'PII Flag (Y/N)' },
        { id: 'sensitivity_level', label: 'Sensitivity Level' },
        { id: 'security_rule', label: 'Security Rule (mask/hash)' },
        { id: 'retention_policy', label: 'Retention Policy' },
        { id: 'archiving_policy', label: 'Archiving Policy' },
        { id: 'source_retention', label: 'Source Retention' },
        { id: 'source_archiving_policy', label: 'Source Archiving Policy' },
        { id: 'data_owner', label: 'Data Owner' },
        { id: 'data_steward', label: 'Data Steward' },
        { id: 'comment_notes', label: 'Comment / Notes', type: 'textarea' },
        { id: 'storage', label: 'Storage (format, partitioning)' },
        { id: 'latency_requirements', label: 'Latency Requirements' },
        { id: 'is_renamed', label: 'Is Renamed' },
        { id: 'sla_datamart_level', label: 'SLA - DataMart level' },
        { id: 'archiving_datamart_level', label: 'Archiving - DataMart level' },
        { id: 'retention_datamart_level', label: 'Retention - DataMart level' }
    ]

    const initialFormData = FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
    const [formData, setFormData] = useState(initialFormData)

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [showAll, setShowAll] = useState(false)
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null })
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme || 'dark'
    })

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
            const url = `${API_URL}/requirements`
            const res = await fetch(url)
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
            const method = editingId ? 'PUT' : 'POST'
            const url = editingId ? `${API_URL}/requirements/${editingId}` : `${API_URL}/requirements`

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setFormData(initialFormData)
                setEditingId(null)
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

    const [expandedReqId, setExpandedReqId] = useState(null)

    const toggleExpand = (id) => {
        setExpandedReqId(expandedReqId === id ? null : id)
    }

    const handleDeleteClick = (e, id) => {
        e.stopPropagation()
        setDeleteModal({ isOpen: true, id })
    }

    const confirmDelete = async () => {
        const id = deleteModal.id
        try {
            const res = await fetch(`${API_URL}/requirements/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setRequirements(requirements.filter(req => req.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete requirement:', error)
        } finally {
            setDeleteModal({ isOpen: false, id: null })
        }
    }

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, id: null })
    }


    const handleEdit = (req) => {
        const editData = {}
        FIELDS.forEach(field => {
            editData[field.id] = req[field.id] || ''
        })
        setFormData(editData)
        setEditingId(req.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setFormData(initialFormData)
        setEditingId(null)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const filteredRequirements = (() => {
        if (!stewardFilter && !datamartFilter && !targetFieldFilter && !showAll) {
            return requirements.length > 0 ? [requirements[0]] : []
        }
        return requirements.filter(req => {
            const steward = req.data_steward?.toLowerCase() || ''
            const datamart = req.target_datamart?.toLowerCase() || ''
            const targetField = req.target_field_name?.toLowerCase() || ''

            const matchSteward = !stewardFilter || steward.includes(stewardFilter.toLowerCase())
            const matchDatamart = !datamartFilter || datamart.includes(datamartFilter.toLowerCase())
            const matchTargetField = !targetFieldFilter || targetField.includes(targetFieldFilter.toLowerCase())

            return matchSteward && matchDatamart && matchTargetField
        })
    })()

    const toggleShowAll = () => setShowAll(!showAll)

    return (
        <div className="container">
            <div className="header-row">
                <div className="header-content">
                    <h1>Requirements for data mart</h1>
                    <p className="subtitle">Submit data requirements for analysis</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

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
            </div>

            <div className="main-layout">
                <div className="form-section">
                    <div className="form-card">
                        {success && (
                            <div className="success-message">Requirement submitted successfully!</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {FIELDS.map(field => (
                                <div className="form-group" key={field.id}>
                                    <label htmlFor={field.id}>{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            placeholder={field.label}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            placeholder={field.label}
                                        />
                                    )}
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" disabled={loading} style={{ flex: 1 }}>
                                    {loading ? (editingId ? 'Updating...' : 'Submitting...') : (editingId ? 'Update Requirement' : 'Submit Requirement')}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="delete-btn"
                                        style={{ flex: 0.3 }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="list-section">
                    <div className="requirements-list">
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h2 className="requirements-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                                        {(stewardFilter || datamartFilter || showAll) ? 'Submitted Requirements' : 'Latest Submission'}
                                    </h2>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {requirements.length > 0 && (
                                        <button
                                            className="btn-action"
                                            onClick={toggleShowAll}
                                        >
                                            {showAll ? 'Show Latest Only' : 'Show All from DB'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {requirements.length > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Filter by Field Name..."
                                        value={targetFieldFilter}
                                        onChange={(e) => setTargetFieldFilter(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter by Data Steward..."
                                        value={stewardFilter}
                                        onChange={(e) => setStewardFilter(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter by Data Mart..."
                                        value={datamartFilter}
                                        onChange={(e) => setDatamartFilter(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {filteredRequirements.length === 0 ? (
                            <div className="empty-state">
                                {(stewardFilter || datamartFilter || targetFieldFilter) ? 'No matching requirements found' : 'No requirements submitted yet'}
                            </div>
                        ) : (
                            filteredRequirements.map(req => (
                                <div
                                    key={req.id}
                                    className="requirement-item"
                                    onClick={() => toggleExpand(req.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="requirement-header">
                                        <div className="requirement-attribute" title="Target Attribute">
                                            {req.target_field_name || 'Untitled Field'}
                                        </div>
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

                                    <div className="requirement-meta" style={{ marginTop: '0.5rem' }}>
                                        <div className="meta-info">
                                            {req.target_datamart && (
                                                <span className="domain-badge" title="Target Datamart">
                                                    Data Mart : {req.target_datamart}
                                                </span>
                                            )}
                                            {req.data_owner && (
                                                <span className="domain-badge" title="Data Owner">
                                                    Data Owner : {req.data_owner}
                                                </span>
                                            )}
                                            {req.data_steward && (
                                                <span className="domain-badge" title="Data Steward">
                                                    Data Steward : {req.data_steward}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-action"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEdit(req)
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => handleDeleteClick(e, req.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {expandedReqId === req.id && (
                                        <div className="requirement-details" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Full Requirement Details</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                                {FIELDS.map(field => {
                                                    const value = req[field.id]
                                                    if (!value) return null
                                                    return (
                                                        <div key={field.id} style={{ marginBottom: '0.5rem' }}>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{field.label}</div>
                                                            <div style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {deleteModal.isOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Delete Requirement</div>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this requirement? This action cannot be undone.
                        </div>
                        <div className="modal-footer">
                            <button className="btn-action" onClick={closeDeleteModal}>
                                Cancel
                            </button>
                            <button className="delete-btn" style={{ background: 'var(--danger)', color: 'white', borderColor: 'var(--danger)' }} onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App

import { useState, useRef } from 'react'
import { MapPin, Check, AlertCircle, Upload, Trophy, Clock, X } from 'lucide-react'
import Confetti from 'react-confetti'
import { API_URL } from '../App'

export default function Phase6({ team, setTeam }) {
    const fileInputRef = useRef(null)
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [finalData, setFinalData] = useState(null)
    const [error, setError] = useState('')
    const [dragOver, setDragOver] = useState(false)

    // Redirect checks
    if (!team) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <AlertCircle size={60} style={{ color: '#FFD700', marginBottom: '20px' }} />
                <h2>Please Register First</h2>
            </div>
        )
    }

    if (team.phase6?.completed || team.currentPhase > 6) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <Confetti colors={['#FFD700', '#FFC107', '#FFEB3B', '#FFFFFF']} numberOfPieces={200} />
                <div className="trophy-icon">🏆</div>
                <h1 style={{ marginBottom: '20px' }}>Congratulations!</h1>
                <h2 style={{ color: '#fff', marginBottom: '30px' }}>You've completed CodeHunt-2026!</h2>
                <div style={{
                    display: 'inline-block',
                    padding: '20px 40px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid #FFD700',
                    borderRadius: '15px',
                    marginTop: '20px'
                }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Orbitron', fontSize: '0.85rem', marginBottom: '8px' }}>
                        📍 FINAL LOCATION
                    </p>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Basketball Court Area</h2>
                </div>
            </div>
        )
    }

    if (team.currentPhase < 6) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <AlertCircle size={60} style={{ color: '#FFD700', marginBottom: '20px' }} />
                <h2>Phase Locked</h2>
                <p>Complete the previous phase first.</p>
            </div>
        )
    }

    const handleFileSelect = (file) => {
        if (!file) return

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Only .jpg, .jpeg, and .png files are allowed')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB')
            return
        }

        setError('')
        setPhoto(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        handleFileSelect(file)
    }

    const handleSubmit = async () => {
        if (!location.trim()) {
            setError('Please enter the location you found')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${API_URL}/phase6/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team.teamId,
                    locationAnswer: location
                })
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Submission failed')
                setLoading(false)
                return
            }

            setFinalData(data)
            setCompleted(true)

            const teamRes = await fetch(`${API_URL}/teams/${team.teamName}`)
            const teamData = await teamRes.json()
            setTeam(teamData)
        } catch (err) {
            setError('Failed to submit. Please try again.')
        }
        setLoading(false)
    }

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs}h ${mins}m ${secs}s`
    }

    if (completed && finalData) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
                <Confetti
                    colors={['#FFD700', '#FFC107', '#FFEB3B', '#FFFFFF']}
                    numberOfPieces={300}
                    recycle={false}
                />

                <div className="trophy-icon">🏆</div>

                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '20px' }}>
                    Congratulations Team {finalData.teamName}!
                </h1>

                <p style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '20px' }}>
                    You have successfully completed <span style={{ color: '#FFD700' }}>CodeHunt-2026</span>!
                </p>

                <div style={{
                    display: 'inline-block',
                    padding: '20px 40px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid #FFD700',
                    borderRadius: '15px',
                    marginBottom: '30px'
                }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Orbitron', fontSize: '0.85rem', marginBottom: '8px' }}>
                        📍 FINAL LOCATION
                    </p>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Basketball Court Area</h2>
                </div>

                <div style={{
                    display: 'inline-block',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '3px solid #FFD700',
                    borderRadius: '20px',
                    padding: '30px 50px',
                    marginBottom: '40px'
                }}>
                    <Clock size={30} style={{ color: '#FFD700', marginBottom: '10px' }} />
                    <p style={{ color: '#FFD700', fontFamily: 'Orbitron', fontSize: '0.9rem', marginBottom: '10px' }}>
                        TOTAL TIME
                    </p>
                    <p style={{ fontSize: '2.5rem', fontFamily: 'Orbitron', color: '#fff', margin: 0 }}>
                        {formatTime(finalData.totalTimeSeconds)}
                    </p>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <p style={{ color: '#b3b3b3', marginBottom: '10px' }}>Team Leader</p>
                    <p style={{ fontSize: '1.3rem', color: '#fff' }}>{finalData.teamLeader}</p>
                </div>

                <div style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    borderRadius: '20px',
                    padding: '30px',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Thank you for participating in CodeHunt-2026! Your journey through AI creation,
                        quizzes, coding challenges, and the campus treasure hunt has been amazing.
                        Check the leaderboard to see your ranking!
                    </p>
                </div>

                <div style={{
                    display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'
                }}>
                </div>

                <div style={{ marginTop: '60px' }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Orbitron' }}>Organized by</p>
                    <h3 style={{ color: '#fff', marginTop: '10px' }}>NextGenAI Club</h3>
                    <p style={{ color: '#b3b3b3' }}>Vishwakarma University</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <MapPin size={50} style={{ color: '#FFD700', marginBottom: '15px' }} />
                <h1>Final Phase: Campus Treasure Hunt!</h1>
                <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                    Solve the riddle, find the location, capture the moment!
                </p>
            </div>

            {/* Final Riddle */}
            <div className="riddle-card" style={{ marginBottom: '40px' }}>
                <div className="riddle-icon">🗺️</div>
                <p className="riddle-text">
                    "Where knowledge is built brick by brick,<br />
                    And NextGenAI's vision stands tall and thick,<br />
                    Find the statue/landmark where wisdom starts,<br />
                    Upload your team photo to win our hearts!"
                </p>
                <p style={{ color: '#FFD700', fontSize: '0.9rem', marginTop: '20px' }}>
                    Hint: Think about where innovation meets education at VU campus
                </p>
            </div>

            {/* Final Task Section */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>
                    <MapPin size={20} style={{ marginRight: '10px' }} />
                    Final Task: Locate & Capture
                </h3>



                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <AlertCircle size={18} style={{ marginRight: '10px', color: '#ef4444' }} />
                        {error}
                    </div>
                )}

                {team.phase1?.driveLink ? (
                    <div style={{
                        padding: '20px',
                        background: 'rgba(66, 133, 244, 0.1)',
                        border: '1px dashed #4285F4',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📂</div>
                        <h4 style={{ color: '#8ab4f8', marginBottom: '10px' }}>
                            Upload to Drive Folder
                        </h4>
                        <p style={{ fontSize: '1rem', marginBottom: '15px', color: '#e0e0e0', lineHeight: '1.5' }}>
                            Upload your team photo at the location directly to your Google Drive folder.
                        </p>
                        <a
                            href={team.phase1.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#4285F4',
                                color: 'white',
                                border: 'none',
                                textDecoration: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            Open Drive Folder <span style={{ fontSize: '1.2em' }}>↗</span>
                        </a>
                    </div>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', border: '1px dashed #666', borderRadius: '8px', marginBottom: '20px' }}>
                        <p>Drive link not found.</p>
                    </div>
                )}
            </div>

            {/* Location Input */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Location Found</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter the location name (e.g., Main Library, Founder's Statue)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            {/* Team Info (Auto-filled) */}
            <div className="card" style={{ marginBottom: '30px', background: 'rgba(255, 215, 0, 0.05)' }}>
                <h4 style={{ marginBottom: '15px', color: '#FFD700' }}>Team Information</h4>
                <p><strong>Team Name:</strong> {team.teamName}</p>
                <p><strong>Team Leader:</strong> {team.teamLeader}</p>
                <p style={{ margin: 0 }}><strong>Members:</strong> {team.teamMembers?.join(', ')}</p>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary btn-large"
                    disabled={loading}
                    style={{ fontSize: '1.2rem', padding: '20px 60px' }}
                >
                    {loading ? 'Submitting...' : '🎉 Submit Final Entry'}
                </button>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Users, Clock, Trophy, Sparkles } from 'lucide-react'
import { API_URL } from '../App'

export default function LandingPage({ team, setTeam }) {
    const navigate = useNavigate()
    const [showResume, setShowResume] = useState(false)
    const [resumeTeamName, setResumeTeamName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleResume = async () => {
        if (!resumeTeamName.trim()) {
            setError('Please enter your team name')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${API_URL}/teams/${resumeTeamName}`)
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Team not found')
                setLoading(false)
                return
            }

            setTeam(data)
            setShowResume(false)
        } catch (err) {
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    return (
        <div className="container">
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                {/* Logo/Title */}
                <div style={{ marginBottom: '40px' }}>
                    <Sparkles size={60} style={{ color: '#FFD700', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '10px' }}>
                        CodeHunt-2026
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: '#FFD700', fontFamily: 'Orbitron' }}>
                        The Ultimate AI Competition
                    </p>
                </div>

                {/* Description */}
                <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 50px', lineHeight: 1.8 }}>
                    Embark on a thrilling 6-phase journey through AI creation, quizzes,
                    coding challenges, and a campus treasure hunt. Are you ready to prove
                    your skills and claim victory?
                </p>

                {/* Phase Preview Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                    <PhaseCard icon={<Sparkles />} num={1} title="AI Video Generation" desc="Create futuristic VU 2050 videos" />
                    <PhaseCard icon={<Trophy />} num={2} title="AI Quiz Challenge" desc="Test your AI fundamentals" />
                    <PhaseCard icon={<Rocket />} num={3} title="Code Output Prediction" desc="Predict what the code outputs" />
                    <PhaseCard icon={<Users />} num={4} title="Debug the Room" desc="Fix bugs to find the room" />
                    <PhaseCard icon={<Clock />} num={5} title="Logic Riddles" desc="Solve AI-themed puzzles" />
                    <PhaseCard icon={<Trophy />} num={6} title="Campus Treasure Hunt" desc="Find the final location!" />
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
                    {!team && (
                        <>
                            <button onClick={() => navigate('/phase1')} className="btn btn-primary btn-large">
                                Register New Team
                            </button>
                            <button onClick={() => setShowResume(!showResume)} className="btn btn-secondary btn-large">
                                Resume Progress
                            </button>
                        </>
                    )}

                    {team && (
                        <>
                            <div style={{ padding: '15px 30px', background: 'rgba(255, 215, 0, 0.1)', border: '2px solid #FFD700', borderRadius: '12px' }}>
                                <p style={{ color: '#FFD700', fontFamily: 'Orbitron', margin: 0 }}>
                                    Team: {team.teamName} — Phase {team.currentPhase}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure? This will clear your current session and let you register a new team.')) {
                                        localStorage.removeItem('codehunt_team');
                                        setTeam(null);
                                        navigate('/phase1');
                                    }
                                }}
                                className="btn btn-secondary btn-large"
                                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            >
                                Start Fresh
                            </button>
                        </>
                    )}
                </div>

                {/* Resume Form */}
                {showResume && !team && (
                    <div className="card" style={{ maxWidth: '400px', margin: '30px auto' }}>
                        <h3 style={{ marginBottom: '20px' }}>Resume Your Progress</h3>
                        <div className="form-group">
                            <label className="form-label">Team Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your team name"
                                value={resumeTeamName}
                                onChange={(e) => setResumeTeamName(e.target.value)}
                            />
                            {error && <p className="form-error">{error}</p>}
                        </div>
                        <button onClick={handleResume} className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Loading...' : 'Resume'}
                        </button>
                    </div>
                )}

                {/* Organizer Info */}
                <div style={{ marginTop: '60px', padding: '30px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '20px', border: '1px solid #333' }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Orbitron', fontSize: '1.1rem', marginBottom: '10px' }}>
                        Organized by
                    </p>
                    <h2 style={{ color: '#fff', marginBottom: '10px' }}>NextGenAI Club</h2>
                    <p style={{ color: '#b3b3b3' }}>Vishwakarma University</p>
                </div>
            </div>
        </div>
    )
}

function PhaseCard({ icon, num, title, desc }) {
    return (
        <div className="card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
                    {icon}
                </div>
                <span style={{ fontFamily: 'Orbitron', color: '#FFD700', fontSize: '0.9rem' }}>Phase {num}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#fff' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{desc}</p>
        </div>
    )
}

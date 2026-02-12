import { Link } from 'react-router-dom'
import { Trophy, Zap, Target, Code, Brain, MapPin } from 'lucide-react'

export default function Layout({ children, team }) {
    return (
        <div className="app">
            <nav className="nav-header">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        CodeHunt-2026
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>

                        {team && <span className="nav-link" style={{ color: '#FFD700' }}>Team: {team.teamName}</span>}
                    </div>
                </div>
            </nav>

            {team && (
                <div className="phase-progress container" style={{ marginTop: '20px' }}>
                    <PhaseIndicator num={1} label="AI Gen" current={team.currentPhase} icon={<Zap size={18} />} />
                    <div className={`phase-connector ${team.currentPhase > 1 ? 'completed' : ''}`} />
                    <PhaseIndicator num={2} label="Quiz" current={team.currentPhase} icon={<Target size={18} />} />
                    <div className={`phase-connector ${team.currentPhase > 2 ? 'completed' : ''}`} />
                    <PhaseIndicator num={3} label="Code" current={team.currentPhase} icon={<Code size={18} />} />
                    <div className={`phase-connector ${team.currentPhase > 3 ? 'completed' : ''}`} />
                    <PhaseIndicator num={4} label="Debug" current={team.currentPhase} icon={<Code size={18} />} />
                    <div className={`phase-connector ${team.currentPhase > 4 ? 'completed' : ''}`} />
                    <PhaseIndicator num={5} label="Logic" current={team.currentPhase} icon={<Brain size={18} />} />
                    <div className={`phase-connector ${team.currentPhase > 5 ? 'completed' : ''}`} />
                    <PhaseIndicator num={6} label="Hunt" current={team.currentPhase} icon={<MapPin size={18} />} />
                </div>
            )}

            <main style={{ minHeight: 'calc(100vh - 200px)', padding: '40px 0' }}>
                {children}
            </main>

            <footer className="footer">
                <div className="footer-logo">
                    <Trophy size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    NextGenAI Club
                </div>
                <p className="footer-text">Organized by NextGenAI Club, Vishwakarma University</p>
                <p className="footer-text" style={{ marginTop: '10px', fontSize: '0.8rem' }}>© 2026 CodeHunt. All rights reserved.</p>
            </footer>
        </div>
    )
}

function PhaseIndicator({ num, current, icon }) {
    const status = num < current ? 'completed' : num === current ? 'current' : 'locked'
    return (
        <div className={`phase-dot ${status}`} title={`Phase ${num}`}>
            {status === 'completed' ? '✓' : num}
        </div>
    )
}

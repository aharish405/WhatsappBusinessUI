import React, { useState } from 'react';
import { 
  Settings, Send, Phone, Key, Menu, X, LayoutDashboard, Terminal, Smartphone,
  CheckCircle2, AlertCircle, Loader2, Bell, Rocket, Zap, Users, BarChart3,
  LogOut, User, CreditCard, ArrowRight
} from 'lucide-react';

interface Config {
  phoneId: string;
  token: string;
}

interface MessageStatus {
  type: 'idle' | 'sending' | 'success' | 'error';
  message?: string;
  response?: string;
}

type ViewState = 'landing' | 'login' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  
  // Dashboard states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'logs'>('preview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [config, setConfig] = useState<Config>({
    phoneId: '1083180068204622',
    token: 'EAAV0VpG2S4wBQZBBrqYDCvRbXpglV8Exd4vCJ0csJZC2dxsHT6FEx6HYVzTwG4t4HVPtAj9frO6C74SvMAMKwhLVXoW4Bc3MjGSUCjZA2hZCyzo4Cf9E1yMs6pVrErfiw76E1Ms86o5q5oI3ivdzbU2v2rFVbPWbl8EdsUCQVPyJxZC3NAMS5ZAlnEwEdDKgZDZD'
  });

  const [toNumber, setToNumber] = useState('919032073072');
  const [messageType, setMessageType] = useState<'text' | 'template'>('text');
  const [templateName, setTemplateName] = useState('hello_world');
  const [templateLang, setTemplateLang] = useState('en');
  const [messageBody, setMessageBody] = useState('Hi ');
  const [status, setStatus] = useState<MessageStatus>({ type: 'idle' });
  const [history, setHistory] = useState<{body: string, time: string}[]>([]);

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setCurrentView('dashboard');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials. Use admin / admin');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.phoneId || !config.token || !toNumber) {
      setStatus({ type: 'error', message: 'Missing phone ID, token or recipient number.' });
      return;
    }
    if (messageType === 'text' && !messageBody) {
      setStatus({ type: 'error', message: 'Message body cannot be empty.' });
      return;
    }
    if (messageType === 'template' && !templateName) {
      setStatus({ type: 'error', message: 'Template name cannot be empty.' });
      return;
    }

    setStatus({ type: 'sending' });
    setActiveTab('logs');

    try {
      const payload: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toNumber,
        type: messageType,
      };

      if (messageType === 'text') {
        payload.text = { preview_url: false, body: messageBody };
      } else {
        payload.template = {
          name: templateName,
          language: { code: templateLang }
        };
      }

      const response = await fetch(`https://graph.facebook.com/v25.0/${config.phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'API Request Successful', response: JSON.stringify(data, null, 2) });
        const now = new Date();
        const sentBody = messageType === 'text' ? messageBody : `[Template: ${templateName}]`;
        setHistory([...history, { body: sentBody, time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        if (messageType === 'text') setMessageBody('');
        setTimeout(() => setActiveTab('preview'), 2000);
      } else {
        setStatus({ type: 'error', message: data.error?.message || 'API Request Failed', response: JSON.stringify(data, null, 2) });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Network error occurred' });
    }
  };

  if (currentView === 'landing') {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)'}}>
            <Rocket size={28} />
            CampaignPro
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => setCurrentView('login')}>
              Login / Sign Up
            </button>
          </div>
        </header>
        <main className="landing-hero">
          <h1 className="landing-title">Supercharge Your WhatsApp Marketing</h1>
          <p className="landing-subtitle">
            Engage your audience with personalized, automated WhatsApp campaigns. 
            Send rich templates, track deliverability in real-time, and scale your outreach effortlessly.
          </p>
          <button className="btn-hero" onClick={() => setCurrentView('login')}>
            Start Your Free Trial <ArrowRight size={20} />
          </button>

          <div className="features-grid">
            <div className="feature-card">
              <Zap size={32} color="var(--primary)" style={{marginBottom: '1rem'}}/>
              <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Lightning Fast Delivery</h3>
              <p style={{color: 'var(--text-muted)'}}>Direct integration with Meta Cloud API ensures your messages are delivered instantly worldwide.</p>
            </div>
            <div className="feature-card">
              <Users size={32} color="var(--primary)" style={{marginBottom: '1rem'}}/>
              <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Targeted Campaigns</h3>
              <p style={{color: 'var(--text-muted)'}}>Bypass the 24-hour rule with approved interactive template messages to re-engage cold leads.</p>
            </div>
            <div className="feature-card">
              <BarChart3 size={32} color="var(--primary)" style={{marginBottom: '1rem'}}/>
              <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Live Network Analytics</h3>
              <p style={{color: 'var(--text-muted)'}}>Debug and monitor raw API responses instantly within our powerful developer-friendly dashboard.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <Rocket size={48} color="var(--primary)" style={{margin: '0 auto 1rem'}}/>
            <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Sign in to CampaignPro</h2>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="userid"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            
            {loginError && (
              <div style={{color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center'}}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              Sign In
            </button>
          </form>
          
          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <button className="icon-btn" style={{margin: '0 auto', fontSize: '0.875rem'}} onClick={() => setCurrentView('landing')}>
              &larr; Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <div style={{ display: 'none' }}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Settings size={24} color="#818cf8" />
            <span>Admin Config</span>
          </div>
          <button className="icon-btn" onClick={() => setIsSidebarOpen(false)} style={{color: '#f8fafc'}}>
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="form-group">
            <label className="form-label">Phone Number ID</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{position: 'absolute', left: '10px', top: '12px', color: '#94a3b8'}} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                value={config.phoneId}
                onChange={(e) => setConfig({...config, phoneId: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">System Access Token</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{position: 'absolute', left: '10px', top: '12px', color: '#94a3b8'}} />
              <textarea
                className="form-input form-textarea"
                style={{ paddingLeft: '2.25rem', height: '180px' }}
                value={config.token}
                onChange={(e) => setConfig({...config, token: e.target.value})}
              />
            </div>
            <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>Keep your token secure. Do not share it.</p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="nav-left">
            {!isSidebarOpen && (
              <button className="icon-btn" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600}}>
              <Rocket size={20} color="var(--primary)"/>
              CampaignPro
            </div>
          </div>
          <div className="nav-right" style={{ position: 'relative' }}>
            <button className="icon-btn"><Bell size={20} /></button>
            
            {/* Profile Trigger */}
            <div 
              style={{
                width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
              }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              AD
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div style={{padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                  <div style={{fontWeight: 600, fontSize: '0.9rem'}}>Admin User</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>admin@campaignpro.io</div>
                </div>
                <button className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                  <User size={16} /> My Profile
                </button>
                <button className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                  <CreditCard size={16} /> Billing
                </button>
                <button className="dropdown-item text-red" onClick={() => {
                  setIsProfileOpen(false);
                  setCurrentView('landing');
                }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">WhatsApp Messaging</h1>
            <p className="page-subtitle">Send targeted WhatsApp messages and monitor API responses.</p>
          </div>

          <div className="dashboard-grid">
            
            {/* Left Column: Form */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title"><LayoutDashboard size={20} color="var(--primary)"/> Compose Message</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSend}>
                  <div className="form-group">
                    <label className="form-label">Recipient Phone Number (with Country Code)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={toNumber}
                      onChange={(e) => setToNumber(e.target.value)}
                      placeholder="e.g. 919032073072"
                    />
                  </div>

                  <div className="form-group">
                     <label className="form-label">Message Format</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input type="radio" checked={messageType === 'text'} onChange={() => setMessageType('text')} />
                         Free-form Text
                       </label>
                       <label className="radio-label">
                         <input type="radio" checked={messageType === 'template'} onChange={() => setMessageType('template')} />
                         Template
                       </label>
                     </div>
                  </div>

                  {messageType === 'template' ? (
                    <div style={{ animation: 'slideUp 0.2s ease' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 2, marginBottom: '0.5rem' }}>
                          <label className="form-label">Template Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="e.g. hello_world"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1, marginBottom: '0.5rem' }}>
                          <label className="form-label">Language</label>
                          <input
                            type="text"
                            className="form-input"
                            value={templateLang}
                            onChange={(e) => setTemplateLang(e.target.value)}
                            placeholder="e.g. en or en_US"
                          />
                        </div>
                      </div>
                      <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                        Bypasses the 24-hour rule. If 'en_US' fails, try 'en'.
                      </p>
                    </div>
                  ) : (
                    <div className="form-group" style={{ animation: 'slideUp 0.2s ease' }}>
                      <label className="form-label">Message Body</label>
                      <textarea
                        className="form-input form-textarea"
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder="Type your message here..."
                      />
                      <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Recipient must have messaged you within the last 24 hours.
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={status.type === 'sending'}>
                      {status.type === 'sending' ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}/> : <Send size={18} />}
                      {status.type === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Output / Logs */}
            <div className="card">
              <div className="tabs">
                <div 
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  <Smartphone size={18} /> Visual Preview
                </div>
                <div 
                  className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  <Terminal size={18} /> Network Logs
                </div>
                
                <div style={{marginLeft: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center'}}>
                  {status.type === 'idle' && <span className="status-badge idle">Ready</span>}
                  {status.type === 'sending' && <span className="status-badge sending"><Loader2 size={12} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}/> Processing</span>}
                  {status.type === 'success' && <span className="status-badge success"><CheckCircle2 size={12} /> Success</span>}
                  {status.type === 'error' && <span className="status-badge error"><AlertCircle size={12} /> Error</span>}
                </div>
              </div>
              
              {activeTab === 'preview' ? (
                <div className="preview-container">
                  {history.map((msg, idx) => (
                    <div key={idx} className="message-bubble">
                      <div className="message-text">{msg.body}</div>
                      <div className="message-time">{msg.time} <CheckCircle2 size={10} style={{display:'inline', color:'#53bdeb'}}/></div>
                    </div>
                  ))}
                  {((messageType === 'text' && messageBody) || (messageType === 'template' && templateName)) && (
                    <div className="message-bubble" style={{opacity: 0.6}}>
                      <div className="message-text">
                        {messageType === 'text' ? messageBody : <i>[Template: {templateName}]</i>}
                      </div>
                      <div className="message-time">Draft</div>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="json-viewer">
                  {status.response ? status.response : '// No requests sent yet.\n// Hit "Send Message" to see network logs here.'}
                </pre>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

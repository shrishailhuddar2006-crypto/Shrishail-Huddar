/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Network, 
  Terminal, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Activity,
  ChevronRight,
  Menu,
  X,
  Cpu,
  Globe,
  Database,
  Search,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---

type Section = 
  | 'intro' 
  | 'role' 
  | 'review' 
  | 'hardening' 
  | 'architecture' 
  | 'monitoring' 
  | 'usecase' 
  | 'proposal' 
  | 'tools' 
  | 'outcome' 
  | 'conclusion';

interface HardeningItem {
  action: string;
  purpose: string;
  priority: 'Critical' | 'High' | 'Medium';
}

// --- Components ---

const SidebarItem = ({ 
  id, 
  label, 
  icon: Icon, 
  active, 
  onClick 
}: { 
  id: Section; 
  label: string; 
  icon: any; 
  active: boolean; 
  onClick: (id: Section) => void 
}) => (
  <button
    onClick={() => onClick(id)}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      active 
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400")} />
    <span>{label}</span>
    {active && (
      <motion.div 
        layoutId="active-indicator"
        className="ml-auto w-1 h-4 bg-emerald-500 rounded-full"
      />
    )}
  </button>
);

const Card = ({ children, className, title, icon: Icon }: { children: React.ReactNode; className?: string; title?: string; icon?: any }) => (
  <div className={cn("bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden", className)}>
    {title && (
      <div className="px-6 py-4 border-bottom border-slate-800 flex items-center gap-3 bg-slate-800/30">
        {Icon && <Icon className="w-5 h-5 text-emerald-400" />}
        <h3 className="font-semibold text-slate-200">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'critical' | 'high' | 'medium' }) => {
  const variants = {
    default: "bg-slate-800 text-slate-300",
    critical: "bg-red-500/10 text-red-400 border border-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

// --- Main Application ---

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [useCaseStep, setUseCaseStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<string[]>([]);
  const [firewallFixed, setFirewallFixed] = useState(false);

  const hardeningChecklist: HardeningItem[] = [
    { action: "Enable Firewall", purpose: "Blocks unauthorized incoming/outgoing traffic.", priority: "Critical" },
    { action: "Disable Root Login", purpose: "Prevents direct administrative access via SSH.", priority: "Critical" },
    { action: "Install Security Patches", purpose: "Fixes known vulnerabilities in OS and software.", priority: "Critical" },
    { action: "Enforce Strong Password Policies", purpose: "Mitigates brute-force and dictionary attacks.", priority: "High" },
    { action: "Enable System Logging", purpose: "Provides audit trails for forensic analysis.", priority: "High" },
    { action: "Disable Unused Services", purpose: "Reduces the attack surface of the system.", priority: "High" },
    { action: "MFA for Remote Access", purpose: "Adds a second layer of identity verification.", priority: "High" },
    { action: "File System Integrity Monitoring", purpose: "Detects unauthorized changes to critical files.", priority: "Medium" },
    { action: "Configure Automatic Updates", purpose: "Ensures systems are always patched against new threats.", priority: "Medium" },
    { action: "Restrict Sudo Access", purpose: "Limits administrative power to specific trusted users.", priority: "Medium" },
  ];

  const handleRunScan = () => {
    setIsScanning(true);
    setScanResults([]);
    setTimeout(() => {
      if (firewallFixed) {
        setScanResults([
          "Starting Nmap 7.92...",
          "Nmap scan report for server.internal (192.168.1.50)",
          "Host is up (0.00042s latency).",
          "Not shown: 998 closed ports",
          "PORT     STATE SERVICE",
          "22/tcp   open  ssh",
          "443/tcp  open  https",
          "Nmap done: 1 IP address (1 host up) scanned in 1.2s"
        ]);
      } else {
        setScanResults([
          "Starting Nmap 7.92...",
          "Nmap scan report for server.internal (192.168.1.50)",
          "Host is up (0.00031s latency).",
          "Not shown: 990 closed ports",
          "PORT     STATE SERVICE",
          "21/tcp   open  ftp",
          "22/tcp   open  ssh",
          "23/tcp   open  telnet",
          "80/tcp   open  http",
          "443/tcp  open  https",
          "3306/tcp open  mysql",
          "WARNING: Host seems highly exposed!",
          "Nmap done: 1 IP address (1 host up) scanned in 2.1s"
        ]);
      }
      setIsScanning(false);
      if (useCaseStep === 0) setUseCaseStep(1);
      if (useCaseStep === 4) setUseCaseStep(5);
    }, 2000);
  };

  const applyFirewallFix = () => {
    setFirewallFixed(true);
    setUseCaseStep(4);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover"
                alt="Cybersecurity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex items-end p-8">
                <div>
                  <Badge variant="high">Strategic Framework</Badge>
                  <h1 className="text-4xl font-bold text-white mt-2">Secure Network Monitoring & System Hardening</h1>
                  <p className="text-slate-300 mt-2 max-w-2xl">A comprehensive approach to protecting organizational assets through proactive defense and continuous monitoring.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-columns-2 gap-6">
              <Card title="The Importance of Cybersecurity" icon={Shield}>
                <p className="text-slate-400 leading-relaxed">
                  In today's digital landscape, cybersecurity is the bedrock of organizational resilience. It protects critical systems, networks, and sensitive data from theft, damage, or disruption. For small organizations, a single breach can be catastrophic, leading to financial loss, reputational damage, and legal liabilities.
                </p>
              </Card>
              <Card title="The Role of a Security Engineer" icon={Terminal}>
                <p className="text-slate-400 leading-relaxed">
                  Security Engineers are the architects of defense. They don't just react to threats; they build systems that prevent them. Their role involves a mix of technical implementation, policy design, and constant vigilance to maintain a robust security posture against evolving cyber threats.
                </p>
              </Card>
            </div>
          </motion.div>
        );

      case 'role':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Job Role: Security Engineer Intern</h2>
            <p className="text-slate-400">As an intern, the focus is on learning the practical application of security principles in a real-world environment.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Configuration Review", desc: "Analyzing security settings on servers, firewalls, and applications.", icon: Search },
                { title: "Vulnerability ID", desc: "Using scanning tools to find weaknesses before attackers do.", icon: AlertTriangle },
                { title: "Control Implementation", desc: "Deploying firewalls, IDS, and access controls.", icon: Lock },
                { title: "Architecture Design", desc: "Assisting in creating segmented network zones (DMZs).", icon: Network },
                { title: "Log Monitoring", desc: "Reviewing system logs to detect suspicious patterns.", icon: Eye },
                { title: "Incident Response", desc: "Learning how to contain and remediate security incidents.", icon: Activity },
              ].map((item, i) => (
                <Card key={i} className="hover:border-emerald-500/50 transition-colors">
                  <item.icon className="w-8 h-8 text-emerald-500 mb-4" />
                  <h4 className="font-bold text-slate-200 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Security Control Review</h2>
            <p className="text-slate-400">Identifying common misconfigurations that leave organizations vulnerable.</p>
            
            <div className="space-y-4">
              {[
                { 
                  issue: "Permissive Firewall Rules", 
                  risk: "Allows attackers to scan and exploit any service running on the internal network.", 
                  fix: "Implement 'Default Deny' and only allow specific ports from trusted sources.",
                  icon: ShieldCheck
                },
                { 
                  issue: "Excessive User Privileges", 
                  risk: "If a standard user account is compromised, the attacker gains administrative control.", 
                  fix: "Apply the Principle of Least Privilege (PoLP). Use sudo for admin tasks.",
                  icon: Lock
                },
                { 
                  issue: "Open Unused Ports", 
                  risk: "Each open port is a potential entry point for an exploit (e.g., old versions of SMB or Telnet).", 
                  fix: "Regularly audit services and shut down anything not strictly required for business.",
                  icon: Server
                }
              ].map((item, i) => (
                <Card key={i} className="border-l-4 border-l-emerald-500">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <item.icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-200">{item.issue}</h4>
                      <p className="text-red-400 text-sm mt-1 font-medium">Risk: {item.risk}</p>
                      <p className="text-emerald-400 text-sm mt-2">Best Practice: {item.fix}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 'hardening':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">System Hardening Checklist</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {hardeningChecklist.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <Badge variant={item.priority.toLowerCase() as any}>{item.priority}</Badge>
                      </td>
                      <td className="p-4 font-medium text-slate-200">{item.action}</td>
                      <td className="p-4 text-sm text-slate-500">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      case 'architecture':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Secure Network Architecture</h2>
            <Card className="bg-slate-950 p-12 flex flex-col items-center justify-center">
              <div className="w-full max-w-3xl space-y-8">
                {/* Simplified Diagram */}
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-blue-500/20 border border-blue-500/40 rounded-full">
                    <Globe className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="text-blue-400 font-mono text-xs uppercase tracking-widest">The Internet</div>
                  <div className="h-8 w-px bg-slate-700" />
                </div>

                <div className="relative p-6 border-2 border-red-500/40 bg-red-500/5 rounded-2xl flex items-center justify-center gap-4">
                  <Shield className="w-8 h-8 text-red-500" />
                  <div className="text-center">
                    <div className="font-bold text-slate-200">Next-Gen Firewall</div>
                    <div className="text-[10px] text-red-400 font-mono">IDS/IPS INTEGRATED</div>
                  </div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="p-6 border border-orange-500/40 bg-orange-500/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-orange-400">
                      <Server className="w-5 h-5" />
                      <span className="font-bold text-xs uppercase">DMZ Zone</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">Web Server</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">Email Relay</div>
                    </div>
                  </div>

                  <div className="p-6 border border-emerald-500/40 bg-emerald-500/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Database className="w-5 h-5" />
                      <span className="font-bold text-xs uppercase">Internal Network</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">Active Directory</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">File Server</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">Workstations</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="Defense in Depth">
                <p className="text-sm text-slate-400">By placing public-facing services in a DMZ, we ensure that a compromise of the web server doesn't grant immediate access to internal databases or user workstations.</p>
              </Card>
              <Card title="Monitoring Placement">
                <p className="text-sm text-slate-400">IDS/IPS sensors are placed at the network perimeter and between zones to detect lateral movement and external attacks in real-time.</p>
              </Card>
            </div>
          </motion.div>
        );

      case 'monitoring':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Security Monitoring Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Wireshark", role: "Packet Analysis", desc: "Deep dive into network traffic to identify malformed packets or data exfiltration.", icon: Activity },
                { name: "Nmap", role: "Network Discovery", desc: "Scanning for open ports and identifying running services and OS versions.", icon: Search },
                { name: "Snort IDS", role: "Intrusion Detection", desc: "Signature-based detection of known attack patterns like SQL injection or DoS.", icon: AlertTriangle },
                { name: "iptables / nftables", role: "Host Firewall", desc: "Controlling traffic at the kernel level on Linux systems.", icon: Shield },
              ].map((tool, i) => (
                <Card key={i} className="flex gap-4">
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <tool.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{tool.name}</h4>
                    <p className="text-xs text-emerald-500 font-mono mb-2">{tool.role}</p>
                    <p className="text-sm text-slate-500">{tool.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 'usecase':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Use Case: Firewall Remediation</h2>
              <button 
                onClick={() => {
                  setUseCaseStep(0);
                  setFirewallFixed(false);
                  setScanResults([]);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Reset Scenario
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-black border-slate-800 font-mono text-sm min-h-[400px] flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Security Terminal</span>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    {scanResults.length === 0 && !isScanning && (
                      <div className="text-slate-600 italic">Waiting for command...</div>
                    )}
                    {isScanning && (
                      <div className="flex items-center gap-2 text-emerald-500">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Activity className="w-4 h-4" />
                        </motion.div>
                        <span>Running Nmap stealth scan...</span>
                      </div>
                    )}
                    {scanResults.map((line, i) => (
                      <div key={i} className={cn(
                        "mb-1",
                        line.includes("open") ? "text-emerald-400" : 
                        line.includes("WARNING") ? "text-red-400 font-bold" : "text-slate-400"
                      )}>
                        {line}
                      </div>
                    ))}
                    {firewallFixed && useCaseStep >= 4 && (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                        [SYSTEM] Firewall rules updated successfully.
                        <br />
                        [SYSTEM] Policy: DROP all except SSH from Trusted IP.
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card title="Action Panel" icon={Zap}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 uppercase font-bold">Step 1: Discovery</p>
                      <button 
                        disabled={isScanning}
                        onClick={handleRunScan}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Search className="w-4 h-4" /> Run Nmap Scan
                      </button>
                    </div>

                    <AnimatePresence>
                      {useCaseStep >= 1 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-4 border-t border-slate-800">
                          <p className="text-xs text-slate-500 uppercase font-bold">Step 2: Remediation</p>
                          <div className="p-3 bg-slate-950 rounded border border-slate-800 mb-2">
                            <code className="text-[10px] text-slate-400"># Current Rule</code>
                            <div className="text-red-400 text-xs font-mono">ALLOW 0.0.0.0/0 ANY</div>
                          </div>
                          <button 
                            disabled={firewallFixed}
                            onClick={applyFirewallFix}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" /> Apply Hardened Rules
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {useCaseStep >= 4 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-4 border-t border-slate-800">
                          <p className="text-xs text-slate-500 uppercase font-bold">Step 3: Verification</p>
                          <button 
                            onClick={handleRunScan}
                            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Verify Fix
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>

                {useCaseStep === 5 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Card className="bg-emerald-500/10 border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-bold">Success!</span>
                      </div>
                      <p className="text-xs text-slate-400">The attack surface has been reduced by 80%. Only critical services are now reachable from authorized management IPs.</p>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'proposal':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Security Improvement Proposal</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Multi-Factor Auth", 
                  desc: "Implement MFA across all external-facing services and administrative accounts to prevent credential theft.",
                  impact: "High",
                  icon: Lock
                },
                { 
                  title: "Continuous Scanning", 
                  desc: "Automate weekly vulnerability scans using OpenVAS or Nessus to catch new CVEs as they are released.",
                  impact: "Medium",
                  icon: Search
                },
                { 
                  title: "Centralized Logging", 
                  desc: "Deploy an ELK stack or Graylog to aggregate logs from all servers for real-time alerting and correlation.",
                  impact: "High",
                  icon: Database
                }
              ].map((item, i) => (
                <Card key={i} className="flex flex-col">
                  <div className="mb-4 p-3 bg-emerald-500/10 w-fit rounded-xl">
                    <item.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-slate-200 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 flex-1">{item.desc}</p>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Impact</span>
                    <Badge variant={item.impact.toLowerCase() as any}>{item.impact}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 'tools':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Tools & Technologies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Linux (Ubuntu/Debian)", type: "Operating System" },
                { name: "Nmap", type: "Reconnaissance" },
                { name: "Wireshark", type: "Packet Analysis" },
                { name: "Snort", type: "Network IDS" },
                { name: "iptables", type: "Firewalling" },
                { name: "OpenSSH", type: "Secure Access" },
                { name: "Fail2Ban", type: "Intrusion Prevention" },
                { name: "GnuPG", type: "Encryption" },
              ].map((tool, i) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <div className="text-slate-200 font-bold text-sm">{tool.name}</div>
                  <div className="text-[10px] text-emerald-500 uppercase tracking-tighter mt-1">{tool.type}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'outcome':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Expected Outcome</h2>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-full">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">Enhanced Security Posture</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    By implementing this framework, organizations can expect a significant reduction in their attack surface. The combination of system hardening and continuous monitoring ensures that vulnerabilities are identified and remediated before they can be exploited.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "80% reduction in unauthorized access attempts",
                      "Real-time detection of network anomalies",
                      "Standardized hardening across all server assets",
                      "Clear audit trails for compliance requirements"
                    ].map((li, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-emerald-500" /> {li}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-64 h-64 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl"
                  />
                  <div className="text-center z-10">
                    <div className="text-5xl font-bold text-emerald-500">95%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Risk Mitigation</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 'conclusion':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center space-y-8 py-12">
            <div className="inline-block p-4 bg-emerald-500/10 rounded-full mb-4">
              <ShieldCheck className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-bold text-white">Conclusion</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              This project demonstrates that robust cybersecurity is not just about expensive tools, but about <strong>rigorous processes</strong> and <strong>proactive engineering</strong>.
            </p>
            <div className="text-slate-500 text-left space-y-4 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
              <p>
                Reviewing security controls, implementing system hardening, and designing secure network architectures are the fundamental pillars of defense. As a Security Engineer Intern, mastering these areas provides the foundation for a career dedicated to protecting the digital world.
              </p>
              <p>
                Through the practical application of tools like Nmap and iptables, we've shown how simple misconfigurations can be detected and fixed, drastically improving an organization's resilience against cyber threats.
              </p>
            </div>
            <button 
              onClick={() => setActiveSection('intro')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all hover:scale-105"
            >
              Return to Start
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-500" />
          <span className="font-bold tracking-tight">CYBERGUARD</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
          !isSidebarOpen && "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-800">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-bold text-lg tracking-tight">CYBERGUARD</span>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Project Overview</div>
              <SidebarItem id="intro" label="Introduction" icon={FileText} active={activeSection === 'intro'} onClick={setActiveSection} />
              <SidebarItem id="role" label="Intern Role" icon={Terminal} active={activeSection === 'role'} onClick={setActiveSection} />
              
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mt-6 mb-2">Technical Framework</div>
              <SidebarItem id="review" label="Control Review" icon={ShieldCheck} active={activeSection === 'review'} onClick={setActiveSection} />
              <SidebarItem id="hardening" label="System Hardening" icon={Lock} active={activeSection === 'hardening'} onClick={setActiveSection} />
              <SidebarItem id="architecture" label="Network Architecture" icon={Network} active={activeSection === 'architecture'} onClick={setActiveSection} />
              <SidebarItem id="monitoring" label="Security Monitoring" icon={Eye} active={activeSection === 'monitoring'} onClick={setActiveSection} />
              
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mt-6 mb-2">Implementation</div>
              <SidebarItem id="usecase" label="Live Use Case" icon={Zap} active={activeSection === 'usecase'} onClick={setActiveSection} />
              <SidebarItem id="proposal" label="Improvement Plan" icon={ArrowRight} active={activeSection === 'proposal'} onClick={setActiveSection} />
              <SidebarItem id="tools" label="Tech Stack" icon={Cpu} active={activeSection === 'tools'} onClick={setActiveSection} />
              
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mt-6 mb-2">Summary</div>
              <SidebarItem id="outcome" label="Expected Outcome" icon={CheckCircle2} active={activeSection === 'outcome'} onClick={setActiveSection} />
              <SidebarItem id="conclusion" label="Conclusion" icon={Shield} active={activeSection === 'conclusion'} onClick={setActiveSection} />
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">SI</div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Security Intern</div>
                    <div className="text-[10px] text-slate-500">Level 1 Access</div>
                  </div>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-3/4" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Project Progress: 75%</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto h-screen">
          <div className="max-w-5xl mx-auto p-6 lg:p-12">
            <AnimatePresence mode="wait">
              <div key={activeSection}>
                {renderSection()}
              </div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <footer className="max-w-5xl mx-auto p-6 lg:px-12 border-t border-slate-900 text-slate-600 text-xs flex flex-col md:flex-row justify-between gap-4">
            <div>© 2026 CyberGuard Framework • Internship Project Report</div>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

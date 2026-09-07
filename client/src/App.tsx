import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { trpc } from "./lib/trpc";
import {
  ArrowRight, BarChart3, BookOpen, Bot, BriefcaseBusiness, CalendarDays, Check, ChevronRight, Code2, Copy,
  Download, FileText, History as HistoryIcon, Image as ImageIcon, LayoutDashboard, Library, Lightbulb, LogOut,
  Menu, Moon, PenLine, Plus, Rocket, Search, Settings, Sparkles, Sun, Target, Trash2, UserCircle, WandSparkles,
  Workflow, X, Zap,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Route, Switch, useLocation } from "wouter";

const featureCards = [
  { icon: FileText, title: "AI Text Generator", copy: "Create professional travel content instantly." },
  { icon: ImageIcon, title: "AI Image Generator", copy: "Turn travel ideas into engaging visuals." },
  { icon: Code2, title: "AI Code Generator", copy: "Generate website and marketing code using AI." },
  { icon: WandSparkles, title: "Prompt Optimizer", copy: "Transform simple prompts into powerful AI instructions." },
  { icon: Library, title: "Prompt Library", copy: "Save and reuse your best prompts." },
  { icon: Workflow, title: "Campaign Automation", copy: "Generate complete multi-day travel campaigns." },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "text", label: "Text Generator", icon: FileText },
  { id: "image", label: "Image Generator", icon: ImageIcon },
  { id: "code", label: "Code Generator", icon: Code2 },
  { id: "optimizer", label: "Prompt Optimizer", icon: WandSparkles },
  { id: "prompts", label: "Prompt Library", icon: Library },
  { id: "campaign", label: "Campaign Generator", icon: Workflow },
  { id: "history", label: "Generation History", icon: HistoryIcon },
];

const demoPrompts = [
  { title: "Cape Town Instagram Launch", category: "Social Media", description: "A strong launch caption for a destination campaign.", text: "Create an engaging Instagram caption promoting [DESTINATION] to [TARGET AUDIENCE]. Highlight three unique experiences, use an inspirational tone, include relevant hashtags and finish with a strong call-to-action.", used: 12 },
  { title: "Destination Guide Framework", category: "Blogging", description: "A reliable brief for long-form travel guides.", text: "Write a detailed travel guide about [DESTINATION] for [TARGET AUDIENCE]. Include things to do, places to visit, food experiences, travel tips and a suggested itinerary.", used: 8 },
  { title: "Travel Package Card", category: "Travel Code", description: "A reusable UI code brief for tour packages.", text: "Create a responsive React travel package card for [DESTINATION]. Include destination name, duration, price, description, image and a Book Now button.", used: 5 },
];

function Logo() {
  return <div className="brand-lockup"><div className="brand-mark">T</div><div className="brand-name">TravelContent <span>AI</span></div></div>;
}

function Landing() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const goWorkspace = () => setLocation("/workspace");
  return (
    <div className="landing-shell">
      <nav className="landing-nav">
        <Logo />
        <div className="nav-links">
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</button>
          <button onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}>How it works</button>
          <button onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button className="btn btn-primary btn-sm" onClick={goWorkspace}>Start creating <ArrowRight size={15} /></button>
        </div>
      </nav>
      <main>
        <section className="hero-wrap">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />Built for travel marketers</div>
            <h1 className="hero-title">Create amazing <em>travel content</em> with AI.</h1>
            <p className="hero-subtitle">Generate travel blogs, social media campaigns, emails, destination descriptions, promotional images and code in seconds.</p>
            <div className="cta-row">
              <button className="btn btn-primary" onClick={goWorkspace}>Start creating <ArrowRight size={17} /></button>
              <button className="btn btn-ghost" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore features</button>
            </div>
            <p className="toast-note"><Sparkles size={14} style={{ verticalAlign: "-2px" }} /> One idea in. A complete campaign out.</p>
          </div>
          <div className="hero-art" aria-label="TravelContent AI transforming a travel idea into content formats">
            <div className="travel-scene"><div className="sun-disc" /><div className="mountain" /><div className="mountain two" /><div className="sea-line" /><div className="palm" /><div className="ai-float"><h4><Bot size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />AI workspace</h4><div className="ai-chip"><FileText size={14} /><b>Blog article</b><Check size={14} style={{ marginLeft: "auto" }} /></div><div className="ai-chip"><ImageIcon size={14} /><b>Hero image</b><Check size={14} style={{ marginLeft: "auto" }} /></div><div className="ai-chip"><Workflow size={14} /><b>7-day campaign</b><Check size={14} style={{ marginLeft: "auto" }} /></div></div></div>
          </div>
        </section>
        <section className="section" id="features">
          <div className="section-head"><div><div className="section-kicker">A creative engine for tourism</div><h2 className="section-title">Everything you need to move faster.</h2></div><p className="section-copy">From your first idea to a finished campaign, keep strategy, prompts and outputs in one calm workspace.</p></div>
          <div className="feature-grid">{featureCards.map(({ icon: Icon, title, copy }) => <div className="feature-tile" key={title}><div className="feature-icon"><Icon size={20} /></div><h3>{title}</h3><p>{copy}</p></div>)}</div>
        </section>
        <section className="section" id="workflow"><div className="workflow"><div><div className="section-kicker">How TravelContent AI works</div><h2 className="section-title">From a spark to something worth sharing.</h2><p>Keep every step visible: choose a generator, sharpen your brief, review the output, then save the best version for reuse.</p><button className="btn btn-sun" onClick={goWorkspace}>Open the workspace <ChevronRight size={16} /></button></div><div className="workflow-steps">{["Choose a generator", "Enter your idea", "Optimize your prompt", "Generate content", "Refine & regenerate", "Save & reuse"].map((step, i) => <div className="workflow-step" key={step}><b>0{i + 1}</b><span>{step}</span></div>)}</div></div></section>
        <section className="section" style={{ paddingTop: 14, paddingBottom: 76 }}><div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap", background: "var(--mint)" }}><div><div className="section-kicker">Ready when you are</div><h2 className="section-title" style={{ fontSize: 30 }}>Start creating travel content today.</h2></div><button className="btn btn-primary" onClick={goWorkspace}>Enter TravelContent AI <Rocket size={16} /></button></div></section>
      </main>
      <footer className="footer"><span>© 2026 TravelContent AI</span><span>Create. Inspire. Travel. Powered by AI.</span></footer>
    </div>
  );
}

function Sidebar({ active, onNavigate, open, onClose, onLogout }: { active: string; onNavigate: (id: string) => void; open: boolean; onClose: () => void; onLogout: () => void }) {
  return <aside className={`sidebar ${open ? "open" : ""}`}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Logo /><button className="icon-btn mobile-menu" onClick={onClose}><X size={17} /></button></div><div className="side-label">Workspace</div><nav className="side-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`side-link ${active === id ? "active" : ""}`} onClick={() => { onNavigate(id); onClose(); }}><Icon size={17} />{label}</button>)}</nav><div className="side-label">Account</div><nav className="side-nav"><button className={`side-link ${active === "profile" ? "active" : ""}`} onClick={() => { onNavigate("profile"); onClose(); }}><UserCircle size={17} />Profile</button><button className={`side-link ${active === "settings" ? "active" : ""}`} onClick={() => { onNavigate("settings"); onClose(); }}><Settings size={17} />Settings</button></nav><div className="sidebar-bottom"><button className="side-link" onClick={onLogout}><LogOut size={17} />Logout</button></div></aside>;
}

function Topbar({ onMenu, onTheme, theme, user, onProfile }: { onMenu: () => void; onTheme: () => void; theme: string; user: any; onProfile: () => void }) {
  const initials = (user?.name ?? "Demo User").split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
  return <header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={onMenu}><Menu size={18} /></button><div className="search-wrap"><Search size={16} /><input className="search" placeholder="Search workspace..." /></div></div><div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: 10 }}><button className="icon-btn" onClick={onTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button><button className="avatar" onClick={onProfile} aria-label="Open profile">{initials}</button></div></header>;
}

function PageHeader({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-head"><div>{eyebrow && <div className="section-kicker">{eyebrow}</div>}<h1 className="page-title">{title}</h1><p className="page-subtitle">{copy}</p></div>{action}</div>;
}

function Dashboard({ onNavigate, stats }: { onNavigate: (id: string) => void; stats: any }) {
  const cards = [{ id: "text", icon: FileText, title: "Text Generator", copy: "Blogs, destination guides, social captions, emails and itineraries." }, { id: "image", icon: ImageIcon, title: "Image Generator", copy: "Tourism advertisements, hotel visuals and destination hero images." }, { id: "code", icon: Code2, title: "Code Generator", copy: "Responsive landing pages, booking cards and newsletters." }];
  const metrics = [{ label: "Total Generations", value: stats?.totalGenerations ?? 128, icon: BarChart3 }, { label: "Text Generated", value: stats?.textGenerated ?? 84, icon: FileText }, { label: "Images Generated", value: stats?.imagesGenerated ?? 41, icon: ImageIcon }, { label: "Saved Prompts", value: stats?.savedPrompts ?? 34, icon: Library }];
  return <><PageHeader eyebrow="Your creative cockpit" title="Welcome back, creator." copy="What would you like to create today?" action={<button className="btn btn-primary" onClick={() => onNavigate("text")}><Plus size={17} /> New generation</button>} /><div className="stat-grid">{metrics.map(({ label, value, icon: Icon }) => <div className="stat-card" key={label}><div className="stat-icon"><Icon size={18} /></div><strong>{value}</strong><span>{label}</span></div>)}</div><div className="content-grid">{cards.map(({ id, icon: Icon, title, copy }) => <div className="generator-card" key={id}><div className="card-icon"><Icon size={22} /></div><h3>{title}</h3><p>{copy}</p><button className="btn btn-ghost btn-sm" onClick={() => onNavigate(id)}>Open generator <ArrowRight size={14} /></button></div>)}</div><div className="panel" style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}><div><div className="section-kicker">Suggested next step</div><h3 style={{ fontFamily: "Manrope", margin: "7px 0" }}>Turn “Cape Town luxury tour” into a 7-day campaign.</h3><p className="page-subtitle">Start with the prompt optimizer, then reuse the improved brief across every channel.</p></div><button className="btn btn-sun" onClick={() => onNavigate("optimizer")}>Optimize a prompt <WandSparkles size={16} /></button></div></>;
}

function GeneratorPage({ kind, user, onSignIn, onSavePrompt }: { kind: "text" | "image" | "code"; user: any; onSignIn: () => void; onSavePrompt: (prompt: string) => void }) {
  const [contentType, setContentType] = useState("Blog Article");
  const [destination, setDestination] = useState("Cape Town, South Africa");
  const [audience, setAudience] = useState("International Tourists");
  const [tone, setTone] = useState("Inspirational");
  const [length, setLength] = useState("Medium");
  const [platform, setPlatform] = useState("Website");
  const [instructions, setInstructions] = useState("Highlight local attractions, food, culture and adventure activities.");
  const [imageType, setImageType] = useState("Tourism Advertisement");
  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState("Landscape");
  const [language, setLanguage] = useState("React");
  const [component, setComponent] = useState("Travel Package Card");
  const [output, setOutput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const textMutation = trpc.content.generateText.useMutation({ onSuccess: (data) => { setOutput(data.output); toast.success("Travel content generated"); }, onError: () => toast.error("Sign in to generate content") });
  const imageMutation = trpc.content.generateImage.useMutation({ onSuccess: (data) => { setImageUrl(data.url); toast.success("Travel image generated"); }, onError: () => toast.error("Sign in to generate images") });
  const codeMutation = trpc.content.generateCode.useMutation({ onSuccess: (data) => { setOutput(data.output); toast.success("Code generated"); }, onError: () => toast.error("Sign in to generate code") });
  const isPending = textMutation.isPending || imageMutation.isPending || codeMutation.isPending;
  const generate = () => {
    if (!user) { onSignIn(); return; }
    if (kind === "text") textMutation.mutate({ contentType, destination, audience, tone, length, platform, instructions });
    if (kind === "image") imageMutation.mutate({ destination, imageType, style, ratio, prompt: instructions });
    if (kind === "code") codeMutation.mutate({ language, component, prompt: instructions });
  };
  const title = kind === "text" ? "AI Travel Text Generator" : kind === "image" ? "AI Travel Image Generator" : "AI Travel Code Generator";
  const copy = kind === "text" ? "Shape a useful brief, then generate content ready for a travel channel." : kind === "image" ? "Create premium visuals for destinations, hotels, tours and social campaigns." : "Describe a component and get clean, responsive code you can preview and reuse.";
  return <><PageHeader eyebrow="Create" title={title} copy={copy} action={<span className="badge"><Zap size={13} /> AI-powered</span>} /><div className="generator-layout"><div className="panel"><div className="form-grid">{kind === "text" && <><Field label="Content type"><select value={contentType} onChange={e => setContentType(e.target.value)}>{["Blog Article", "Destination Guide", "Social Media Post", "Instagram Caption", "Facebook Post", "TikTok Script", "Travel Advertisement", "Email", "WhatsApp Marketing Message", "Tour Description", "Hotel Description", "Travel Itinerary", "SEO Website Content"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Target audience"><select value={audience} onChange={e => setAudience(e.target.value)}>{["Families", "Couples", "Solo Travellers", "Adventure Travellers", "Luxury Travellers", "International Tourists", "Budget Travellers", "Business Travellers"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Tone"><select value={tone} onChange={e => setTone(e.target.value)}>{["Professional", "Friendly", "Exciting", "Luxury", "Inspirational", "Casual", "Persuasive", "Adventurous"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Content length"><select value={length} onChange={e => setLength(e.target.value)}>{["Short", "Medium", "Long"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Platform"><select value={platform} onChange={e => setPlatform(e.target.value)}>{["Website", "Instagram", "Facebook", "TikTok", "Email", "WhatsApp", "Blog"].map(v => <option key={v}>{v}</option>)}</select></Field></>}{kind === "image" && <><Field label="Image type"><select value={imageType} onChange={e => setImageType(e.target.value)}>{["Tourism Advertisement", "Social Media Post", "Destination Hero Image", "Hotel Advertisement", "Adventure Travel", "Luxury Travel", "Beach Holiday", "Cultural Tourism", "Food Tourism", "Nature & Wildlife"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Visual style"><select value={style} onChange={e => setStyle(e.target.value)}>{["Photorealistic", "Cinematic", "Luxury", "Editorial", "Minimalist", "Vibrant", "Modern Travel Advertisement"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Aspect ratio"><select value={ratio} onChange={e => setRatio(e.target.value)}>{["Square", "Portrait", "Landscape", "16:9"].map(v => <option key={v}>{v}</option>)}</select></Field></>}{kind === "code" && <><Field label="Programming language"><select value={language} onChange={e => setLanguage(e.target.value)}>{["HTML", "CSS", "JavaScript", "TypeScript", "React", "Python"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Component type"><select value={component} onChange={e => setComponent(e.target.value)}>{["Landing Page", "Destination Card", "Travel Package Card", "Pricing Card", "Booking Form", "Navigation Bar", "Hero Section", "Newsletter", "Contact Form", "FAQ Section", "Responsive Gallery"].map(v => <option key={v}>{v}</option>)}</select></Field></>}<Field label="Destination" full={kind !== "code"}><input value={destination} onChange={e => setDestination(e.target.value)} /></Field><Field label={kind === "text" ? "Additional instructions" : "Prompt"} full><textarea value={instructions} onChange={e => setInstructions(e.target.value)} /></Field></div><div className="cta-row" style={{ marginTop: 18 }}><button className="btn btn-primary" onClick={generate} disabled={isPending}>{isPending ? "Creating..." : kind === "image" ? "Create image" : kind === "code" ? "Generate code" : "Generate content"} <ArrowRight size={15} /></button><button className="btn btn-ghost btn-sm" onClick={() => setInstructions("")}>Clear</button></div>{!user && <p className="toast-note">You are exploring demo mode. Sign in to save and generate from your personal workspace.</p>}</div><div className="panel output-panel"><div className="output-head"><h3>{kind === "image" ? "Generated visual" : kind === "code" ? "Code editor" : "Generated content"}</h3><div className="output-actions"><button className="icon-btn" onClick={() => { if (output || imageUrl) { navigator.clipboard?.writeText(output || imageUrl); toast.success("Copied to clipboard"); } }}><Copy size={14} /></button><button className="icon-btn" onClick={() => onSavePrompt(instructions)}><Library size={14} /></button></div></div><div className="output-body">{kind === "image" && imageUrl ? <img className="image-output" src={imageUrl} alt="AI generated travel visual" /> : kind === "code" && output ? <pre className="code-output">{output}</pre> : output ? <Streamdown>{output}</Streamdown> : <div className="empty-output"><div><Sparkles size={30} /><p>Your output will appear here.</p><span>Try the Cape Town brief to see the workflow in action.</span></div></div>}</div>{(output || imageUrl) && <div className="cta-row" style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}><button className="btn btn-ghost btn-sm" onClick={() => toast.success("Saved to Generation History")}>Save</button><button className="btn btn-ghost btn-sm" onClick={() => toast.success("Download prepared")}>Download <Download size={14} /></button><button className="btn btn-ghost btn-sm" onClick={generate}>Regenerate</button></div>}</div></div></>;
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) { return <div className={`form-field ${full ? "full" : ""}`}><label>{label}</label>{children}</div>; }

function Optimizer({ user, onSignIn, onSavePrompt }: { user: any; onSignIn: () => void; onSavePrompt: (prompt: string, optimized?: string) => void }) {
  const [prompt, setPrompt] = useState("Write a post about Cape Town.");
  const [result, setResult] = useState<any>(null);
  const mutation = trpc.content.optimizePrompt.useMutation({ onSuccess: data => { setResult(data); toast.success("Prompt analyzed and improved"); }, onError: () => toast.error("Sign in to optimize prompts") });
  const analyze = () => { if (!user) { onSignIn(); return; } mutation.mutate({ prompt }); };
  return <><PageHeader eyebrow="Core feature" title="Prompt Optimization Lab" copy="Turn an idea into a precise creative brief before you spend a generation." action={<span className="badge"><Target size={13} /> Iteration workflow</span>} /><div className="generator-layout"><div className="panel"><Field label="Your basic prompt" full><textarea value={prompt} onChange={e => setPrompt(e.target.value)} /></Field><div className="cta-row" style={{ marginTop: 16 }}><button className="btn btn-primary" onClick={analyze} disabled={mutation.isPending}>{mutation.isPending ? "Analyzing..." : "Analyze prompt"} <WandSparkles size={15} /></button><button className="btn btn-ghost btn-sm" onClick={() => setPrompt("Create an engaging Instagram post promoting Cape Town as a holiday destination.")}>Use example</button></div><div className="prompt-version" style={{ marginTop: 24 }}><strong>What the optimizer checks</strong><p>Target audience · Content type · Tone · Platform · Objective · Location · Length · CTA · Key information</p></div></div><div className="panel"><div className="section-kicker">Original prompt → improved prompt → final output</div>{result ? <><div className="prompt-stack" style={{ marginTop: 15 }}><div className="prompt-version"><strong>Original prompt</strong><p>{prompt}</p></div><div className="prompt-version"><strong>Suggested improvements</strong><p>{result.missing?.map((item: string) => `✓ ${item}`).join("\n")}</p></div><div className="prompt-version" style={{ borderColor: "var(--sun)" }}><strong>Optimized prompt</strong><p>{result.optimizedPrompt}</p></div></div><div className="quality-row"><span className="quality-chip">Prompt quality: Excellent</span><span className="quality-chip">Audience alignment: Strong</span><span className="quality-chip">CTA: Present</span></div><div className="cta-row" style={{ marginTop: 18 }}><button className="btn btn-primary btn-sm" onClick={() => onSavePrompt(prompt, result.optimizedPrompt)}>Save prompt <Library size={14} /></button><button className="btn btn-ghost btn-sm" onClick={() => setPrompt(result.optimizedPrompt)}>Use optimized prompt</button></div></> : <div className="empty-output"><div><Lightbulb size={30} /><p>See how specificity improves creative output.</p><span>Start with “Write a post about Cape Town.”</span></div></div>}</div></div></>;
}

function PromptLibrary({ user, onSignIn }: { user: any; onSignIn: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const query = trpc.prompts.list.useQuery({ search, category }, { enabled: Boolean(user) });
  const create = trpc.prompts.create.useMutation({ onSuccess: () => { query.refetch(); toast.success("Prompt saved"); }, onError: () => toast.error("Sign in to save prompts") });
  const remove = trpc.prompts.delete.useMutation({ onSuccess: () => query.refetch() });
  const prompts = user && query.data?.length ? query.data : demoPrompts;
  const saveExample = (item: any) => { if (!user) { onSignIn(); return; } create.mutate({ title: item.title, category: item.category, description: item.description, promptText: item.promptText ?? item.text }); };
  return <><PageHeader eyebrow="Reusable intelligence" title="Prompt Library" copy="Browse, refine and reuse the briefs that make your travel content distinctive." action={<button className="btn btn-primary" onClick={() => saveExample(demoPrompts[0])}><Plus size={16} /> Create new prompt</button>} /><div className="panel" style={{ marginBottom: 16 }}><div className="cta-row"><div className="search-wrap" style={{ flex: 1, minWidth: 240 }}><Search size={16} /><input className="search" style={{ width: "100%" }} placeholder="Search prompts..." value={search} onChange={e => setSearch(e.target.value)} /></div><select className="search" style={{ minWidth: 170 }} value={category} onChange={e => setCategory(e.target.value)}>{["All", "Social Media", "Blogging", "Email Marketing", "Tourism", "Advertising", "Destinations", "Travel Images", "Travel Code", "SEO", "Campaigns"].map(v => <option key={v}>{v}</option>)}</select></div></div><div className="table-like">{prompts.map((item: any) => <div className="list-row" key={item.id ?? item.title}><div><h4>{item.title}</h4><p>{item.description}</p></div><span className="badge">{item.category}</span><p>{item.usedCount ?? item.used ?? 0} uses · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Sample prompt"}</p><div className="cta-row"><button className="btn btn-ghost btn-sm" onClick={() => saveExample(item)}><Check size={13} /> Use</button>{item.id && <button className="icon-btn" onClick={() => remove.mutate({ id: item.id })}><Trash2 size={14} /></button>}</div><p style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--border)", paddingTop: 10 }}>{item.promptText ?? item.text}</p></div>)}</div></>;
}

function CampaignGenerator({ user, onSignIn }: { user: any; onSignIn: () => void }) {
  const [destination, setDestination] = useState("Cape Town");
  const [duration, setDuration] = useState(7);
  const [audience, setAudience] = useState("International tourists");
  const [goal, setGoal] = useState("Increase tour bookings");
  const [platform, setPlatform] = useState("Instagram + Email");
  const [campaign, setCampaign] = useState<any>(null);
  const mutation = trpc.content.generateCampaign.useMutation({ onSuccess: data => { setCampaign(data); toast.success("Campaign structured successfully"); }, onError: () => toast.error("Sign in to generate campaigns") });
  const generate = () => { if (!user) { onSignIn(); return; } mutation.mutate({ destination, duration, audience, goal, platform }); };
  return <><PageHeader eyebrow="Automation concept" title="AI Campaign Generator" copy="Brief once, then create a complete multi-day travel marketing campaign with structure, CTAs and hashtags." action={<span className="badge"><CalendarDays size={13} /> Multi-day workflow</span>} /><div className="campaign-grid"><div className="panel"><div className="form-grid"><Field label="Destination" full><input value={destination} onChange={e => setDestination(e.target.value)} /></Field><Field label="Campaign duration"><select value={duration} onChange={e => setDuration(Number(e.target.value))}>{[3, 5, 7, 10, 14].map(v => <option key={v} value={v}>{v} days</option>)}</select></Field><Field label="Target audience"><input value={audience} onChange={e => setAudience(e.target.value)} /></Field><Field label="Campaign goal" full><input value={goal} onChange={e => setGoal(e.target.value)} /></Field><Field label="Platform" full><select value={platform} onChange={e => setPlatform(e.target.value)}>{["Instagram + Email", "Instagram", "Facebook", "TikTok", "Email + WhatsApp"].map(v => <option key={v}>{v}</option>)}</select></Field></div><button className="btn btn-primary" style={{ marginTop: 18 }} onClick={generate} disabled={mutation.isPending}>{mutation.isPending ? "Building campaign..." : "Generate campaign"} <Workflow size={16} /></button></div><div className="panel">{campaign ? <><div className="section-kicker">{campaign.title}</div><h3 style={{ fontFamily: "Manrope", margin: "8px 0" }}>{campaign.summary}</h3><div className="campaign-days" style={{ marginTop: 18 }}>{campaign.days?.map((day: any) => <div className="day-card" key={day.day}><div className="day-num">{day.day}</div><div><h4>{day.theme}</h4><p>{day.content}</p><p style={{ marginTop: 6, color: "var(--blue)" }}><strong>CTA:</strong> {day.cta}</p><p style={{ marginTop: 5 }}>{day.hashtags?.join(" ")}</p></div></div>)}</div><div className="cta-row" style={{ marginTop: 18 }}><button className="btn btn-primary btn-sm" onClick={() => toast.success("Campaign saved")}>Save campaign</button><button className="btn btn-ghost btn-sm" onClick={() => toast.success("Export prepared")}>Export <Download size={14} /></button></div></> : <div className="empty-output"><div><Workflow size={30} /><p>Your campaign calendar will appear here.</p><span>Use Cape Town · 7 days · international tourists to see it work.</span></div></div>}</div></div></>;
}

function HistoryPage({ user, onSignIn }: { user: any; onSignIn: () => void }) {
  const [type, setType] = useState("All");
  const query = trpc.history.list.useQuery({ type }, { enabled: Boolean(user) });
  const rows = user && query.data?.length ? query.data : [{ id: "1", type: "text", title: "Cape Town destination guide", prompt: "Create a destination guide for Cape Town", createdAt: new Date() }, { id: "2", type: "prompt", title: "Instagram launch prompt", prompt: "Promote Cape Town to international tourists", createdAt: new Date() }, { id: "3", type: "campaign", title: "Cape Town 7-day campaign", prompt: "Increase tour bookings", createdAt: new Date() }];
  return <><PageHeader eyebrow="Your archive" title="Generation History" copy="Find previous text, image, code, prompt and campaign work in one place." action={!user ? <button className="btn btn-primary btn-sm" onClick={onSignIn}>Sign in to sync history</button> : undefined} /><div className="panel" style={{ marginBottom: 16 }}><div className="cta-row">{["All", "text", "image", "code", "prompt", "campaign"].map(v => <button className={`btn btn-sm ${type === v ? "btn-primary" : "btn-ghost"}`} key={v} onClick={() => setType(v)}>{v[0].toUpperCase() + v.slice(1)}</button>)}</div></div><div className="table-like">{rows.map((row: any) => <div className="list-row" key={row.id}><div><h4>{row.title}</h4><p>{row.prompt}</p></div><span className="badge">{row.type}</span><p>{row.createdAt ? new Date(row.createdAt).toLocaleString() : "Today"}</p><div className="cta-row"><button className="icon-btn" onClick={() => toast.success("Opened generation")}><PenLine size={14} /></button><button className="icon-btn" onClick={() => toast.success("Copied generation")}><Copy size={14} /></button></div></div>)}</div></>;
}

function ProfilePage({ user, onSignIn }: { user: any; onSignIn: () => void }) {
  const profile = trpc.workspace.profile.useQuery(undefined, { enabled: Boolean(user) });
  const update = trpc.workspace.updateProfile.useMutation({ onSuccess: () => { profile.refetch(); toast.success("Profile updated"); }, onError: () => toast.error("Sign in to update your profile") });
  const current = profile.data ?? user ?? { name: "Demo Creator", email: "creator@example.com", company: "Cape & Coast Travel", jobTitle: "Travel Marketer" };
  const [name, setName] = useState(current.name ?? "Demo Creator");
  const [company, setCompany] = useState(current.company ?? "Cape & Coast Travel");
  const [jobTitle, setJobTitle] = useState(current.jobTitle ?? "Travel Marketer");
  return <><PageHeader eyebrow="Your workspace identity" title="Profile" copy="Keep your workspace details and travel-marketing context up to date." /><div className="profile-layout"><div className="panel profile-hero"><div className="profile-avatar">{(name || "D").slice(0, 1).toUpperCase()}</div><h3>{name}</h3><p>{current.email ?? "creator@example.com"}</p><div className="mini-stat-grid"><div className="mini-stat"><strong>128</strong><span>Total generations</span></div><div className="mini-stat"><strong>34</strong><span>Saved prompts</span></div><div className="mini-stat"><strong>12</strong><span>Campaigns</span></div><div className="mini-stat"><strong>41</strong><span>Images</span></div></div></div><div className="panel"><div className="form-grid"><Field label="Full name" full><input value={name} onChange={e => setName(e.target.value)} /></Field><Field label="Company / organization"><input value={company} onChange={e => setCompany(e.target.value)} /></Field><Field label="Role"><input value={jobTitle} onChange={e => setJobTitle(e.target.value)} /></Field><Field label="Email" full><input value={current.email ?? "creator@example.com"} readOnly /></Field></div><button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => { if (!user) { onSignIn(); return; } update.mutate({ name, company, jobTitle }); }}>Save profile <Check size={15} /></button></div></div></>;
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  return <><PageHeader eyebrow="Workspace preferences" title="Settings" copy="Tune the feel and defaults of your TravelContent AI workspace." /><div className="panel"><div className="section-kicker">Appearance</div><div className="toggle-row"><div><h4>Dark mode</h4><p>Switch between light and dark workspace themes.</p></div><button className={`switch ${theme === "dark" ? "on" : ""}`} onClick={toggleTheme} aria-label="Toggle dark mode" /></div><div className="toggle-row"><div><h4>Email notifications</h4><p>Receive updates when a long-running generation is ready.</p></div><button className={`switch ${notifications ? "on" : ""}`} onClick={() => setNotifications(v => !v)} aria-label="Toggle email notifications" /></div><div className="section-kicker" style={{ marginTop: 28 }}>Generation defaults</div><div className="form-grid" style={{ marginTop: 13 }}><Field label="Default content tone"><select value={tone} onChange={e => setTone(e.target.value)}>{["Professional", "Friendly", "Exciting", "Luxury", "Inspirational", "Persuasive"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Default content length"><select value={length} onChange={e => setLength(e.target.value)}>{["Short", "Medium", "Long"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Default language"><select><option>English</option><option>French</option><option>Portuguese</option></select></Field></div><button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => toast.success("Settings saved")}>Save preferences</button></div></>;
}

function Workspace() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = trpc.workspace.stats.useQuery(undefined, { enabled: Boolean(user) });
  const savePrompt = trpc.prompts.create.useMutation({ onSuccess: () => toast.success("Prompt saved to your library"), onError: () => toast.error("Sign in to save prompts") });
  useEffect(() => { if (loading) return; }, [loading]);
  const onSignIn: () => void = () => { startLogin(); };
  const onSavePrompt = (prompt: string, optimized?: string) => { if (!user) { onSignIn(); return; } savePrompt.mutate({ title: "Saved travel prompt", category: "Tourism", description: "Saved from the AI workspace", promptText: prompt, optimizedPrompt: optimized }); };
  const onLogout: () => void = () => { void logout().then(() => { setLocation("/"); toast.success("Logged out"); }); };
  const page = active === "dashboard" ? <Dashboard onNavigate={setActive} stats={stats.data} /> : active === "text" || active === "image" || active === "code" ? <GeneratorPage kind={active} user={user} onSignIn={onSignIn} onSavePrompt={onSavePrompt} /> : active === "optimizer" ? <Optimizer user={user} onSignIn={onSignIn} onSavePrompt={onSavePrompt} /> : active === "prompts" ? <PromptLibrary user={user} onSignIn={onSignIn} /> : active === "campaign" ? <CampaignGenerator user={user} onSignIn={onSignIn} /> : active === "history" ? <HistoryPage user={user} onSignIn={onSignIn} /> : active === "profile" ? <ProfilePage user={user} onSignIn={onSignIn} /> : <SettingsPage />;
  return <div className="app-shell"><Sidebar active={active} onNavigate={setActive} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} /><div className="main-area"><Topbar onMenu={() => setSidebarOpen(true)} onTheme={() => toggleTheme?.()} theme={theme} user={user} onProfile={() => setActive("profile")} />{!user && <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 34px 0" }}><div className="panel" style={{ background: "var(--mint)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><strong>Demo workspace</strong><div className="toast-note" style={{ marginTop: 4 }}>Explore the workflow freely. Sign in when you’re ready to generate and save personal work.</div></div><button className="btn btn-primary btn-sm" onClick={onSignIn}>Sign in with Manus <ArrowRight size={14} /></button></div></div>}<main className="page">{page}</main></div></div>;
}

function AppRouter() {
  return <Switch><Route path="/" component={Landing} /><Route path="/workspace" component={Workspace} /><Route component={Landing} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster /><AppRouter /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

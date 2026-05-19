import fs from "fs";
import path from "path";

const replacements = [
  ["text-slate-900 dark:text-white", "text-foreground"],
  ["text-slate-500 dark:text-slate-400", "text-muted"],
  ["text-slate-600 dark:text-slate-400", "text-muted"],
  ["text-slate-700 dark:text-slate-300", "text-foreground"],
  ["bg-white dark:bg-slate-900", "bg-card"],
  ["border-slate-100 dark:border-slate-800", "border-border"],
  ["border-slate-50 dark:border-slate-800", "border-border"],
  ["border-slate-200 dark:border-slate-800", "border-border"],
  ["border-slate-100 dark:border-slate-700", "border-border"],
  ["bg-slate-50 dark:bg-slate-950", "bg-background"],
  ["bg-slate-50 dark:bg-slate-800/50", "bg-background-secondary"],
  ["bg-slate-50/50 dark:bg-slate-800/50", "bg-background-secondary"],
  ["bg-slate-50 dark:bg-slate-800", "bg-background-secondary"],
  ["hover:bg-slate-50 dark:hover:bg-slate-800/50", "hover:bg-card-hover"],
  ["hover:bg-slate-50 dark:hover:bg-slate-800/30", "hover:bg-card-hover"],
  ["hover:bg-white dark:hover:bg-slate-800", "hover:bg-card-hover"],
  ["divide-slate-100 dark:divide-slate-800", "divide-border"],
  ["fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm", "modal-overlay"],
  ["text-slate-500", "text-muted"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-600", "text-muted"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-900", "text-foreground"],
  ["hover:bg-slate-200", "hover:bg-card-hover"],
  ["hover:bg-slate-50", "hover:bg-card-hover"],
  ["hover:bg-slate-100", "hover:bg-card-hover"],
  ["hover:bg-red-50", "hover:bg-danger/10"],
  ["text-red-600", "text-danger"],
  ["text-green-500", "text-success"],
  ["text-green-600", "text-success"],
  ["text-green-700", "text-success"],
  ["text-blue-600", "text-accent"],
  ["text-amber-600", "text-warning"],
  ["text-amber-700", "text-warning"],
  ["bg-green-500", "bg-success"],
  ["bg-slate-300", "bg-border"],
  ["hover:text-primary-dark", "hover:opacity-80"],
  ["hover:bg-primary-dark", "hover:opacity-90"],
  ["prose prose-slate dark:prose-invert max-w-none", "page-prose max-w-none"],
  ["bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600", "alert-error"],
  ["bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-600", "alert-error"],
  ["bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", "bg-primary/10 text-primary"],
  [" style={{ fontFamily: 'var(--font-display)' }}", ""],
  ["rounded-3xl", "rounded-[var(--radius-card)]"],
  ["rounded-[2rem]", "rounded-[var(--radius-card)]"],
  ["bg-slate-900 dark:bg-slate-800 text-white", "btn-primary text-white"],
  [
    "u.role === 'organization' ? 'bg-amber-100 text-amber-700' : u.role === 'donor' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'",
    "u.role === 'organization' ? 'badge-role-org' : u.role === 'donor' ? 'badge-role-donor' : 'badge-role-recipient'",
  ],
  [
    "req.urgency === 'Urgent' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'",
    "req.urgency === 'Urgent' ? 'badge-warning' : 'badge-info'",
  ],
  [
    "req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'",
    "req.status === 'Approved' ? 'badge-success' : 'badge-neutral'",
  ],
  ["flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors", "btn-cancel flex-1"],
  ["bg-slate-100 dark:bg-slate-800", "bg-background-secondary"],
  ["bg-slate-100", "bg-background-secondary"],
  ["bg-slate-900 text-white", "btn-primary text-white"],
  ["bg-slate-900 dark:bg-slate-800", "btn-primary"],
  ["hover:bg-slate-800", "hover:opacity-90"],
  ["dark:hover:bg-slate-700", ""],
  ["bg-slate-50/50 dark:bg-slate-900/50", "bg-background-secondary"],
  ["border border-slate-100", "border border-border"],
  ["text-blue-700", "text-accent"],
  ["bg-amber-100 text-warning", "badge-warning"],
  ["bg-blue-100 text-accent", "badge-info"],
  ["bg-green-100 text-success", "badge-success"],
  ["bg-green-100 text-green-700", "badge-success"],
  ["bg-red-100 text-red-700", "badge-warning"],
  ["bg-red-100 text-danger", "badge-warning"],
  ["bg-green-100 text-success text-[10px]", "badge-success text-[10px]"],
  [
    "u.role === 'organization' ? 'bg-amber-100 text-warning' : u.role === 'donor' ? 'bg-green-100 text-success' : 'bg-blue-100 text-blue-700'",
    "u.role === 'organization' ? 'badge-role-org' : u.role === 'donor' ? 'badge-role-donor' : 'badge-role-recipient'",
  ],
  [
    "req.urgency === 'Urgent' ? 'bg-amber-100 text-warning' : 'bg-blue-100 text-accent'",
    "req.urgency === 'Urgent' ? 'badge-warning' : 'badge-info'",
  ],
  ["req.status === 'Approved' ? 'bg-green-100 text-success' : 'bg-slate-100 text-muted'", "req.status === 'Approved' ? 'badge-success' : 'badge-neutral'"],
  ["animate-in zoom-in duration-200", "animate-fade-in"],
  ["animate-in fade-in slide-in-from-bottom-4 duration-500", "animate-fade-in"],
  ["modal-overlay\">\n          <motion.div className=\"bg-card", "modal-overlay\">\n          <div className=\"modal-panel"],
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".tsx")) {
      let content = fs.readFileSync(full, "utf8");
      const before = content;
      for (const [from, to] of replacements) {
        content = content.split(from).join(to);
      }
      if (content !== before) {
        fs.writeFileSync(full, content);
        console.log("updated:", full);
      }
    }
  }
}

walk("src");

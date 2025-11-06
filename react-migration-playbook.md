### React Version Inventory and Migration Effort Playbook (with Copilot)

This playbook helps you:
- Identify all React versions used across the workspace (including monorepos).
- Inventory current UX libraries and component usage.
- Use Copilot to estimate complexity and migration effort to the latest React.
- Plan effort to migrate from an existing UX library to Kendo UI for React.

---

## Prerequisites
- Node.js 16+ and a package manager (npm, yarn, or pnpm)
- PowerShell 7+ (Windows) or Bash/zsh (macOS/Linux)
- Ripgrep installed for faster code search (optional) `rg`/`ripgrep`
- GitHub Copilot or Copilot Chat enabled in your IDE

Tip: Run commands from the repository root. For monorepos, ensure workspaces are bootstrapped (e.g., `npm install` or `pnpm install`).

---

## 1) Inventory React Versions Across the Workspace

Choose one approach (A = quickest, B = precise for monorepos, C = lockfile-driven).

### A. Fast package.json scan (cross-platform)
PowerShell:
```powershell
Get-ChildItem -Recurse -Filter package.json | ForEach-Object {
  $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
  $deps = @()
  foreach ($k in @('dependencies','devDependencies','peerDependencies','optionalDependencies')) { if ($json.$k) { $deps += $json.$k.GetEnumerator() } }
  $react = $deps | Where-Object { $_.Name -in @('react','react-dom') }
  if ($react) {
    $react | ForEach-Object {
      [PSCustomObject]@{
        PackageJson = $_.PSParentPath.Split('::')[-1]
        Module      = $_.Name
        Declared    = $_.Value
      }
    }
  }
} | Sort-Object PackageJson, Module | Format-Table -AutoSize
```

Bash:
```bash
find . -name package.json -not -path "*/node_modules/*" -print0 | \
  xargs -0 -I {} node -e '
const fs=require("fs");
const p="{}";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
const buckets=["dependencies","devDependencies","peerDependencies","optionalDependencies"];
for(const b of buckets){
  const d=j[b];
  if(!d) continue;
  for(const m of ["react","react-dom"]) if(d[m]){
    console.log(`${p}\t${m}\t${d[m]}`);
  }
}
'
```

Interpretation: Declared ranges may differ from installed versions (locked). Proceed to B/C for exact installed versions.

### B. Resolve installed versions (monorepos and hoisted installs)

- npm (per package):
```bash
npm ls react react-dom --all | cat
```

- pnpm (workspace root):
```bash
pnpm why react react-dom | cat
```

- yarn classic (v1):
```bash
yarn why react react-dom | cat
```

If using workspaces, run within each package directory for granular results.

### C. Parse lockfiles to deduplicate exact versions

PowerShell (auto-detects common lockfiles):
```powershell
$lockfiles = Get-ChildItem -Recurse -Include package-lock.json,yarn.lock,pnpm-lock.yaml -ErrorAction SilentlyContinue
foreach ($lf in $lockfiles) {
  Write-Host "Lockfile:" $lf.FullName -ForegroundColor Cyan
  if ($lf.Name -eq 'package-lock.json') {
    $data = Get-Content $lf.FullName -Raw | ConvertFrom-Json
    $versions = New-Object System.Collections.Generic.HashSet[string]
    function Walk($node){
      if ($null -eq $node) { return }
      if ($node.dependencies) {
        foreach ($k in $node.dependencies.GetEnumerator()) {
          if ($k.Name -in @('react','react-dom') -and $k.Value.version) { [void]$versions.Add($k.Name+':' + $k.Value.version) }
          Walk $k.Value
        }
      }
    }
    Walk $data
    $versions | Sort-Object | ForEach-Object { $_ }
  } elseif ($lf.Name -eq 'yarn.lock') {
    Select-String -Path $lf.FullName -Pattern '^(react(@|\\|:)|react-dom(@|\\|:)).*@' -NoEmphasis | ForEach-Object { $_.Line }
  } elseif ($lf.Name -eq 'pnpm-lock.yaml') {
    Select-String -Path $lf.FullName -Pattern '^\s{2}(react|react-dom)@' -NoEmphasis | ForEach-Object { $_.Line.Trim() }
  }
}
```

Cross-check: Combine A + B + C to produce the definitive set of versions in use.

### D. Enhanced Dependency Ecosystem Analysis

PowerShell (React ecosystem compatibility check):
```powershell
# Enhanced dependency analysis - check for React version conflicts
Get-ChildItem -Recurse -Filter package.json | ForEach-Object {
  $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
  foreach ($depType in @('dependencies','devDependencies','peerDependencies')) {
    if ($json.$depType) {
      foreach ($dep in $json.$depType.GetEnumerator()) {
        # Flag React ecosystem packages that may have version constraints
        if ($dep.Name -match "react-|@testing-library|enzyme|jest|babel|webpack") {
          Write-Output "$($_.FullName)`t$($dep.Name)`t$($dep.Value)`t$depType"
        }
      }
    }
  }
}
```

### React Ecosystem Compatibility Matrix
| Package Type | React 16 | React 17 | React 18 | React 19 | Migration Impact |
|--------------|----------|----------|----------|----------|------------------|
| enzyme | ✅ | ⚠️ | ❌ | ❌ | **High** - Must migrate to RTL |
| @testing-library/react | ✅ | ✅ | ✅ | ✅ | **Low** - Version bump only |
| react-redux | ✅ | ✅ | ✅ | ✅ | **Medium** - API changes in v8+ |
| ag-grid-react | ✅ | ✅ | ✅ | ✅ | **Medium** - Breaking changes in v30+ |

---

## 2) Inventory UX Libraries and Component Usage

Search for common UI libraries to understand migration scope. Adjust patterns as needed.

PowerShell:
```powershell
$libs = @(
  '@mui/','@mui/joy', '@coyote', 'antd', 'semantic-ui-react', '@chakra-ui/', '@blueprintjs/', '@fluentui/', 'carbon-components-react',
  'primereact', '@mantine/', 'grommet', 'evergreen-ui', 'rsuite', 'baseui', '@radix-ui/', '@headlessui/', 'reactstrap', 'react-bootstrap'
)
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | Where-Object { $_.FullName -notmatch 'node_modules' } | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  foreach ($lib in $libs) {
    if ($content -match "from ['\"']$([Regex]::Escape($lib)).*") { Write-Output ("$($_.FullName)`t$lib") }
  }
} | Sort-Object | Format-Table -AutoSize
```

Ripgrep (faster):
```bash
rg -n --no-ignore -g '!node_modules' "from ['\"](@mui/|antd|semantic-ui-react|@chakra-ui/|@coyote/|@blueprintjs/|@fluentui/|carbon-components-react|primereact|@mantine/|grommet|evergreen-ui|rsuite|baseui|@radix-ui/|@headlessui/|reactstrap|react-bootstrap)" 
```

Kendo UI presence:
```bash
rg -n --no-ignore -g '!node_modules' "@progress/kendo-react-"
```

Optional: Count component usage to size replacements.
```bash
rg -o "<(Button|Grid|Table|Modal|Dialog|Select|DatePicker)" -g '!node_modules' --stats | cat
```

### Advanced Pattern Detection for Complexity Assessment

Detect legacy React patterns that increase migration complexity:
```bash
# Detect component patterns that increase migration complexity
rg -n --no-ignore -g '!node_modules' "class.*extends.*Component|componentDid|componentWill|UNSAFE_|ReactDOM\.render|ReactDOM\.hydrate|defaultProps.*=|React\.createClass" --type js --type jsx

# Count different testing patterns
echo "Enzyme shallow tests:"
rg -l "shallow\(" --type js | wc -l
echo "Enzyme mount tests:"
rg -l "mount\(" --type js | wc -l
echo "RTL tests:"
rg -l "@testing-library/react" --type js | wc -l
```

### Complexity Factors Matrix
| Pattern | Complexity Weight | Detection Command | Migration Effort |
|---------|------------------|-------------------|-----------------|
| Class Components | +2 points | `rg "class.*extends.*Component"` | Convert to hooks |
| Legacy Lifecycle | +3 points | `rg "componentDid|componentWill"` | Rewrite with useEffect |
| ReactDOM.render | +2 points | `rg "ReactDOM\.render"` | Migrate to createRoot |
| Enzyme Tests | +1 point per file | `rg "from 'enzyme'"` | Migrate to RTL |
| String Refs | +2 points | `rg "ref=['\"]"`| Convert to useRef |
| Context API (legacy) | +3 points | `rg "getChildContext|contextTypes"` | Migrate to new Context |

---

## 3) Copilot Prompts: Complexity and Migration Effort

Use these prompt templates in Copilot Chat within your editor. Scope them at the repo root or per package.

### A. React Upgrade Complexity (to latest major)
Paste:
```
You are a senior React migration assistant. Analyze this repository to estimate effort to upgrade to the latest React major version.

Please:
1) Identify React and React DOM versions in use and list packages by version.
2) Flag code patterns that typically require changes for major upgrades (legacy lifecycle methods, deprecated context API, string refs, UNSAFE_ methods, defaultProps on function components, ReactDOM.render, Suspense/SSR caveats, etc.).
3) Note bundler constraints (Webpack/TS/Vite/Babel) and required plugin/tooling updates.
4) Classify each package with a complexity tier (Low/Medium/High) and a reason.
5) Produce a migration checklist with concrete steps.
6) Output a summary table: package path | current react | blockers | complexity | est. story points.
7) Ag-Grid instance will not be replaced with Kendo-Grid, we want to upgrade it to version 33+.
```

### B. UX Library to Kendo UI Migration Effort
Paste:
```
You are a React UI migration specialist. Analyze this codebase to estimate effort to migrate current UI libraries to Kendo UI for React.

Please:
1) Detect which UI libraries are used and where (e.g., MUI, MUI/JOY, AntD, Chakra, Coyote, Blueprint, FluentUI, Bootstrap, etc.).
2) For each library, map common components to Kendo equivalents (e.g., Dialog→Dialog, Select→DropDownList, DatePicker→DatePicker, Tabs→TabStrip, Charts→Kendo Charts).
3) We will migrate to ag-grid version 33+ but will not use kendo-grid.
4) For each package, count occurrences of components and identify complex usage (virtualized tables, custom renderers, form libs integration, theming).
5) Identify cross-cutting concerns (theming, RTL, i18n, accessibility, form validation) and gaps.
6) Estimate migration complexity (Low/Medium/High) and story points per package, with a reasoning note and prioritized sequence.
7) Produce a phased plan: pilot package, shared primitives, high-ROI areas, remaining components.
```

### C. Combined React+Kendo Migration Plan
Paste:
```
Create an integrated plan that sequences upgrading React to the latest version and migrating UI components to Kendo UI with minimized churn. Identify tasks that can happen in parallel vs. must be sequential (e.g., router changes, React 18 root API, strict mode impacts). Provide risk mitigation, test strategy, and a rollout calendar by package.
```

---

## 4) Complexity Scoring Rubric (Guidance for Copilot and Reviewers)

- Low: Minimal legacy APIs, functional components, limited custom rendering, small UI surface.
- Medium: Mix of class and function components, moderate custom hooks/HOCs, theming, some deprecated patterns.
- High: Extensive legacy lifecycles, custom render pipelines, complex data grids/virtualization, SSR/streaming, heavy theming and design tokens, multiple UI libs interleaved.

Suggested story point ranges:
- Low: 1–3 per package
- Medium: 5–8 per package
- High: 13–21 per package

### Detailed Time Estimation Model

**Base Migration Time Calculation:**
- **Base React Upgrade**: 2-3 days
- **ReactDOM.render migrations**: 0.5 days per instance
- **Class component conversions**: 1-2 hours per component  
- **Enzyme test migrations**: 2-4 hours per test file
- **Build tool updates**: 1-2 days
- **Third-party library updates**: 0.5-1 day per major library
- **QA and validation**: 20% of total development time

**Risk Multipliers:**
- Custom components library: +50%
- Large test suite (>100 tests): +30%  
- Complex state management: +25%
- SSR/SSG implementation: +40%
- TypeScript strict mode: +20%

**Example Calculation:**
- Base: 3 days
- ReactDOM migrations (2 instances): 1 day
- Enzyme tests (8 files): 2 days  
- ag-Grid upgrade: 1 day
- Build tools: 1 day
- **Subtotal: 8 days**
- Custom components risk (+50%): +4 days
- **Total: 12 days = ~13 story points**

Factors increasing effort:
- TypeScript strictness changes, ESLint/TS rules migrations
- Routing major upgrades (e.g., react-router v5 → v6)
- State management upgrades (Redux Toolkit adoption, MobX versions)
- React 18 root API (`createRoot`), concurrent features, Suspense boundaries

---

## 5) Report Templates

### Markdown Summary
```markdown
### React and UI Migration Assessment

Date: <YYYY-MM-DD>

#### React Version Inventory
- <package-path>: react <declared> (installed <resolved>)

#### UI Libraries Inventory
- <library> used in <n> files across <packages>

#### Complexity by Package
| Package | React | Key Blockers | Complexity | Points |
|-------- |-------|--------------|-----------|--------|
| apps/web | 17.x | legacy lifecycle in X | Medium | 8 |

#### Migration Plan
- Phase 1: Pilot in <package> with Kendo Grid & Dialog
- Phase 2: Upgrade React and tooling in shared libs
- Phase 3: Replace remaining UI components

#### Version-Specific Breaking Changes
**React 16 → 17:**
- [ ] Event delegation changes (minor impact)
- [ ] useEffect cleanup timing changes
- [ ] Error boundary changes

**React 17 → 18:**
- [ ] **ReactDOM.render → createRoot** (High Impact)
- [ ] Automatic batching changes
- [ ] useEffect timing changes
- [ ] IE11 support removed
- [ ] New JSX Transform (build tools)

**React 18 → 19:**
- [ ] React.FC children prop removal (TypeScript)
- [ ] StrictMode changes
- [ ] Legacy Context API removal
- [ ] PropTypes moved to separate package

#### Post-Migration Validation Checklist
**Automated Validation:**
- [ ] `npm run build` succeeds without warnings
- [ ] `npm test` passes all tests  
- [ ] Bundle size within 10% of previous version
- [ ] No React deprecation warnings in console
- [ ] No new high/critical vulnerabilities introduced
- [ ] Performance benchmarks within acceptable range

**Manual Validation:**
- [ ] All major user flows work correctly
- [ ] Forms and interactions function properly
- [ ] Grid/table functionality intact
- [ ] Modal/dialog behavior correct
- [ ] Responsive design unaffected
- [ ] Browser compatibility maintained

**Performance Validation:**
- [ ] Lighthouse score maintained/improved
- [ ] First Paint/Contentful Paint metrics
- [ ] Memory usage patterns
- [ ] Bundle analysis comparison

Risks: <list>
Mitigations: <list>
```

### JSON (for tooling)
```json
{
  "packages": [
    {
      "path": "apps/web",
      "react": { "declared": "^18.2.0", "installed": "18.2.0" },
      "uiLibs": ["@mui/material"],
      "complexity": "Medium",
      "points": 8,
      "blockers": ["Legacy lifecycles in components/A.jsx"],
      "notes": "Replace MUI Table with Kendo Grid"
    }
  ]
}
```

---

## 6) Kendo UI Mapping Cheatsheet (Common Cases)

- Table/DataGrid → `@progress/kendo-react-grid`
- Dialog/Modal → `@progress/kendo-react-dialogs`
- Select/Autocomplete → `@progress/kendo-react-dropdowns`
- Date/Time Pickers → `@progress/kendo-react-dateinputs`
- Charts → `@progress/kendo-react-charts`
- Inputs/Form → `@progress/kendo-react-inputs` + `@progress/kendo-react-form`
- Layout/Tabs → `@progress/kendo-react-layout`

Notes:
- Review styling/theming strategy; align Kendo theme with existing design tokens.
- Plan for form integration (Formik/React Hook Form examples exist for Kendo).

---

## 7) Execution Tips

- Start with a pilot package to validate patterns and tooling.
- Introduce adapters/wrappers for shared primitives to enable incremental swaps.
- Keep UI and logic decoupled; add tests around complex UI flows before migration.
- Batch dependency updates per package to keep diffs reviewable.

### Risk Assessment Matrix
| Risk Factor | Probability | Impact | Mitigation Strategy | Estimated Delay |
|-------------|-------------|--------|-------------------|------------------|
| Custom components break | High | High | Gradual testing approach | 2-5 days |
| Test migration issues | Medium | Medium | Parallel test development | 1-3 days |
| Build tool conflicts | Low | High | Backup branch strategy | 1-2 days |
| Third-party lib conflicts | Medium | High | Version compatibility matrix | 2-4 days |
| Performance regression | Low | Medium | Performance monitoring | 1 day |

### Bundle Size Impact Analysis
```bash
# Current bundle analysis
npm run build 2>&1 | grep -E "(Size|KB|MB|Bundle)"

# React version impact estimation
echo "React 16 typical bundle size: ~45KB gzipped"
echo "React 18 typical bundle size: ~42KB gzipped" 
echo "React 19 typical bundle size: ~41KB gzipped"
echo "Migration may reduce bundle size by ~8-10%"
```

### Build Tool Compatibility Assessment
```powershell
# Webpack/Build tool compatibility check
$buildFiles = @("webpack.config.js", "babel.config.js", ".babelrc", "vite.config.js", "tsconfig.json")
foreach ($file in $buildFiles) {
  $found = Get-ChildItem -Recurse -Name $file -ErrorAction SilentlyContinue
  if ($found) {
    Write-Output "Found build config: $file"
    $content = Get-Content $found[0] -Raw
    if ($content -match "babel-preset-env|@babel/preset-env") {
      Write-Output "  - Babel preset detected"
    }
    if ($content -match "corejs") {
      Write-Output "  - CoreJS configuration found"
    }
  }
}
```

---

## 8) One-Command Generators (optional)

Write TSV summaries to `migration-react-inventory.tsv`.

PowerShell:
```powershell
"package\tmodule\tdeclared" | Out-File -FilePath migration-react-inventory.tsv -Encoding utf8
Get-ChildItem -Recurse -Filter package.json | ForEach-Object {
  $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
  foreach ($k in @('dependencies','devDependencies','peerDependencies','optionalDependencies')) {
    if ($json.$k) {
      foreach ($m in 'react','react-dom') { if ($json.$k.$m) { "$($_.FullName)`t$m`t$($json.$k.$m)" | Add-Content migration-react-inventory.tsv } }
    }
  }
}
```

Bash:
```bash
echo -e "package\tmodule\tdeclared" > migration-react-inventory.tsv
find . -name package.json -not -path "*/node_modules/*" -print0 | \
  xargs -0 -I {} node -e '
const fs=require("fs");
const p="{}";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
const buckets=["dependencies","devDependencies","peerDependencies","optionalDependencies"];
for(const b of buckets){
  const d=j[b];
  if(!d) continue;
  for(const m of ["react","react-dom"]) if(d[m]){
    console.log(`${p}\t${m}\t${d[m]}`);
  }
}' >> migration-react-inventory.tsv
```

---

With the inventory and Copilot analyses, you can size the React upgrade and plan the Kendo UI migration with clear phases, points, and risks.



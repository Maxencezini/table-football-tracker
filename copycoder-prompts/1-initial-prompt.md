Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Team Performance Dashboard with Player Statistics
</summary_title>

<image_analysis>

1. Navigation Elements:
- Top action buttons with: "Ajouter un score", "Ajouter un joueur"
- Search bar with settings icon
- Pagination controls with: 1-10 of 52, prev/next arrows
- Filter, download, and edit icons in header


2. Layout Components:
- Main container: ~1000px width
- Table layout with fixed header
- Row height: ~60px
- Column widths: 
  - Name/Avatar: 25%
  - Points: 15%
  - Victory: 15%
  - Defeat: 15%
  - Ratio: 15%
  - Actions: 15%


3. Content Sections:
- Table header with 6 columns
- Player rows containing:
  - Avatar + Name + Role
  - Numerical statistics
  - Action buttons
- Pagination footer


4. Interactive Controls:
- Search input field
- Settings toggle
- Row action buttons: edit and delete
- Pagination navigation
- Filter and download options


5. Colors:
- Primary blue: #0052CC (action buttons)
- Background: #F8F9FA
- Text: #172B4D (headers), #42526E (body)
- Borders: #DFE1E6
- Row hover: #FAFBFC


6. Grid/Layout Structure:
- Fixed table layout
- Responsive container
- Consistent column alignment
- 8px base spacing unit
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Table.tsx
│   │   ├── Header.tsx
│   │   └── Pagination.tsx
│   ├── features/
│   │   ├── PlayerList/
│   │   └── PlayerActions/
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```


2. Key Features:
- Player CRUD operations
- Score management
- Search functionality
- Data export
- Filtering system
- Pagination


3. State Management:
```typescript
interface AppState {
├── players: {
│   ├── items: Player[]
│   ├── loading: boolean
│   ├── error: string | null
│   └── filters: FilterOptions
├── }
├── pagination: {
│   ├── currentPage: number
│   ├── itemsPerPage: number
│   └── totalItems: number
├── }
}
```


4. Routes:
```typescript
const routes = [
├── '/dashboard',
├── '/players/*',
├── '/scores/*',
└── '/settings/*'
]
```


5. Component Architecture:
- TableContainer (smart component)
- PlayerRow (presentation)
- ActionButtons (shared)
- SearchBar (shared)
- PaginationControls (shared)


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'sm': 320px,
├── 'md': 768px,
├── 'lg': 1024px,
└── 'xl': 1280px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.
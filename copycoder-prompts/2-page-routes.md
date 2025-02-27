Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /-ajouter-un-score-
- /-ajouter-un-joueur-
- /1-10-of-52
- /prev-next-arrows

Page Implementations:
/-ajouter-un-score-:
Core Purpose: Allow users to add new game scores for players
Key Components
- Score input form
- Player selector dropdown
- Date

/time picker
- Game type selector
- Submit button with validation
Layout Structure:
- Centered card layout
- Form fields stacked vertically
- Responsive padding on mobile

/-ajouter-un-joueur-
Core Purpose: Enable adding new players to the system
Key Components
- Player registration form
- Profile image upload
- Username validation
- Email input
- Optional details fields
Layout Structure
- Single column form layout
- Preview section for uploaded image
- Success

/error message area

/1-10-of-52:
Core Purpose: Display paginated results of players or scores
Key Components
- Results grid

/filter options
Layout Structure:
- Table

/prev-next-arrows:
Core Purpose: Navigation component for moving between pages
Key Components
- Previous/Next buttons
- Page number display
- Disabled state handling
- Loading indicators
Layout Structure
- Horizontal layout with arrows
- Compact mobile design
- Centered alignment

Layouts:
MainLayout:
- Applicable routes: All routes
- Core components
  - Header with navigation
  - Footer
  - Sidebar (desktop only)
  - Content area
- Responsive behavior
  - Sidebar collapses on mobile
  - Navigation becomes hamburger menu
  - Fluid content width

FormLayout
- Applicable routes: /-ajouter-un-score-, /-ajouter-un-joueur-
- Core components
  - Form container
  - Error messaging
  - Progress indicator
- Responsive behavior
  - Full width on mobile
  - Centered card on desktop
  - Adjustable padding

ListLayout
- Applicable routes: /1-10-of-52
- Core components
  - Results container
  - Navigation controls
  - Filter sidebar
- Responsive behavior
  - Grid to list view transition
  - Collapsible filters
  - Responsive spacing
</page-structure-prompt>
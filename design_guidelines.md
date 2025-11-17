# Design Guidelines: Intelligent Patient Hub

## Design Approach

**Selected System**: Material Design with healthcare-focused customization
**Rationale**: Healthcare applications demand clarity, trust, and efficiency. Material Design provides excellent data visualization components, clear hierarchy, and established patterns for information-dense interfaces while maintaining a modern, approachable feel.

## Core Design Principles

1. **Trust Through Clarity**: Every health metric, appointment, and record must be immediately comprehensible
2. **Efficient Navigation**: Minimize clicks to critical health information
3. **Data Transparency**: Clear visual hierarchies for complex health data
4. **Calm Interface**: Reduce cognitive load with clean layouts and purposeful whitespace

## Typography System

**Primary Font**: Inter (Google Fonts) - exceptional readability for health data
**Secondary Font**: Work Sans (Google Fonts) - supportive headers

**Hierarchy**:
- Page Headers: text-4xl font-bold (Work Sans)
- Section Headers: text-2xl font-semibold (Work Sans)
- Card Titles: text-lg font-semibold (Inter)
- Body Text: text-base font-normal (Inter)
- Captions/Meta: text-sm font-medium (Inter)
- Data Values: text-3xl font-bold (Inter) for key metrics

## Layout System

**Spacing Scale**: Use Tailwind units of 4, 6, 8, 12, 16, 20 for consistency
- Component padding: p-6 or p-8
- Section spacing: mb-8 or mb-12
- Page margins: px-6 md:px-12
- Grid gaps: gap-6 or gap-8

**Container Strategy**:
- Dashboard/Pages: max-w-7xl mx-auto
- Content sections: max-w-6xl
- Forms/Records: max-w-2xl
- Chat interface: max-w-4xl

## Component Library

### Navigation
**Sidebar** (Desktop):
- Fixed left position, w-64
- Logo at top with compact branding
- Icon + label navigation items with active state highlighting
- Health status indicator at bottom
- Collapsible on tablet

**Top Navbar** (Mobile):
- Full-width with hamburger menu
- User avatar dropdown (right)
- Notification bell icon
- App title/logo (center)

### Dashboard Cards
**Health Metric Cards**:
- Rounded-lg shadow with subtle elevation
- Icon top-left (health-related: heart, activity, sleep)
- Large metric number (text-3xl font-bold)
- Label beneath (text-sm)
- Trend indicator (arrow up/down with percentage)
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

**Activity Feed Card**:
- Timeline-style layout with dots connecting events
- Each item: timestamp, icon, description
- Scrollable with max-h-96

**Quick Access Cards**:
- Large clickable cards (aspect-square or aspect-video)
- Icon centered above title
- Brief description text
- Subtle hover elevation increase

### Forms (Login/Signup/Profile)
- Full-width inputs with clear labels above
- Floating labels for active states
- Input height: h-12
- Rounded-lg borders
- Error messages in text-sm below inputs
- Primary action button: w-full h-12 rounded-lg
- Social login options with icon buttons

### Wearables Sync Interface
**Device Cards**:
- Horizontal layout: device icon left, info center, sync button right
- Connection status badge (connected/disconnected)
- Last sync timestamp
- Sync progress bar when active

**Sync Status Display**:
- Circular progress indicator for active syncs
- Success checkmark animation on completion
- Error state with retry action

### Virtual Health Companion (Chat)
**Chat Container**:
- Full-height interface with header, messages area, input footer
- Messages area: scrollable, pb-20 for input clearance

**Message Bubbles**:
- User messages: right-aligned, rounded-2xl rounded-br-md, max-w-md
- AI responses: left-aligned, rounded-2xl rounded-bl-md, max-w-lg
- Avatar circles (40px) next to AI messages
- Timestamp below each message group (text-xs)
- Suggested questions as pill buttons below AI responses

**Input Area**:
- Fixed bottom with backdrop blur
- Multi-line textarea with auto-grow (max 4 lines)
- Send button (icon) right side
- Microphone icon for voice input (left)

### Analytics & Charts
**Chart Cards**:
- White/surface background with p-8
- Title and time range selector (dropdown) in header
- Chart takes 60% height: h-64 or h-80
- Legend below chart (horizontal pills)
- Use Chart.js library for line, bar, and donut charts
- Health metrics: Line charts for trends, bar for comparisons
- Grid: grid-cols-1 lg:grid-cols-2 for chart pairs

**Metric Comparison Tables**:
- Striped rows for readability
- Bold headers with sort indicators
- Numerical alignment: text-right for numbers
- Status badges for ranges (normal/warning/critical)

### Appointments
**Calendar View**:
- Month grid with appointment dots
- Selected date highlights
- Available time slots as pill buttons
- Grid: 7 columns for weekdays

**Appointment List**:
- Card-based layout with doctor avatar left
- Date/time prominently displayed
- Appointment type badge
- Action buttons: Join (virtual), Reschedule, Cancel
- Upcoming vs. past sections separated

### Digital Records
**File Upload Zone**:
- Dashed border drag-drop area (min-h-48)
- Upload icon and instruction text centered
- File type indicators (PDF, JPEG accepted)
- Progress bars for active uploads

**Records List**:
- Table or card layout with thumbnails
- Document type icons
- File name, date, size information
- Download and view actions
- Category filters as tabs above

## Images

**Dashboard Hero Section**: None - prioritize immediate data visibility

**Login/Signup Pages**: 
- Split-screen layout: form left (w-1/2), image right (w-1/2)
- Image: Modern healthcare setting - doctor consulting with patient using tablet, bright natural lighting, professional but warm atmosphere
- Image should convey trust and technological sophistication

**Virtual Health Companion**: 
- Small banner image above chat (aspect-video, h-32)
- Image: AI assistant visualization - abstract brain network or friendly medical AI interface
- Subtle, non-distracting

**Wearables Page**:
- Header illustration (h-40)
- Image: Collection of modern wearable devices (smartwatch, fitness tracker, health monitor) arranged cleanly
- Shows device ecosystem compatibility

## Responsive Behavior

**Breakpoint Strategy**:
- Mobile-first approach
- md: 768px (tablet) - sidebar collapses, 2-column grids
- lg: 1024px (desktop) - sidebar expands, 3-4 column grids
- xl: 1280px (large desktop) - max-w-7xl containers centered

**Mobile Optimizations**:
- Bottom tab navigation for key pages
- Collapsible sections for long content
- Full-width cards (no multi-column)
- Larger touch targets (min h-12)
- Sticky headers for tables/lists

## Interaction Patterns

**Loading States**:
- Skeleton screens for data-heavy components
- Spinner for quick actions (buttons)
- Progress bars for file uploads/syncs

**Empty States**:
- Centered icon + message + action button
- Encourage first action (e.g., "Connect your first device")

**Error States**:
- Inline validation for forms
- Toast notifications for system errors
- Retry buttons for failed actions

**Success Feedback**:
- Toast notifications for completed actions
- Checkmark animations for confirmations
- Updated data immediately reflected

## Accessibility Requirements

- ARIA labels on all interactive elements
- Keyboard navigation support (tab order logical)
- Focus indicators on all focusable elements
- Screen reader announcements for dynamic content
- Color contrast ratios meet WCAG AA standards
- Form error associations with inputs
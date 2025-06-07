# Splitpad

## aka Notepad with a split

A lightweight, dual-pane markdown editor designed for simultaneous document editing and comparison. 

Built with pure HTML, CSS, and JavaScript, requiring no installation or dependencies beyond a web browser.

[![Netlify Status](https://api.netlify.com/api/v1/badges/a12bf539-02a6-4382-8de8-0b4a26f1b99b/deploy-status)](https://app.netlify.com/projects/ornate-naiad-10cd0b/deploys)

## Overview

The Minimal Markdown Notepad provides a distraction-free writing environment with two independent editing panes, real-time markdown preview, and responsive design that adapts to any screen size. Each pane functions as a complete markdown editor with its own history, preview mode, and document statistics.

## Core Features

### Dual-Pane Editing
- Two independent editing columns work simultaneously
- Each pane maintains its own content, history, and state
- Color-coded interface: left pane (blue accent), right pane (orange accent)
- Adjustable divider between panes for custom sizing
- Smooth transitions and visual feedback during interactions

### Markdown Support
- Full markdown syntax support via marked.js library
- Real-time preview rendering
- Syntax includes:
  - Headers (h1-h6)
  - Bold and italic text
  - Lists (ordered and unordered)
  - Code blocks and inline code
  - Blockquotes
  - Links and images

### Layout Modes
- **Horizontal Layout**: Side-by-side columns (default on desktop)
- **Vertical Layout**: Stacked columns (default on mobile portrait)
- Toggle button (⫼/⫻) instantly switches between layouts
- Layout preference saved in exported documents
- Auto-detection based on screen orientation

### Responsive Design
- Adapts to all screen sizes from mobile to desktop
- Touch-optimized controls for tablets and phones
- Automatic layout switching based on device orientation
- Flexible UI elements that reorganize on smaller screens
- Consistent functionality across all devices

## User Interface

### Header Bar
- **Document Title**: Main document identifier (editable)
- **Toggle Layout Button**: Switch between horizontal/vertical layouts
- **Export Button**: Download current workspace as JSON

### Column Headers
- **Column Title**: Customizable name for each pane
- **Toolbar Buttons**:
  - Clear (⌫): Remove all text (with confirmation)
  - Undo (↺): Revert to previous state
  - Redo (↻): Restore undone changes
  - Preview (◉): Toggle markdown preview mode

### Editor Area
- Syntax-highlighted textarea with custom styling
- Tab key inserts 2 spaces for code indentation
- Auto-sizing to fill available space
- Smooth focus transitions with glow effects

### Status Bar
- Real-time character count
- Word count statistics
- Updates instantly as you type

### Resizable Divider
- Drag to adjust pane sizes
- Visual feedback during resize
- Minimum 10% and maximum 90% size constraints
- Works with both mouse and touch input

## Keyboard Shortcuts

### Text Editing
- **Tab**: Insert 2 spaces (code indentation)
- **Ctrl/Cmd + Z**: Undo last change
- **Ctrl/Cmd + Shift + Z**: Redo undone change
- **Ctrl/Cmd + Y**: Alternative redo command

### Navigation
- Standard text selection and cursor movement
- Multi-cursor editing support (where browser supports)

## Preview Mode

Each pane can independently toggle between edit and preview modes:

### Edit Mode
- Full text editing capabilities
- Syntax highlighting through color theming
- Real-time character and word counting

### Preview Mode
- Rendered markdown output
- Styled typography for headers, lists, and quotes
- Code blocks with syntax highlighting
- Clickable links (open in new tabs)
- Smooth scrolling for long documents

## Data Management

### History System
- Each pane maintains 50 states of undo history
- Automatic history trimming to prevent memory issues
- History preserved during session
- Independent history for each pane

### Export Functionality
- Downloads workspace as structured JSON file
- Filename format: `YYYY-MM-DD_HHMM - document_title.json`
- Includes:
  - Document metadata (title, timestamps)
  - Both column contents
  - Column titles
  - Layout preference
  - Pane size settings

### Import Capability
While not built into the interface, exported JSON files can be manually edited and content copied back into the editor for restoration.

## Performance Optimizations

### Resize Performance
- CSS transitions disabled during active resizing
- Throttled resize events using requestAnimationFrame
- Cached container dimensions
- Optimized DOM updates

### Input Handling
- Debounced save operations
- Throttled preview rendering
- Immediate statistics updates
- Efficient state management

### Memory Management
- Limited history size
- Efficient string operations
- Minimal DOM manipulation
- Optimized event listeners

## Browser Compatibility

### Supported Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Required Features
- ES6 JavaScript support
- CSS Grid and Flexbox
- Local storage API (for future enhancements)
- Touch events (for mobile support)

## Technical Architecture

### Dependencies
- **marked.js**: Markdown parsing and rendering
- No other external dependencies
- Pure vanilla JavaScript
- Modern CSS with CSS variables

### Code Organization
- Single HTML file application
- Inline styles for zero-dependency deployment
- Modular JavaScript functions
- Event-driven architecture

### Styling System
- CSS custom properties for theming
- Responsive breakpoints at 768px, 600px, 480px
- Gradient backgrounds for visual depth
- Consistent spacing using CSS variables

## Use Cases

### Document Comparison
- Compare two versions of the same document
- Review before/after editing changes
- Side-by-side translation work
- Reference documentation while writing

### Note Taking
- Meeting notes with agenda comparison
- Research notes with source material
- Study guides with practice problems
- Technical documentation drafts

### Creative Writing
- Story drafts with character notes
- Poetry with revision history
- Blog posts with outline reference
- Script writing with scene notes

## Tips and Best Practices

### Efficient Workflow
1. Use keyboard shortcuts for faster editing
2. Keep preview mode on in one pane for reference
3. Adjust pane sizes based on content needs
4. Export regularly to maintain backups

### Mobile Usage
1. Use vertical layout for better readability
2. Tap and hold for text selection
3. Use device rotation for layout switching
4. Pinch to zoom if needed (browser feature)

### Performance Tips
1. Clear unused pane content to free memory
2. Avoid extremely large documents (>1MB)
3. Close preview mode when not needed
4. Refresh page if performance degrades

## Customization Options

### Visual Themes
While not exposed in UI, the CSS variables can be modified for custom themes:
- Primary colors
- Background gradients
- Font families
- Spacing values

### Layout Preferences
- Default pane sizes
- Initial layout orientation
- Toolbar positioning
- Status bar information

## Privacy and Security

### Data Storage
- No server communication
- All data remains in browser memory
- No cookies or tracking
- No external API calls

### Export Security
- JSON exports are plain text
- No encryption built-in
- User responsible for file security
- Safe for version control systems

## Known Limitations

### Feature Constraints
- No collaborative editing
- No cloud synchronization
- No automatic saving
- Limited to browser memory capacity

### Browser Limitations
- File API restrictions
- Memory constraints on mobile
- No offline PWA support
- Standard browser text limitations

## Troubleshooting

### Common Issues

**Slow resize performance**
- Clear browser cache
- Close other tabs
- Disable browser extensions

**Preview not rendering**
- Check marked.js loaded
- Verify markdown syntax
- Clear and re-enter text

**Export not working**
- Check browser permissions
- Ensure popup blocker disabled
- Try different browser

**Mobile keyboard issues**
- Rotate device
- Use external keyboard
- Adjust zoom level

### Recovery Methods
1. Copy text to clipboard before clearing
2. Use browser back button to recover
3. Check browser autofill history
4. Restore from JSON export

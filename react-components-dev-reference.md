# React Components & Libraries — Developer Reference

> Curated from [brillout/awesome-react-components](https://github.com/brillout/awesome-react-components)
> 
> **How to use this file:** Each section maps to a UI or code problem you're solving. Every entry shows the package name, a one-line description, and where available: install command, demo link, and docs link. Look for 🚀 for standout picks. Use this as a fast lookup before building anything from scratch.

---

## Table of Contents

- [UI Components](#ui-components)
  - [Data Grid / Spreadsheet](#data-grid--spreadsheet)
  - [Table](#table)
  - [Infinite Scroll & Virtualization](#infinite-scroll--virtualization)
  - [Overlay / Modal / Dialog](#overlay--modal--dialog)
  - [Notification / Toast](#notification--toast)
  - [Tooltip](#tooltip)
  - [Menu / Sidebar](#menu--sidebar)
  - [Sticky / Fixed Headers](#sticky--fixed-headers)
  - [Tabs](#tabs)
  - [Loader / Spinner / Progress](#loader--spinner--progress)
  - [Captcha](#captcha)
  - [Carousel / Slider](#carousel--slider)
  - [Buttons](#buttons)
  - [Collapse / Accordion](#collapse--accordion)
  - [Charts & Data Viz](#charts--data-viz)
  - [Command Palette](#command-palette)
  - [Tree View](#tree-view)
  - [UI Navigation](#ui-navigation)
  - [Custom Scrollbar](#custom-scrollbar)
  - [Audio / Video](#audio--video)
  - [Map](#map)
  - [Time / Date / Age Display](#time--date--age-display)
  - [Photo / Image](#photo--image)
  - [Icons](#icons)
  - [Paginator](#paginator)
  - [Markdown Viewer](#markdown-viewer)
  - [Canvas / Drawing](#canvas--drawing)
  - [Screenshot](#screenshot)
  - [Miscellaneous UI](#miscellaneous-ui)
- [Form Components](#form-components)
  - [Date / Time Picker](#date--time-picker)
  - [Emoji Picker](#emoji-picker)
  - [Input Types / Masking](#input-types--masking)
  - [Autocomplete / Typeahead](#autocomplete--typeahead)
  - [Select](#select)
  - [Color Picker](#color-picker)
  - [Toggle / Switch](#toggle--switch)
  - [Slider](#slider)
  - [Radio Button](#radio-button)
  - [Type Select / Mentions](#type-select--mentions)
  - [Tag Input](#tag-input)
  - [Autosize Input / Textarea](#autosize-input--textarea)
  - [Star Rating](#star-rating)
  - [Drag and Drop](#drag-and-drop)
  - [Sortable List](#sortable-list)
  - [Rich Text Editor](#rich-text-editor)
  - [Markdown Editor](#markdown-editor)
  - [Image Editing](#image-editing)
  - [Form Collections / Schema Forms](#form-collections--schema-forms)
  - [Syntax Highlight](#syntax-highlight)
- [UI Layout](#ui-layout)
- [UI Animation](#ui-animation)
- [UI Frameworks](#ui-frameworks)
- [UI Utilities](#ui-utilities)
  - [Visibility & Measurement](#visibility--measurement)
  - [Device Input](#device-input)
  - [Meta Tags](#meta-tags)
  - [Portal](#portal)
- [Code Design / Architecture](#code-design--architecture)
  - [Data Store / State Management](#data-store--state-management)
  - [Form Logic](#form-logic)
  - [Router](#router)
  - [Server Communication](#server-communication)
  - [CSS-in-JS / Styling](#css-in-js--styling)
  - [Isomorphic / SSR](#isomorphic--ssr)
  - [Boilerplate](#boilerplate)
- [Utilities](#utilities)
  - [i18n / Internationalization](#i18n--internationalization)
  - [Third-Party Integrations](#third-party-integrations)
- [Performance](#performance)
  - [Lazy Load](#lazy-load)
  - [App Size](#app-size)
  - [Server-Side Rendering](#server-side-rendering)
- [Dev Tools](#dev-tools)
  - [Testing](#testing)
  - [Redux DevTools](#redux-devtools)
  - [Inspect / Debug](#inspect--debug)
- [Cloud Solutions](#cloud-solutions)

---

## UI Components

### Data Grid / Spreadsheet

> Use when you need Excel-like grids, inline editing, sorting, filtering, or grouping on large datasets.

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [AG Grid](https://github.com/ag-grid/ag-grid) | Advanced data grid with full feature set — sorting, filtering, grouping, virtual scrolling | `npm i ag-grid-react` | [Docs](https://www.ag-grid.com/react-data-grid/) |
| [MUI X Data Grid](https://github.com/mui/mui-x) | Fast MUI-based grid with advanced power-user features | `npm i @mui/x-data-grid` | [Demo/Docs](https://mui.com/x/react-data-grid/) |
| [Handsontable](https://github.com/handsontable/handsontable) | Spreadsheet-like UI, supports React/Angular/TS/JS | `npm i handsontable @handsontable/react` | [Demo](https://handsontable.com/demo) · [Docs](https://handsontable.com/docs/react-data-grid/) |
| [react-data-grid](https://github.com/adazzle/react-data-grid) | Excel-like grid, lightweight | `npm i react-data-grid` | [GitHub](https://github.com/adazzle/react-data-grid) |
| [fortune-sheet](https://github.com/ruilisi/fortune-sheet) | Online spreadsheet with out-of-the-box Excel features | `npm i fortune-sheet` | [GitHub](https://github.com/ruilisi/fortune-sheet) |
| [ReactGrid](https://github.com/silevis/reactgrid) | Add spreadsheet-like behavior to your app | `npm i @silevis/reactgrid` | [Docs](https://reactgrid.com/docs/) |
| [revo-grid](https://github.com/revolist/revogrid) | Powerful data grid for React/Angular/Vue/Web Components | `npm i @revolist/react-datagrid` | [Demo/Docs](https://revolist.github.io/revogrid/) |
| [SVAR React DataGrid](https://svar.dev/react/datagrid/) | In-cell editing, tree data, context menu, virtual scroll | `npm i wx-react-grid` | [Demo](https://docs.svar.dev/react/grid/samples/#/base/willow) · [Docs](https://docs.svar.dev/react/grid/getting_started/) |
| [SheetXL](https://github.com/sheetxl/sheetxl) | High-performance spreadsheet, Excel-compatible functions | `npm i sheetxl` | [GitHub](https://github.com/sheetxl/sheetxl) |

---

### Table

> Use for displaying structured data with sorting, filtering, pagination, and expandable rows — without full spreadsheet behavior.

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [TanStack Table](https://github.com/tannerlinsley/react-table) | Headless UI for powerful tables & datagrids — build your own UI on top | `npm i @tanstack/react-table` | [Demo](https://tanstack.com/table/v8/docs/examples/react/basic) |
| [material-table](https://github.com/mbrn/material-table) | Material UI base with grouping, tree data, export, inline edit | `npm i material-table` | [Demo/Docs](https://material-table.com/) |
| [react-data-table](https://github.com/jbetancur/react-data-table-component) | Accessible, responsive, themable with sorting, expandable rows, pagination | `npm i react-data-table-component` | [Demo/Docs](https://jbetancur.github.io/react-data-table-component/?) |
| [mantine-datatable](https://github.com/icflorescu/mantine-datatable) | Lightweight Mantine UI table with lots of features | `npm i mantine-datatable` | [Demo/Docs](https://icflorescu.github.io/mantine-datatable/) |
| [mui-datatables](https://github.com/gregnb/mui-datatables) | Material UI: search, styling, filter, resize/hide columns, export | `npm i mui-datatables` | [GitHub](https://github.com/gregnb/mui-datatables) |
| [ka-table](https://github.com/komarovalexander/ka-table) | Sorting, filtering, grouping, virtualization, editing | `npm i ka-table` | [Demo](https://komarovalexander.github.io/ka-table/#/overview) |
| [react-table-library](https://github.com/table-library/react-table-library) | Almost headless table library for building better tables | `npm i @table-library/react-table-library` | [Demo](https://react-table-library.com/) |
| [rsuite-table](https://github.com/rsuite/rsuite-table) | Table component that supports virtualized rendering | `npm i rsuite-table` | [Demo/Docs](http://rsuite.github.io/rsuite-table/) |
| [Material-React-Table](https://github.com/KevinVandy/material-react-table) | Full-featured MUI V5 implementation of TanStack React Table V8 | `npm i material-react-table` | [GitHub](https://github.com/KevinVandy/material-react-table) |
| [simple-table](https://github.com/petera2c/simple-table) | Lightweight, fast: sorting/filtering, virtualization, tree data, pinned columns | `npm i @petera2c/simple-table` | [Demo](https://www.simple-table.com/examples) · [Docs](https://www.simple-table.com/docs) |

---

### Infinite Scroll & Virtualization

> Use when rendering large lists or grids where you need to only render visible items for performance.

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-window](https://github.com/bvaughn/react-window) | Efficiently render large lists and tabular data | `npm i react-window` | [Demo](https://react-window.now.sh/) |
| [virtua](https://github.com/inokawa/virtua) | Zero-config, fast, ~3kB virtual list for React/Vue/Solid | `npm i virtua` | [Demo](https://inokawa.github.io/virtua/) |
| [@af-utils/virtual](https://github.com/nowaalex/af-utils) | Render large scrollable lists and grids | `npm i @af-utils/virtual-react` | [Demo/Docs](https://af-utils.com/virtual) |
| [react-list](https://github.com/orgsync/react-list) | Versatile infinite scroll component | `npm i react-list` | [GitHub](https://github.com/orgsync/react-list) |
| [react-lazyload](https://github.com/jasonslyvia/react-lazyload) | Lazyload components, images — anything where performance matters | `npm i react-lazyload` | [GitHub](https://github.com/jasonslyvia/react-lazyload) |
| [@egjs/react-infinitegrid](https://github.com/naver/egjs-infinitegrid) | Arrange card elements infinitely with various layout types | `npm i @egjs/react-infinitegrid` | [Demo](https://naver.github.io/egjs-infinitegrid/storybook/) |

---

### Overlay / Modal / Dialog

> Display modal dialogs, lightboxes, popups, or alerts.

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [sweetalert2](https://github.com/sweetalert2/sweetalert2) | Beautiful, responsive, accessible replacement for JS popup boxes. Zero deps. | `npm i sweetalert2` | [Demo/Docs](https://sweetalert2.github.io/) |
| [react-modal](https://github.com/reactjs/react-modal) | Accessible modal dialog for React | `npm i react-modal` | [GitHub](https://github.com/reactjs/react-modal) |
| [react-aria-modal](https://github.com/davidtheclark/react-aria-modal) | Fully accessible, flexible modal per WAI-ARIA practices | `npm i react-aria-modal` | [GitHub](https://github.com/davidtheclark/react-aria-modal) |
| [sweetalert2-react-content](https://github.com/sweetalert2/sweetalert2-react-content) | Official SweetAlert2 enhancer for React element content | `npm i sweetalert2-react-content` | [GitHub](https://github.com/sweetalert2/sweetalert2-react-content) |
| [reoverlay](https://github.com/hiradary/reoverlay) | The missing solution for managing modals | `npm i reoverlay` | [Demo](https://hiradary.github.io/reoverlay/) |
| [@paratco/async-modal](https://github.com/Paratco/async-modal) | Simple async/promise-based modal handler | `npm i @paratco/async-modal` | [GitHub](https://github.com/Paratco/async-modal) |

---

### Notification / Toast

> Show temporary, non-blocking messages (toasters, snackbars).

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-toastify](https://github.com/fkhadra/react-toastify) | Best-in-class toast. Hooks support, no refs needed. | `npm i react-toastify` | [Demo](https://fkhadra.github.io/react-toastify/) |
| [react-hot-toast](https://github.com/timolins/react-hot-toast) | Lightweight, customizable, beautiful by default | `npm i react-hot-toast` | [Demo](https://react-hot-toast.com/) |
| [Sonner](https://sonner.emilkowal.ski/) | Opinionated, minimal toast for React | `npm i sonner` | [Demo](https://sonner.emilkowal.ski/) |
| [notistack](https://iamhosseindhv.com/notistack) | Stackable, highly customizable snackbar notifications | `npm i notistack` | [Demo](https://codesandbox.io/s/github/iamhosseindhv/notistack/tree/master/examples/simple-example) · [Docs](https://iamhosseindhv.com/notistack/api) |
| [react-notifications-component](https://github.com/teodosii/react-notifications-component) | Highly customizable notification component | `npm i react-notifications-component` | [Demo](https://teodosii.github.io/react-notifications-component/) |
| [react-local-toast](https://github.com/OlegWock/react-local-toast) | Feedback linked to a particular component, not app-wide | `npm i react-local-toast` | [Demo](https://react-local-toast.netlify.app/showcase/) · [Docs](https://react-local-toast.netlify.app/tutorial) |
| [reapop](https://github.com/LouisBarranqueiro/reapop) | React + Redux notifications system | `npm i reapop` | [GitHub](https://github.com/LouisBarranqueiro/reapop) |
| [react-confirm-lite](https://github.com/SaadNasir-git/react-confirm-lite) | Lightweight promise-based confirmation dialog with Tailwind support | `npm i react-confirm-lite` | [Demo](https://stackblitz.com/edit/vitejs-vite-bfthlpmw) |

---

### Tooltip

| Package | Description | Install | Links |
|---|---|---|---|
| [react-tooltip](https://github.com/wwayne/react-tooltip) | React tooltip component | `npm i react-tooltip` | [GitHub](https://github.com/wwayne/react-tooltip) |

---

### Menu / Sidebar

> Off-canvas menus, sidebars, navigation drawers, context menus.

| Package | Description | Install | Links |
|---|---|---|---|
| [react-burger-menu](https://github.com/negomi/react-burger-menu) | Off-canvas sidebar with effects and styles | `npm i react-burger-menu` | [GitHub](https://github.com/negomi/react-burger-menu) |
| [hamburger-react](https://github.com/luukdv/hamburger-react) | Animated hamburger menu icons | `npm i hamburger-react` | [Demo/Docs](https://hamburger-react.netlify.app/) |
| [react-offcanvas](https://github.com/vutran/react-offcanvas) | Off-canvas menus | `npm i react-offcanvas` | [GitHub](https://github.com/vutran/react-offcanvas) |
| [react-planet](https://github.com/innFactory/react-planet) | Circular menus that look like planets | `npm i react-planet` | [Demo](https://innfactory.github.io/react-planet/) |
| [mantine-contextmenu](https://github.com/icflorescu/mantine-contextmenu) | Context-menu hook/component for Mantine UI | `npm i mantine-contextmenu` | [Demo/Docs](https://icflorescu.github.io/mantine-contextmenu/) |

---

### Sticky / Fixed Headers

| Package | Description | Install | Links |
|---|---|---|---|
| [react-headroom](https://github.com/KyleAMathews/react-headroom) | Hide your header until you need it | `npm i react-headroom` | [GitHub](https://github.com/KyleAMathews/react-headroom) |
| [react-stickynode](https://github.com/yahoo/react-stickynode) | Performant and comprehensive sticky | `npm i react-stickynode` | [GitHub](https://github.com/yahoo/react-stickynode) |

---

### Tabs

| Package | Description | Install | Links |
|---|---|---|---|
| [react-tabs](https://github.com/reactjs/react-tabs) | React tabs component | `npm i react-tabs` | [GitHub](https://github.com/reactjs/react-tabs) |
| [react-tabtab](https://github.com/ctxhou/react-tabtab) | React tabs with drag-and-drop tab reorder | `npm i react-tabtab` | [GitHub](https://github.com/ctxhou/react-tabtab) |

---

### Loader / Spinner / Progress

| Package | Description | Install | Links |
|---|---|---|---|
| [react-content-loader](https://github.com/danilowoz/react-content-loader) | SVG-powered skeleton/placeholder loading (like Facebook cards) | `npm i react-content-loader` | [GitHub](https://github.com/danilowoz/react-content-loader) |
| [react-spinners](https://github.com/davidhu2000/react-spinners) | Collection of loading spinner components | `npm i react-spinners` | [GitHub](https://github.com/davidhu2000/react-spinners) |
| [react-loader-spinner](https://github.com/mhnpd/react-loader-spinner) | Collection of spinners for async operations | `npm i react-loader-spinner` | [GitHub](https://github.com/mhnpd/react-loader-spinner) |
| [react-spinners-css](https://github.com/JoshK2/react-spinners-css) | CSS-based spinner components | `npm i react-spinners-css` | [GitHub](https://github.com/JoshK2/react-spinners-css) |
| [react-redux-loading-bar](https://github.com/mironov/react-redux-loading-bar) | Simple loading bar for Redux/React | `npm i react-redux-loading-bar` | [GitHub](https://github.com/mironov/react-redux-loading-bar) |

---

### Captcha

| Package | Description | Install | Links |
|---|---|---|---|
| [react-simple-captcha](https://github.com/masroorejaz/react-simple-captcha) | Powerful, customizable captcha | `npm i react-simple-captcha` | [npm](https://www.npmjs.com/package/react-simple-captcha) |
| [procaptcha](https://github.com/prosopo/captcha) | Privacy-focused free CAPTCHA | `npm i @prosopo/procaptcha-react` | [Demo](https://prosopo.io/) · [Docs](https://docs.prosopo.io/) |

---

### Carousel / Slider

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [swiper](https://github.com/nolimits4web/Swiper) | Modern mobile touch slider with hardware acceleration | `npm i swiper` | [Demo](https://swiperjs.com/demos) · [Docs](https://swiperjs.com/react) |
| [keen-slider](https://github.com/rcbyr/keen-slider) | Performant carousel/slider with native touch/swipe | `npm i keen-slider` | [Demo](https://keen-slider.io/examples/#examples) |
| [react-responsive-carousel](https://github.com/leandrowd/react-responsive-carousel) | Responsive carousel with swipe | `npm i react-responsive-carousel` | [GitHub](https://github.com/leandrowd/react-responsive-carousel) |
| [react-slick](https://github.com/akiran/react-slick) | React carousel component | `npm i react-slick` | [GitHub](https://github.com/akiran/react-slick) |
| [@egjs/react-flicking](https://github.com/naver/egjs-flicking) | Reliable, flexible, extendable carousel | `npm i @egjs/react-flicking` | [Demo](https://naver.github.io/egjs-flicking/) |
| [react-awesome-slider](https://github.com/rcaferati/react-awesome-slider) | Fullpage, 3D animated, 60fps media/content slider | `npm i react-awesome-slider` | [Demo](https://fullpage.caferati.me/) |
| [pure-react-carousel](https://github.com/express-labs/pure-react-carousel) | Built from scratch, not opinionated | `npm i pure-react-carousel` | [GitHub](https://github.com/express-labs/pure-react-carousel) |

---

### Buttons

| Package | Description | Install | Links |
|---|---|---|---|
| [react-awesome-button](https://github.com/rcaferati/react-awesome-button) | 3D animated 60fps buttons with load progress and social share | `npm i react-awesome-button` | [Demo](https://caferati.me/demo/react-awesome-button) |
| [reactive-button](https://github.com/arifszn/reactive-button) | Animated button with progress indicator | `npm i reactive-button` | [Demo](https://arifszn.github.io/reactive-button/docs/playground) · [Docs](https://arifszn.github.io/reactive-button) |

---

### Collapse / Accordion

| Package | Description | Install | Links |
|---|---|---|---|
| [react-accessible-accordion](https://github.com/springload/react-accessible-accordion) | Accessible accordion for React | `npm i react-accessible-accordion` | [GitHub](https://github.com/springload/react-accessible-accordion) |
| [react-collapse](https://github.com/nkbt/react-collapse) | Collapse animation with react-motion | `npm i react-collapse` | [GitHub](https://github.com/nkbt/react-collapse) |
| [react-tabbordion](https://github.com/Merri/react-tabbordion) | Universal, semantic, CSS-only accordions and tabs | `npm i react-tabbordion` | [Demo](https://merri.github.io/react-tabbordion) |

---

### Charts & Data Viz

> Render charts, graphs, diagrams, Gantt charts.

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [recharts](https://github.com/recharts/recharts) | Redefined chart library with React and D3 — most popular | `npm i recharts` | [GitHub](https://github.com/recharts/recharts) |
| [victory](https://github.com/FormidableLabs/victory) | Data viz for React, composable | `npm i victory` | [GitHub](https://github.com/FormidableLabs/victory) |
| [echarts for react](https://github.com/hustcc/echarts-for-react) | Wrapper around Apache ECharts | `npm i echarts-for-react echarts` | [GitHub](https://github.com/hustcc/echarts-for-react) |
| [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2) | React wrapper for Chart.js 2.0 | `npm i react-chartjs-2 chart.js` | [GitHub](https://github.com/jerairrest/react-chartjs-2) |
| [react-vis](https://github.com/uber/react-vis) | Data visualization based on React + D3 (Uber) | `npm i react-vis` | [GitHub](https://github.com/uber/react-vis) |
| [react-google-charts](https://github.com/RakanNimer/react-google-charts) | React wrapper for Google Charts | `npm i react-google-charts` | [GitHub](https://github.com/RakanNimer/react-google-charts) |
| [react-highcharts](https://github.com/kirjs/react-highcharts) | React wrapper for Highcharts | `npm i react-highcharts` | [GitHub](https://github.com/kirjs/react-highcharts) |
| [react-d3-components](https://github.com/codesuki/react-d3-components) | D3 components for React | `npm i react-d3-components` | [GitHub](https://github.com/codesuki/react-d3-components) |
| [react-sparklines](https://github.com/borisyankov/react-sparklines) | Beautiful and expressive sparklines | `npm i react-sparklines` | [GitHub](https://github.com/borisyankov/react-sparklines) |
| [react-charty](https://github.com/99ff00/react-charty) | Small but powerful interactive viz with zoom and theming | `npm i react-charty` | [Demo](https://99ff00.github.io/react-charty/) |
| [EazyChart](https://github.com/Hexastack/eazychart) | Easily transform data into charts | `npm i eazychart-react` | [Demo](https://docs.eazychart.com/#demos) · [Docs](https://docs.eazychart.com) |
| [semiotic](https://semiotic.nteract.io/) | Data visualization framework for React | `npm i semiotic` | [Docs](https://semiotic.nteract.io/) |
| [SVAR React Gantt](https://svar.dev/react/gantt/) | Customizable, interactive Gantt chart | `npm i wx-react-gantt` | [Demo](https://docs.svar.dev/react/gantt/samples/#/base/willow) · [Docs](https://docs.svar.dev/react/gantt/getting_started/) |
| [Flowchart React](https://github.com/joyceworks/flowchart-react) | Flowchart & flowchart designer | `npm i flowchart-react` | [GitHub](https://github.com/joyceworks/flowchart-react) |

---

### Command Palette

| Package | Description | Install | Links |
|---|---|---|---|
| [cmdk](https://cmdk.paco.me/) | Fast, composable, unstyled command menu | `npm i cmdk` | [Demo](https://cmdk.paco.me/) |
| [kbar](https://github.com/timc1/kbar) | Fast, portable, extensible cmd+k interface | `npm i kbar` | [Demo](https://kbar.vercel.app) |

---

### Tree View

> Display hierarchical/tree data structures.

| Package | Description | Install | Links |
|---|---|---|---|
| [react-arborist](https://github.com/brimdata/react-arborist) | Full-featured: headless, virtualized, multi-select, DnD, keyboard nav | `npm i react-arborist` | [Demo](https://react-arborist.netlify.app/) |
| [react-complex-tree](https://github.com/lukasbach/react-complex-tree) | Unopinionated, accessible: multi-select, drag-and-drop, search | `npm i react-complex-tree` | [Demo](https://rct.lukasbach.com/) · [Docs](https://rct.lukasbach.com/docs/getstarted) |
| [json-edit-react](https://github.com/CarlosNZ/json-edit-react) | JSON/Object tree viewer and editor | `npm i json-edit-react` | [Demo](https://carlosnz.github.io/json-edit-react/) |
| [he-tree-react](https://github.com/phphe/he-tree-react) | Flat data, tree data, DnD, foldable, checkbox, virtualized | `npm i he-tree-react` | [Demo](https://he-tree-react.phphe.com/v1/examples) · [Docs](https://he-tree-react.phphe.com/) |

---

### UI Navigation

| Package | Description | Install | Links |
|---|---|---|---|
| [react-scroll](https://github.com/fisshy/react-scroll) | Scroll navigation component | `npm i react-scroll` | [GitHub](https://github.com/fisshy/react-scroll) |
| [react-swipeable-views](https://github.com/oliviertassinari/react-swipeable-views) | Binded tabs and swipeable views | `npm i react-swipeable-views` | [GitHub](https://github.com/oliviertassinari/react-swipeable-views) |

---

### Custom Scrollbar

| Package | Description | Install | Links |
|---|---|---|---|
| [rc-scrollbars](https://github.com/sakhnyuk/rc-scrollbars) | Customizable scrollbars with flex options, 60fps | `npm i rc-scrollbars` | [Demo](https://rc-scrollbars.vercel.app/) |
| [react-custom-scroll](https://github.com/rommguy/react-custom-scroll) | Customizable browser scrollbar with native OS behavior | `npm i react-custom-scroll` | [Demo](http://rommguy.github.io/react-custom-scroll/example/demo.html) |
| [react-shadow-scroll](https://github.com/andrelmlins/react-shadow-scroll) | Customizes image and inserts shadow when scroll exists | `npm i react-shadow-scroll` | [GitHub](https://github.com/andrelmlins/react-shadow-scroll) |

---

### Audio / Video

| Package | Description | Install | Links |
|---|---|---|---|
| [react-player](https://github.com/CookPete/react-player) | Play YouTube, Vimeo, SoundCloud, and more URLs | `npm i react-player` | [GitHub](https://github.com/CookPete/react-player) |
| [video-react](https://github.com/video-react/video-react) | HTML5 video player built with React | `npm i video-react` | [GitHub](https://github.com/video-react/video-react) |
| [react-youtube](https://github.com/troybetz/react-youtube) | React-powered YouTube player | `npm i react-youtube` | [GitHub](https://github.com/troybetz/react-youtube) |
| [react-soundplayer](https://github.com/soundblogs/react-soundplayer) | Custom SoundCloud players | `npm i react-soundplayer` | [GitHub](https://github.com/soundblogs/react-soundplayer) |
| [react-dailymotion](https://github.com/u-wave/react-dailymotion) | Dailymotion player component | `npm i react-dailymotion` | [GitHub](https://github.com/u-wave/react-dailymotion) |
| [material-ui-audio-player](https://github.com/Werter12/material-ui-audio-player) | Audio player for Material UI | `npm i material-ui-audio-player` | [GitHub](https://github.com/Werter12/material-ui-audio-player) |
| [react-vision-camera](https://github.com/xulihang/react-vision-camera) | Camera component for computer vision tasks | `npm i react-vision-camera` | [GitHub](https://github.com/xulihang/react-vision-camera) |
| [react-barcode-qrcode-scanner](https://github.com/xulihang/react-barcode-qrcode-scanner) | Barcode and QR code scanner | `npm i react-barcode-qrcode-scanner` | [GitHub](https://github.com/xulihang/react-barcode-qrcode-scanner) |

---

### Map

| Package | Description | Install | Links |
|---|---|---|---|
| [react-leaflet](https://github.com/PaulLeCam/react-leaflet) | React components for Leaflet maps | `npm i react-leaflet leaflet` | [GitHub](https://github.com/PaulLeCam/react-leaflet) |
| [react-map-gl](https://github.com/uber/react-map-gl) | React wrapper for MapboxGL-js | `npm i react-map-gl` | [GitHub](https://github.com/uber/react-map-gl) |
| [google-map-react](https://github.com/istarkov/google-map-react) | Universal Google Map — render React components on map | `npm i google-map-react` | [GitHub](https://github.com/istarkov/google-map-react) |
| [pigeon-maps](https://github.com/mariusandra/pigeon-maps) | ReactJS Maps without external dependencies | `npm i pigeon-maps` | [Demo](https://pigeon-maps.js.org/) |
| [react-geosuggest](https://github.com/ubilabs/react-geosuggest) | Google Maps Places API autosuggest | `npm i react-geosuggest` | [GitHub](https://github.com/ubilabs/react-geosuggest) |
| [react-svg-map](https://github.com/VictorCazanave/react-svg-map) | Interactive SVG map components | `npm i react-svg-map` | [Demo](https://victorcazanave.github.io/react-svg-map/) |
| [mapkit](https://github.com/1amageek/mapkit) | Apple Maps via MapKit JS | `npm i mapkit` | [GitHub](https://github.com/1amageek/mapkit) |

---

### Time / Date / Age Display

| Package | Description | Install | Links |
|---|---|---|---|
| [react-timeago](https://github.com/nmn/react-timeago) | Simple time-ago component | `npm i react-timeago` | [GitHub](https://github.com/nmn/react-timeago) |
| [timeago-react](https://github.com/hustcc/timeago-react) | Format date with "X time ago" string | `npm i timeago-react` | [GitHub](https://github.com/hustcc/timeago-react) |
| [react-google-flight-datepicker](https://github.com/JSLancerTeam/react-google-flight-datepicker) | Google Flight-style date picker | `npm i react-google-flight-datepicker` | [GitHub](https://github.com/JSLancerTeam/react-google-flight-datepicker) |

---

### Photo / Image

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [lightGallery](https://github.com/sachinchoolur/lightGallery) | Full-featured lightbox gallery | `npm i lightgallery` | [Demo](https://www.lightgalleryjs.com/) · [Docs](https://www.lightgalleryjs.com/docs/react/) |
| [yet-another-react-lightbox](https://github.com/igordanchenko/yet-another-react-lightbox) | Clean, modern lightbox component | `npm i yet-another-react-lightbox` | [Demo](https://yet-another-react-lightbox.com/examples) · [Docs](https://yet-another-react-lightbox.com/documentation) |
| [react-photo-album](https://github.com/igordanchenko/react-photo-album) | Responsive photo gallery | `npm i react-photo-album` | [Demo](https://react-photo-album.com/examples) · [Docs](https://react-photo-album.com/documentation) |
| [react-image-gallery](https://github.com/xiaolin/react-image-gallery) | Responsive image gallery, carousel, slider | `npm i react-image-gallery` | [GitHub](https://github.com/xiaolin/react-image-gallery) |
| [react-compare-image](https://github.com/junkboy0315/react-compare-image) | Slider to compare two images | `npm i react-compare-image` | [Demo](https://react-compare-image.yuuniworks.com/) |
| [react-particle-image](https://github.com/malerba118/react-particle-image) | Render images as interactive particles | `npm i react-particle-image` | [Demo](https://malerba118.github.io/react-particle-image-demo/) |
| [react-svg-pan-zoom](https://github.com/chrvadala/react-svg-pan-zoom) | Pan and zoom features for SVG | `npm i react-svg-pan-zoom` | [GitHub](https://github.com/chrvadala/react-svg-pan-zoom) |
| [zoom-image](https://github.com/willnguyen1312/zoom-image) | Framework-agnostic zoom image library | `npm i @zoom-image/react` | [Demo](https://willnguyen1312.github.io/zoom-image/examples/react.html) · [Docs](https://willnguyen1312.github.io/zoom-image) |
| [react-imgix](https://github.com/imgix/react-imgix) | Fast, responsive images via Imgix | `npm i react-imgix` | [GitHub](https://github.com/imgix/react-imgix) |

---

### Icons

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-icons](https://github.com/gorangajic/react-icons) | SVG icons from all popular icon packs via ES6 imports | `npm i react-icons` | [GitHub](https://github.com/gorangajic/react-icons) |
| [Lucide](https://github.com/lucide-icons/lucide) | Beautiful, consistent icon toolkit — fork of Feather Icons | `npm i lucide-react` | [GitHub](https://github.com/lucide-icons/lucide) |
| [iconify-react](https://github.com/iconify/iconify-react) | 40k+ icons from 50+ sets | `npm i @iconify/react` | [GitHub](https://github.com/iconify/iconify-react) |
| [tabler-icons-react](https://tabler-icons-react.vercel.app) | 450+ free MIT-licensed SVG icons | `npm i @tabler/icons-react` | [Demo](https://tabler-icons-react.vercel.app) |
| [react-icomoon](https://github.com/aykutkardas/react-icomoon) | Use IcoMoon-selected icons in React | `npm i react-icomoon` | [GitHub](https://github.com/aykutkardas/react-icomoon) |
| [react-open-doodles](https://github.com/lunahq/react-open-doodles) | Free illustrations as React components | `npm i react-open-doodles` | [GitHub](https://github.com/lunahq/react-open-doodles) |

---

### Paginator

| Package | Description | Install | Links |
|---|---|---|---|
| [react-paginate](https://github.com/AdeleD/react-paginate) | Pagination component for React | `npm i react-paginate` | [GitHub](https://github.com/AdeleD/react-paginate) |
| [react-laravel-paginex](https://github.com/lionix-team/react-laravel-paginex) | Laravel pagination with React (customizable) | `npm i react-laravel-paginex` | [GitHub](https://github.com/lionix-team/react-laravel-paginex) |
| [paginated](https://github.com/makotot/paginated) | Render props & hook to build pagination | `npm i paginated` | [GitHub](https://github.com/makotot/paginated) |
| [react-steps](https://github.com/tkwant/react-steps) | Responsive stepper component | `npm i react-steps` | [Demo](https://stepper.tkwant.de/) |

---

### Markdown Viewer

| Package | Description | Install | Links |
|---|---|---|---|
| [react-markdown](https://github.com/rexxars/react-markdown) | Render Markdown as React components | `npm i react-markdown` | [GitHub](https://github.com/rexxars/react-markdown) |

---

### Canvas / Drawing

| Package | Description | Install | Links |
|---|---|---|---|
| [react-konva](https://github.com/konvajs/react-konva) | Complex canvas graphics with Konva Framework bindings | `npm i react-konva konva` | [GitHub](https://github.com/konvajs/react-konva) |
| [react-sketch-canvas](https://github.com/vinothpandian/react-sketch-canvas) | Freehand SVG drawing — mouse, touch, tablet support | `npm i react-sketch-canvas` | [Demo](https://vinoth.info/react-sketch-canvas/?path=/story/*) |
| [react-sketch](https://github.com/tbolis/react-sketch) | Sketch tool backed by FabricJS | `npm i react-sketch` | [GitHub](https://github.com/tbolis/react-sketch) |
| [react-heat-map](https://github.com/uiwjs/react-heat-map) | Calendar heatmap on SVG (like GitHub contribution graph) | `npm i @uiw/react-heat-map` | [GitHub](https://github.com/uiwjs/react-heat-map) |

---

### Screenshot

| Package | Description | Install | Links |
|---|---|---|---|
| [html2canvas](https://github.com/niklasvh/html2canvas) | Take screenshots of any part of your web page with JS | `npm i html2canvas` | [GitHub](https://github.com/niklasvh/html2canvas) |

---

### Miscellaneous UI

| Package | Description | Install | Links |
|---|---|---|---|
| [puck](https://github.com/measuredco/puck) | Self-hosted visual editor for React | `npm i @measured/puck` | [Demo](https://puck-editor-demo.vercel.app/edit) |
| [react-joyride](https://github.com/gilbarbara/react-joyride) | Walkthroughs and guided tours for React apps | `npm i react-joyride` | [GitHub](https://github.com/gilbarbara/react-joyride) |
| [react-pdf](https://github.com/wojtekmaj/react-pdf) | Display PDFs in React as easily as images | `npm i react-pdf` | [GitHub](https://github.com/wojtekmaj/react-pdf) |
| [react-pdf-viewer](https://github.com/phuoc-ng/react-pdf-viewer) | PDF document viewer component | `npm i @react-pdf-viewer/core` | [Docs](https://react-pdf-viewer.dev) |
| [react-resizable-and-movable](https://github.com/bokuweb/react-resizable-and-movable) | Resizable and movable component | `npm i react-resizable-and-movable` | [GitHub](https://github.com/bokuweb/react-resizable-and-movable) |
| [react-split-pane](https://github.com/tomkp/react-split-pane) | Split-pane component | `npm i react-split-pane` | [GitHub](https://github.com/tomkp/react-split-pane) |
| [react-swipeable-list](https://github.com/marekrozmus/react-swipeable-list) | List with swipeable items (like iOS delete) | `npm i react-swipeable-list` | [Demo](https://marekrozmus.github.io/react-swipeable-list/) |
| [react-awesome-query-builder](https://github.com/ukrbublik/react-awesome-query-builder) | Visual query builder with SQL/MongoDB/JSON export | `npm i react-awesome-query-builder` | [Demo](https://ukrbublik.github.io/react-awesome-query-builder/) |
| [react-darkreader](https://github.com/Turkyden/react-darkreader) | Dark/night mode hook inspired by DarkReader | `npm i react-darkreader` | [GitHub](https://github.com/Turkyden/react-darkreader) |
| [react-apple-signin-auth](https://github.com/A-Tokyo/react-apple-signin-auth) | Apple Sign-In using official Apple JS SDK | `npm i react-apple-signin-auth` | [GitHub](https://github.com/A-Tokyo/react-apple-signin-auth) |
| [react-headings](https://github.com/alexnault/react-headings) | Auto-increment HTML headings for accessibility/SEO | `npm i react-headings` | [GitHub](https://github.com/alexnault/react-headings) |
| [react-simple-chatbot](https://github.com/LucasBassetti/react-simple-chatbot) | Simple chatbot/conversation chat | `npm i react-simple-chatbot` | [GitHub](https://github.com/LucasBassetti/react-simple-chatbot) |
| [@restpace/schema-form](https://github.com/restspace/schema-form) | Build complex forms automatically from JSON Schema | `npm i @restspace/schema-form` | [Demo](https://restspace.io/react/schema-form/demo) |
| [react-advanced-news-ticker](https://github.com/ahmetcanaydemir/react-advanced-news-ticker) | Flexible animated vertical news ticker | `npm i react-advanced-news-ticker` | [Demo](https://www.ahmetcanaydemir.com/react-advanced-news-ticker/) |

---

## Form Components

### Date / Time Picker

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-datepicker](https://github.com/Hacker0x01/react-datepicker) | Simple, reusable date picker | `npm i react-datepicker` | [GitHub](https://github.com/Hacker0x01/react-datepicker) |
| [react-big-calendar](https://github.com/intljusticemission/react-big-calendar) | GCal/Outlook-like calendar component | `npm i react-big-calendar` | [GitHub](https://github.com/intljusticemission/react-big-calendar) |
| [react-day-picker](https://github.com/gpbl/react-day-picker) | Flexible date picker | `npm i react-day-picker` | [GitHub](https://github.com/gpbl/react-day-picker) |
| [react-calendar](https://github.com/wojtekmaj/react-calendar) | Ultimate calendar for React | `npm i react-calendar` | [GitHub](https://github.com/wojtekmaj/react-calendar) |
| [react-date-picker](https://github.com/wojtekmaj/react-date-picker) | Date picker for React | `npm i react-date-picker` | [GitHub](https://github.com/wojtekmaj/react-date-picker) |
| [react-timezone-select](https://github.com/ndom91/react-timezone-select) | Dynamic timezone select based on react-select | `npm i react-timezone-select` | [Demo](https://ndom91.github.io/react-timezone-select/) |
| [react-flatpickr](https://github.com/coderhaoxin/react-flatpickr) | Flatpickr date/time picker for React | `npm i react-flatpickr` | [GitHub](https://github.com/coderhaoxin/react-flatpickr) |
| [schedule-x](https://github.com/schedule-x/schedule-x) | Material design event calendar and date picker | `npm i @schedule-x/react` | [Demo](https://schedule-x.dev/) |
| [date-range-picker](https://github.com/almogtavor/date-range-picker) | Calendar supporting date, range, and ranges picks | `npm i @almogtavor/date-range-picker` | [Demo](https://almogtavor.github.io/date-range-picker/) |
| [react-simple-timefield](https://github.com/antonfisher/react-simple-timefield) | Simple time input field | `npm i react-simple-timefield` | [Demo](https://antonfisher.com/react-simple-timefield/) |

---

### Emoji Picker

| Package | Description | Install | Links |
|---|---|---|---|
| [interweave-emoji-picker](https://github.com/milesj/interweave/tree/master/packages/emoji-picker) | Emoji picker powered by Interweave and Emojibase | `npm i interweave-emoji` | [GitHub](https://github.com/milesj/interweave) |

---

### Input Types / Masking

> Masked inputs, email, phone number, credit card input handling.

| Package | Description | Install | Links |
|---|---|---|---|
| [react-input-mask](https://github.com/sanniassin/react-input-mask) | Input masking for React | `npm i react-input-mask` | [Demo](http://sanniassin.github.io/react-input-mask/demo.html) |
| [react-credit-cards](https://github.com/amarofashion/react-credit-cards) | Beautiful credit card form components | `npm i react-credit-cards` | [GitHub](https://github.com/amarofashion/react-credit-cards) |
| [react-payment-inputs](https://github.com/medipass/react-payment-inputs) | Zero-dependency payment card input fields container | `npm i react-payment-inputs` | [Demo](https://medipass.github.io/react-payment-inputs/?path=/story/usepaymentinputs--basic-no-styles) |
| [react-multi-email](https://github.com/axisj/react-multi-email) | Format multiple emails as the user types | `npm i react-multi-email` | [Demo](https://react-multi-email.vercel.app/) |
| [react-numpad](https://github.com/gpietro/react-numpad) | Extensible number pad for numbers, dates, times | `npm i react-numpad` | [Demo](https://gpietro.github.io/react-numpad-demo/) |
| [@lunasec/react-sdk](https://github.com/lunasec-io/lunasec) | Secure form components that encrypt/tokenize data | `npm i @lunasec/react-sdk` | [Docs](https://www.lunasec.io/docs/) |

---

### Autocomplete / Typeahead

| Package | Description | Install | Links |
|---|---|---|---|
| [react-autosuggest](https://github.com/moroshko/react-autosuggest) | WAI-ARIA compliant autosuggest | `npm i react-autosuggest` | [GitHub](https://github.com/moroshko/react-autosuggest) |
| [react-typeahead](https://github.com/fmoo/react-typeahead) | Pure React typeahead and tokenizer | `npm i react-typeahead` | [GitHub](https://github.com/fmoo/react-typeahead) |

---

### Select

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-select](https://github.com/JedWatson/react-select) | The standard React select control — flexible and powerful | `npm i react-select` | [GitHub](https://github.com/JedWatson/react-select) |
| [react-functional-select](https://github.com/based-ghost/react-functional-select) | Micro-optimized select component | `npm i react-functional-select` | [Demo](https://based-ghost.github.io/react-functional-select/) |
| [react-select-search](https://github.com/tbleckert/react-select-search) | Lightweight select with search | `npm i react-select-search` | [Demo](https://react-select-search.com/) |
| [react-mobile-picker](https://github.com/adcentury/react-mobile-picker) | iOS-like select box | `npm i react-mobile-picker` | [Demo](https://react-mobile-picker.vercel.app/) |
| [react-column-select](https://github.com/chr-ge/react-column-select) | Column-based select component | `npm i react-column-select` | [GitHub](https://github.com/chr-ge/react-column-select) |
| [react-aria-menubutton](https://github.com/davidtheclark/react-aria-menubutton) | Fully accessible, themeable menu button | `npm i react-aria-menubutton` | [GitHub](https://github.com/davidtheclark/react-aria-menubutton) |

---

### Color Picker

| Package | Description | Install | Links |
|---|---|---|---|
| [react-colorful](https://github.com/omgovich/react-colorful) | Tiny (2.5KB), dependency-free, fast, accessible color picker | `npm i react-colorful` | [GitHub](https://github.com/omgovich/react-colorful) |
| [react-color](https://github.com/uiwjs/react-color) | Tiny color picker widget | `npm i @uiw/react-color` | [GitHub](https://github.com/uiwjs/react-color) |
| [coloreact](https://github.com/elrumordelaluz/coloreact) | Tiny color picker | `npm i coloreact` | [GitHub](https://github.com/elrumordelaluz/coloreact) |
| [react-input-color](https://github.com/wangzuo/react-input-color) | Input color component with HSV picker | `npm i react-input-color` | [GitHub](https://github.com/wangzuo/react-input-color) |

---

### Toggle / Switch

| Package | Description | Install | Links |
|---|---|---|---|
| [react-toggle](https://github.com/instructure-react/react-toggle) | Elegant, accessible toggle/checkbox | `npm i react-toggle` | [GitHub](https://github.com/instructure-react/react-toggle) |
| [ui-switch](https://github.com/yairEO/ui-switch) | Most complete Toggle component | `npm i ui-switch` | [GitHub](https://github.com/yairEO/ui-switch) |
| [@anatoliygatt/heart-switch](https://github.com/anatoliygatt/heart-switch) | Themeable, accessible heart-shaped toggle | `npm i @anatoliygatt/heart-switch` | [Demo](https://codesandbox.io/s/demo-for-anatoliygatt-heart-switch-cds5p) |
| [react-ios-switch](https://github.com/clari/react-ios-switch) | iOS-style switch component | `npm i react-ios-switch` | [GitHub](https://github.com/clari/react-ios-switch) |

---

### Slider

| Package | Description | Install | Links |
|---|---|---|---|
| [react-slider](https://github.com/mpowaga/react-slider) | Slider component for React | `npm i react-slider` | [GitHub](https://github.com/mpowaga/react-slider) |

---

### Radio Button

| Package | Description | Install | Links |
|---|---|---|---|
| [react-radio-group](https://github.com/chenglou/react-radio-group) | Better radio buttons | `npm i react-radio-group` | [GitHub](https://github.com/chenglou/react-radio-group) |

---

### Type Select / Mentions

| Package | Description | Install | Links |
|---|---|---|---|
| [react-mentions](https://github.com/effektif/react-mentions) | Mention people in a textarea | `npm i react-mentions` | [GitHub](https://github.com/effektif/react-mentions) |
| [rich-textarea](https://github.com/inokawa/rich-textarea) | Textarea with colorize, highlight, decorate, autocomplete | `npm i rich-textarea` | [GitHub](https://github.com/inokawa/rich-textarea) |
| [react-autocomplete-input](https://github.com/yury-dymov/react-autocomplete-input) | Autocomplete input field | `npm i react-autocomplete-input` | [GitHub](https://github.com/yury-dymov/react-autocomplete-input) |

---

### Tag Input

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [tagify](https://github.com/yairEO/tagify) | Lightweight, efficient tags input | `npm i @yaireo/tagify` | [Demo/Docs](https://yaireo.github.io/tagify/) |
| [react-tag-input](https://github.com/prakhar1989/react-tags) | Simple tagging component | `npm i react-tags-input` | [GitHub](https://github.com/prakhar1989/react-tags) |
| [react-tagsinput](https://github.com/olahol/react-tagsinput) | Simple tags input | `npm i react-tagsinput` | [GitHub](https://github.com/olahol/react-tagsinput) |
| [react-tokeninput](https://github.com/instructure-react/react-tokeninput) | Token input component | `npm i react-tokeninput` | [GitHub](https://github.com/instructure-react/react-tokeninput) |

---

### Autosize Input / Textarea

| Package | Description | Install | Links |
|---|---|---|---|
| [react-textarea-autosize](https://github.com/andreypopp/react-textarea-autosize) | Textarea that grows with content | `npm i react-textarea-autosize` | [GitHub](https://github.com/andreypopp/react-textarea-autosize) |
| [react-input-autosize](https://github.com/JedWatson/react-input-autosize) | Auto-resizing input field | `npm i react-input-autosize` | [GitHub](https://github.com/JedWatson/react-input-autosize) |
| [react-autowidth-input](https://github.com/kierien/react-autowidth-input) | Highly configurable auto-sized input field with hooks | `npm i react-autowidth-input` | [GitHub](https://github.com/kierien/react-autowidth-input) |

---

### Star Rating

| Package | Description | Install | Links |
|---|---|---|---|
| [react-rating](https://github.com/smastrom/react-rating) | Zero-dependency, highly customizable rating component | `npm i react-rating` | [Demo](https://react-rating.onrender.com/) |
| [react-star-rating-input](https://github.com/ikr/react-star-rating-input) | 0–5 (or more) star rating | `npm i react-star-rating-input` | [GitHub](https://github.com/ikr/react-star-rating-input) |
| [react-awesome-stars-rating](https://github.com/fedoryakubovich/react-awesome-stars-rating) | Star rating with accessibility | `npm i react-awesome-stars-rating` | [Demo](https://react-awesome-stars-rating.herokuapp.com/) |

---

### Drag and Drop

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-dnd](https://github.com/gaearon/react-dnd) | Drag and Drop for React — full flexibility | `npm i react-dnd react-dnd-html5-backend` | [GitHub](https://github.com/gaearon/react-dnd) |
| [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) | Beautiful, accessible DnD for lists | `npm i react-beautiful-dnd` | [GitHub](https://github.com/atlassian/react-beautiful-dnd) |
| [react-dropzone](https://github.com/okonet/react-dropzone) | Simple HTML5 drag-drop file zone | `npm i react-dropzone` | [GitHub](https://github.com/okonet/react-dropzone) |
| [react-movable](https://github.com/tajo/react-movable) | Accessible, minimal (<4kB) vertical DnD in lists/tables | `npm i react-movable` | [GitHub](https://github.com/tajo/react-movable) |
| [neodrag](https://github.com/PuruVJ/neodrag) | Multi-framework dragging with consistent API | `npm i @neodrag/react` | [GitHub](https://github.com/PuruVJ/neodrag) |
| [react-draggable](https://github.com/mzabriskie/react-draggable) | Draggable component | `npm i react-draggable` | [GitHub](https://github.com/mzabriskie/react-draggable) |
| [react-drag-sizing](https://github.com/fritx/react-drag-sizing) | "Drag to resize" component | `npm i react-drag-sizing` | [GitHub](https://github.com/fritx/react-drag-sizing) |
| [react-sortable-pane](https://github.com/bokuweb/react-sortable-pane) | Sortable and resizable pane | `npm i react-sortable-pane` | [GitHub](https://github.com/bokuweb/react-sortable-pane) |

---

### Sortable List

| Package | Description | Install | Links |
|---|---|---|---|
| [sortablejs](https://github.com/SortableJS/Sortable) | Lists reorderable by DnD, within and among lists | `npm i sortablejs react-sortablejs` | [GitHub](https://github.com/SortableJS/Sortable) |
| [react-anything-sortable](https://github.com/jasonslyvia/react-anything-sortable) | Sort any children with touch support | `npm i react-anything-sortable` | [GitHub](https://github.com/jasonslyvia/react-anything-sortable) |

---

### Rich Text Editor

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [ckeditor5-react](https://github.com/ckeditor/ckeditor5-react) | Official CKEditor 5 wrapper | `npm i @ckeditor/ckeditor5-react` | [GitHub](https://github.com/ckeditor/ckeditor5-react) |
| [alloyeditor](https://github.com/liferay/alloy-editor) | WYSIWYG based on CKEditor with rewritten UI | `npm i alloyeditor` | [GitHub](https://github.com/liferay/alloy-editor) |
| [ckeditor4-react](https://github.com/ckeditor/ckeditor4-react) | Official CKEditor 4 wrapper | `npm i @ckeditor/ckeditor4-react` | [GitHub](https://github.com/ckeditor/ckeditor4-react) |

---

### Markdown Editor

> See also: [Markdown Viewer](#markdown-viewer) for rendering-only use cases.

| Package | Description | Install | Links |
|---|---|---|---|
| [react-markdown](https://github.com/rexxars/react-markdown) | Render Markdown as React components (viewer) | `npm i react-markdown` | [GitHub](https://github.com/rexxars/react-markdown) |

---

### Form Collections / Schema Forms

| Package | Description | Install | Links |
|---|---|---|---|
| [@restpace/schema-form](https://github.com/restspace/schema-form) | Auto-build complex forms from JSON Schema | `npm i @restspace/schema-form` | [Demo](https://restspace.io/react/schema-form/demo) |

---

### Syntax Highlight

| Package | Description | Install | Links |
|---|---|---|---|
| [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | Syntax highlighting via Prism or Highlight.js | `npm i react-syntax-highlighter` | [GitHub](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |

---

## UI Layout

| Package | Description | Install | Links |
|---|---|---|---|
| [react-grid-layout](https://github.com/STRML/react-grid-layout) | Draggable and resizable grid layout | `npm i react-grid-layout` | [GitHub](https://github.com/STRML/react-grid-layout) |
| [react-masonry-css](https://github.com/paulcollett/react-masonry-css) | Fast masonry layout powered by CSS | `npm i react-masonry-css` | [GitHub](https://github.com/paulcollett/react-masonry-css) |
| [react-stonecutter](https://github.com/dantrain/react-stonecutter) | Animated grid layout component | `npm i react-stonecutter` | [GitHub](https://github.com/dantrain/react-stonecutter) |
| [golden-layout](https://github.com/golden-layout/golden-layout) | Multi-window layout manager for web apps | `npm i golden-layout` | [GitHub](https://github.com/golden-layout/golden-layout) |

---

## UI Animation

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [framer-motion](https://github.com/framer/motion) | Production-ready animation library for React | `npm i framer-motion` | [Docs](https://www.framer.com/motion/) |
| [react-spring](https://github.com/pmndrs/react-spring) | Spring-physics-based animation | `npm i react-spring` | [Docs](https://react-spring.dev/) |
| [react-transition-group](https://github.com/reactjs/react-transition-group) | Official transition animations for React | `npm i react-transition-group` | [GitHub](https://github.com/reactjs/react-transition-group) |
| [react-move](https://github.com/sghall/react-move) | Data-driven animations for React | `npm i react-move` | [GitHub](https://github.com/sghall/react-move) |

### Parallax

| Package | Description | Install | Links |
|---|---|---|---|
| [react-scroll-parallax](https://github.com/jscottsmith/react-scroll-parallax) | Scroll-based parallax effects | `npm i react-scroll-parallax` | [GitHub](https://github.com/jscottsmith/react-scroll-parallax) |

---

## UI Frameworks

### Responsive (General)

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [shadcn/ui](https://ui.shadcn.com/) | Beautifully designed components built on Radix + Tailwind | `npx shadcn@latest init` | [Docs](https://ui.shadcn.com/docs) |
| [Mantine](https://github.com/mantinedev/mantine) | Full-featured React component library | `npm i @mantine/core @mantine/hooks` | [Docs](https://mantine.dev/) |
| [Ant Design](https://github.com/ant-design/ant-design) | Enterprise-grade UI design language | `npm i antd` | [Docs](https://ant.design/) |
| [Chakra UI](https://github.com/chakra-ui/chakra-ui) | Accessible, themeable component library | `npm i @chakra-ui/react` | [Docs](https://chakra-ui.com/) |
| [Radix UI](https://www.radix-ui.com/) | Unstyled, accessible primitives | `npm i @radix-ui/react-*` | [Docs](https://www.radix-ui.com/primitives) |

#### Material Design

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [MUI (Material UI)](https://github.com/mui/material-ui) | Most popular Material Design system for React | `npm i @mui/material @emotion/react @emotion/styled` | [Docs](https://mui.com/) |

### Mobile

| Package | Description | Install | Links |
|---|---|---|---|
| [React Native](https://reactnative.dev/) | Build native apps with React | See docs | [Docs](https://reactnative.dev/docs/getting-started) |
| [NativeBase](https://github.com/GeekyAnts/NativeBase) | Universal component library for React Native/Web | `npm i native-base` | [Docs](https://docs.nativebase.io/) |

---

## UI Utilities

### Visibility & Measurement

| Package | Description | Install | Links |
|---|---|---|---|
| [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) | React implementation of Intersection Observer API | `npm i react-intersection-observer` | [GitHub](https://github.com/thebuilder/react-intersection-observer) |
| [react-measure](https://github.com/souporserious/react-measure) | Compute measurements of React components | `npm i react-measure` | [GitHub](https://github.com/souporserious/react-measure) |
| [react-use-measure](https://github.com/pmndrs/react-use-measure) | Track view measurements and resize events | `npm i react-use-measure` | [GitHub](https://github.com/pmndrs/react-use-measure) |

### Device Input

#### Keyboard Events

| Package | Description | Install | Links |
|---|---|---|---|
| [react-hotkeys](https://github.com/greena13/react-hotkeys) | Declarative hotkey and focus trap management | `npm i react-hotkeys` | [GitHub](https://github.com/greena13/react-hotkeys) |
| [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) | React hook for hotkeys | `npm i react-hotkeys-hook` | [GitHub](https://github.com/JohannesKlauss/react-hotkeys-hook) |

#### Scroll Events

| Package | Description | Install | Links |
|---|---|---|---|
| [react-scroll-trigger](https://github.com/ryanhefner/react-scroll-trigger) | Trigger callbacks on element scroll | `npm i react-scroll-trigger` | [GitHub](https://github.com/ryanhefner/react-scroll-trigger) |

#### Touch Swipe

| Package | Description | Install | Links |
|---|---|---|---|
| [react-swipeable](https://github.com/FormidableLabs/react-swipeable) | Swipe event handler hook | `npm i react-swipeable` | [GitHub](https://github.com/FormidableLabs/react-swipeable) |

### Meta Tags

| Package | Description | Install | Links |
|---|---|---|---|
| [react-helmet](https://github.com/nfl/react-helmet) | Manage document head (title, meta, etc.) | `npm i react-helmet` | [GitHub](https://github.com/nfl/react-helmet) |
| [react-helmet-async](https://github.com/staylor/react-helmet-async) | Thread-safe Helmet for async/concurrent React | `npm i react-helmet-async` | [GitHub](https://github.com/staylor/react-helmet-async) |

### Portal

| Package | Description | Install | Links |
|---|---|---|---|
| [react-portal](https://github.com/tajo/react-portal) | Transport React components to body or another DOM node | `npm i react-portal` | [GitHub](https://github.com/tajo/react-portal) |

---

## Code Design / Architecture

### Data Store / State Management

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [zustand](https://github.com/pmndrs/zustand) | Minimal, flexible state management | `npm i zustand` | [GitHub](https://github.com/pmndrs/zustand) |
| 🚀 [jotai](https://github.com/pmndrs/jotai) | Atomic approach to global state | `npm i jotai` | [GitHub](https://github.com/pmndrs/jotai) |
| [redux-toolkit](https://github.com/reduxjs/redux-toolkit) | The official, opinionated Redux toolset | `npm i @reduxjs/toolkit react-redux` | [Docs](https://redux-toolkit.js.org/) |
| [mobx-react](https://github.com/mobxjs/mobx-react) | MobX bindings for React | `npm i mobx mobx-react-lite` | [Docs](https://mobx.js.org/) |
| [recoil](https://github.com/facebookexperimental/Recoil) | Experimental state management for React (Meta) | `npm i recoil` | [Docs](https://recoiljs.org/) |
| [valtio](https://github.com/pmndrs/valtio) | Proxy-based state management | `npm i valtio` | [GitHub](https://github.com/pmndrs/valtio) |

---

### Form Logic

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-hook-form](https://github.com/react-hook-form/react-hook-form) | Performant, flexible form validation with hooks | `npm i react-hook-form` | [Docs](https://react-hook-form.com/) |
| [formik](https://github.com/jaredpalmer/formik) | Build forms without tears | `npm i formik` | [Docs](https://formik.org/) |
| [final-form](https://github.com/final-form/react-final-form) | Subscription-based form state management | `npm i final-form react-final-form` | [GitHub](https://github.com/final-form/react-final-form) |

---

### Router

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [react-router](https://github.com/ReactTraining/react-router) | Declarative routing for React | `npm i react-router-dom` | [Docs](https://reactrouter.com/) |
| [tanstack-router](https://github.com/TanStack/router) | Type-safe router with search params, loaders | `npm i @tanstack/react-router` | [Docs](https://tanstack.com/router/latest) |

---

### Server Communication

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [TanStack Query](https://github.com/TanStack/query) | Async state management: fetching, caching, sync | `npm i @tanstack/react-query` | [Docs](https://tanstack.com/query/latest) |
| [swr](https://github.com/vercel/swr) | React hooks for data fetching with stale-while-revalidate | `npm i swr` | [Docs](https://swr.vercel.app/) |
| [apollo-client](https://github.com/apollographql/apollo-client) | GraphQL client for React | `npm i @apollo/client graphql` | [Docs](https://www.apollographql.com/docs/react/) |
| [urql](https://github.com/FormidableLabs/urql) | Lightweight, extensible GraphQL client | `npm i urql graphql` | [Docs](https://formidable.com/open-source/urql/) |

---

### CSS-in-JS / Styling

| Package | Description | Install | Links |
|---|---|---|---|
| [styled-components](https://github.com/styled-components/styled-components) | CSS-in-JS with tagged template literals | `npm i styled-components` | [Docs](https://styled-components.com/) |
| [emotion](https://github.com/emotion-js/emotion) | CSS-in-JS — performant and flexible | `npm i @emotion/react @emotion/styled` | [Docs](https://emotion.sh/) |
| [vanilla-extract](https://github.com/vanilla-extract-css/vanilla-extract) | Zero-runtime, TypeScript-first CSS | `npm i @vanilla-extract/css` | [Docs](https://vanilla-extract.style/) |
| [linaria](https://github.com/callstack/linaria) | Zero-runtime CSS-in-JS | `npm i linaria` | [GitHub](https://github.com/callstack/linaria) |

---

### Isomorphic / SSR

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [Next.js](https://github.com/vercel/next.js) | Full-stack React framework with SSR, SSG, RSC | `npx create-next-app@latest` | [Docs](https://nextjs.org/docs) |
| [Vike](https://vike.dev) | Fast Vite-based React framework, flexible and lean | `npm i vike` | [Docs](https://vike.dev/) |
| [Remix](https://github.com/remix-run/remix) | Full-stack web framework focused on web standards | `npx create-remix@latest` | [Docs](https://remix.run/docs) |

---

### Boilerplate

| Package | Description | Install | Links |
|---|---|---|---|
| [Create React App](https://github.com/facebook/create-react-app) | Official CRA bootstrapper | `npx create-react-app my-app` | [Docs](https://create-react-app.dev/) |
| [Vite](https://github.com/vitejs/vite) | Next-gen build tool — use for React projects | `npm create vite@latest` | [Docs](https://vitejs.dev/) |

---

## Utilities

### i18n / Internationalization

| Package | Description | Install | Links |
|---|---|---|---|
| [react-i18next](https://github.com/i18next/react-i18next) | Internationalization for React/React Native | `npm i react-i18next i18next` | [Docs](https://react.i18next.com/) |
| [react-intl](https://github.com/formatjs/react-intl) | Internationalize React apps (FormatJS) | `npm i react-intl` | [Docs](https://formatjs.io/docs/react-intl/) |
| [lingui](https://github.com/lingui/js-lingui) | Readable, automated i18n for JS/React | `npm i @lingui/react` | [Docs](https://lingui.dev/) |

---

### Third-Party Integrations

| Package | Description | Install | Links |
|---|---|---|---|
| [react-stripe-js](https://github.com/stripe/react-stripe-js) | Stripe.js and Stripe Elements for React | `npm i @stripe/react-stripe-js @stripe/stripe-js` | [Docs](https://stripe.com/docs/stripe-js/react) |
| [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks) | React hooks for Firebase services | `npm i react-firebase-hooks` | [GitHub](https://github.com/CSFrequency/react-firebase-hooks) |
| [react-google-login](https://github.com/anthonyjgrove/react-google-login) | Google OAuth login component | `npm i react-google-login` | [GitHub](https://github.com/anthonyjgrove/react-google-login) |

---

## Performance

### Lazy Load

| Package | Description | Install | Links |
|---|---|---|---|
| [react-lazyload](https://github.com/jasonslyvia/react-lazyload) | Lazyload components and images | `npm i react-lazyload` | [GitHub](https://github.com/jasonslyvia/react-lazyload) |
| [loadable-components](https://github.com/gregberge/loadable-components) | Code splitting with SSR support | `npm i @loadable/component` | [Docs](https://loadable-components.com/) |

### App Size

| Package | Description | Install | Links |
|---|---|---|---|
| [bundlephobia](https://bundlephobia.com/) | Find the cost of adding an npm package | N/A — web tool | [Site](https://bundlephobia.com/) |
| [source-map-explorer](https://github.com/danvk/source-map-explorer) | Analyze bundle size via source maps | `npm i source-map-explorer` | [GitHub](https://github.com/danvk/source-map-explorer) |

### Server-Side Rendering

| Package | Description | Install | Links |
|---|---|---|---|
| [next.js](https://nextjs.org) | SSR, SSG, ISR out of the box | `npx create-next-app@latest` | [Docs](https://nextjs.org/docs) |
| [react-dom/server](https://react.dev/reference/react-dom/server) | Built-in React SSR APIs | Built into React | [Docs](https://react.dev/reference/react-dom/server) |

---

## Dev Tools

### Testing

| Package | Description | Install | Links |
|---|---|---|---|
| 🚀 [Vitest](https://github.com/vitest-dev/vitest) | Vite-native test runner — fast unit/component testing | `npm i -D vitest` | [Docs](https://vitest.dev/) |
| 🚀 [React Testing Library](https://github.com/testing-library/react-testing-library) | Test behavior, not implementation | `npm i -D @testing-library/react` | [Docs](https://testing-library.com/docs/react-testing-library/intro/) |
| [Jest](https://github.com/facebook/jest) | JavaScript test runner | `npm i -D jest babel-jest` | [Docs](https://jestjs.io/) |
| [Playwright](https://github.com/microsoft/playwright) | End-to-end browser testing | `npm i -D @playwright/test` | [Docs](https://playwright.dev/) |
| [Cypress](https://github.com/cypress-io/cypress) | E2E + component testing | `npm i -D cypress` | [Docs](https://docs.cypress.io/) |
| [Storybook](https://github.com/storybookjs/storybook) | Develop and test UI components in isolation | `npx storybook@latest init` | [Docs](https://storybook.js.org/) |

---

### Redux DevTools

| Package | Description | Install | Links |
|---|---|---|---|
| [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) | Browser extension for Redux debugging | Browser extension | [GitHub](https://github.com/zalmoxisus/redux-devtools-extension) |

---

### Inspect / Debug

| Package | Description | Install | Links |
|---|---|---|---|
| [React Developer Tools](https://react.dev/learn/react-developer-tools) | Official React browser extension | Browser extension | [Docs](https://react.dev/learn/react-developer-tools) |
| [why-did-you-render](https://github.com/welldone-software/why-did-you-render) | Notify on avoidable re-renders | `npm i -D @welldone-software/why-did-you-render` | [GitHub](https://github.com/welldone-software/why-did-you-render) |

---

## Cloud Solutions

### Databases

| Package | Description | Install | Links |
|---|---|---|---|
| [firebase](https://firebase.google.com/) | Google's BaaS — real-time DB, auth, hosting, functions | `npm i firebase` | [Docs](https://firebase.google.com/docs) |
| [supabase-js](https://github.com/supabase/supabase-js) | Open-source Firebase alternative (Postgres) | `npm i @supabase/supabase-js` | [Docs](https://supabase.com/docs) |
| [pocketbase](https://pocketbase.io/) | Open-source backend with real-time subscriptions | `npm i pocketbase` | [Docs](https://pocketbase.io/docs/) |

---

## Quick Decision Guide

| Problem | Recommended Package |
|---|---|
| Need a data table with sorting/filtering | TanStack Table + your UI |
| Need a spreadsheet/Excel-like grid | AG Grid or Handsontable |
| Toast notifications | react-toastify or Sonner |
| Modal/dialog | SweetAlert2 or react-modal |
| Drag and drop UI | react-dnd or react-beautiful-dnd |
| Rich text editing | CKEditor 5 |
| Form validation | react-hook-form |
| Data fetching/caching | TanStack Query |
| State management | Zustand (simple) or Redux Toolkit (complex) |
| Charts | Recharts (simple) or ECharts (complex) |
| Date/time picker | react-datepicker |
| Select/autocomplete | react-select |
| Virtual large lists | react-window or virtua |
| UI framework | MUI, Mantine, or shadcn/ui |
| Animation | Framer Motion |
| Routing | React Router v6 or TanStack Router |
| Command palette (cmd+k) | cmdk |
| PDF display | react-pdf |
| Infinite photo gallery | lightGallery or react-photo-album |
| Map | react-leaflet (OpenStreetMap) or react-map-gl (Mapbox) |

---

*Source: [brillout/awesome-react-components](https://github.com/brillout/awesome-react-components) — Last synced: April 2026*

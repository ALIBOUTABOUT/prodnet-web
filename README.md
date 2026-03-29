# ProdNet Mobile Application - Architecture Documentation

> **Purpose**: This document provides a comprehensive architectural overview of the existing Flutter mobile application. It is designed for developers who will be extending this system to a Web platform without modifying the mobile codebase or backend infrastructure.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture Summary](#system-architecture-summary)
3. [Role-Based System Design](#role-based-system-design)
4. [Technical Stack](#technical-stack)
5. [Folder Structure Philosophy](#folder-structure-philosophy)
6. [Authentication Flow Summary](#authentication-flow-summary)
7. [API Communication Model](#api-communication-model)
8. [State Management Strategy](#state-management-strategy)
9. [Current Limitations](#current-limitations)
10. [Important Constraints for Web Extension](#important-constraints-for-web-extension)
11. [Development Guidelines for Web Version](#development-guidelines-for-web-version)
12. [What Must Not Be Changed](#what-must-not-be-changed)

---

## Project Overview

**ProdNet** is a Flutter-based mobile application (Android-first) that serves as an agricultural project management platform. It connects three distinct user roles within a single ecosystem:

- **Farmers**: Publish agricultural projects and manage project details
- **Experts**: Publish innovative ideas and collaborate with farmers on pilot projects
- **Investors**: Browse unified content feeds, unlock premium features, and engage with projects

The application communicates with a FastAPI backend (deployed on Render) via REST APIs. All business logic, authentication, and data persistence are handled by the backend, while the mobile app provides role-specific UI flows and state management.

**Project Name**: `prod_net`  
**Current Version**: 1.0.0+1  
**Platform**: Flutter (Android primary target)  
**Backend**: FastAPI (Django REST + JWT authentication)

---

## System Architecture Summary

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Flutter Mobile App                        │
│                      (lib/ folder)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Farmer     │  │    Expert    │  │   Investor   │     │
│  │     UI       │  │      UI      │  │      UI      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                  ┌─────────▼──────────┐                     │
│                  │  Provider Layer    │                     │
│                  │  (State Management)│                     │
│                  └─────────┬──────────┘                     │
│                            │                                │
│                  ┌─────────▼──────────┐                     │
│                  │   Service Layer    │                     │
│                  │  (API + Storage)   │                     │
│                  └─────────┬──────────┘                     │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   REST API Layer │
                    │   (HTTP Client)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  FastAPI Backend │
                    │ (Django REST +   │
                    │  JWT Auth)       │
                    └──────────────────┘
```

### Communication Flow

1. **User Interaction** → UI Screen (Role-specific)
2. **UI Action** → Provider (State Management)
3. **Provider** → Service Layer (auth_service.dart, storage_service.dart)
4. **Service Layer** → HTTP Client → Backend API
5. **Backend Response** → Service → Provider → UI Update

### Offline Strategy

The app implements a fallback mechanism:
- **Online**: Full backend integration via REST APIs
- **Offline/Backend Unavailable**: Falls back to mock data stored locally for demo stability

---

## Role-Based System Design

### Three-Role Architecture

Each role has:
- Separate authentication/registration endpoints
- Isolated UI flows
- Dedicated screens and navigation paths
- Shared backend and core services

---

### Farmer Features

**Registration endpoint**: `/api/auth/register/farmer/`  
**Entry screen**: `farmer_profile_page.dart`  
**Profile completion screen**: `complete_profile_page.dart`

#### Profile Data
The farmer profile stores the following fields locally and syncs with the backend:
- **Full Name**: Display name shown across the platform
- **Phone**: Contact number
- **Region**: Geographic region of the farm (North, South, East, West)
- **Farm Type**: Category of farming activity (e.g., crop farming, livestock)
- **Bio**: Optional short description of the farmer's background
- **Profile Image**: Locally stored image path (captured via `image_picker`)

#### Project Publishing
Farmers can publish agricultural project listings, each containing:
- **Title**: Short project name
- **Short Description**: Summary shown in listing cards
- **Detailed Description**: Full project explanation shown in detail view
- **Budget**: Required investment amount in DZD
- **Production Estimate**: Expected output or yield
- **Region**: Geographic target for the project
- **Category**: Agricultural category (Crop Farming, Livestock, Irrigation, etc.)
- **Images**: One or more project images

> Example: A farmer in the North region publishes a "Drip Irrigation Expansion" project with a 500,000 DZD budget and a production estimate of 2,000 kg/season.

#### Project Management
- The farmer's profile page displays all projects they have published (filtered by `farmerId == authProvider.userId`)
- Each project card links to a detail view (`project_detail_page.dart`)
- Projects can be created via `create_project_page.dart`
- The farmer's own profile and published projects are the central hub of their activity

#### Messaging
- Messaging access is granted **only after profile completion**
- The `hasCompletedProfile` flag in `AuthProvider` gates this feature
- Farmers can communicate with experts and investors who engage with their projects

---

### Expert Features

**Registration endpoint**: `/api/auth/register/expert/`  
**Entry screen**: `expert_home_screen.dart`  
**Profile completion screen**: `complete_expert_profile_page.dart`

#### Idea Lifecycle
Expert ideas progress through the following status stages:

```
draft → published → readyForPilot → pilotActive
```

- **Draft**: Created but not yet visible to investors or farmers
- **Published**: Visible in the public feed; investors can express interest
- **readyForPilot**: Marked as ready to enter a pilot phase with a farmer
- **pilotActive**: Actively being piloted in collaboration with a farmer

#### Creating and Editing Ideas
The `create_edit_idea_page.dart` screen handles both creation and editing (determined by whether an `ExpertIdea` object is passed as a parameter). Each idea includes:
- **Title**: e.g., *"Drip Irrigation System for Smallholder Farms"*
- **Problem Statement**: Description of the agricultural problem being solved
- **Proposed Solution**: The expert's technical or methodological answer to the problem
- **Category**: One of: Crop Farming, Livestock, Irrigation, Organic Farming, Aquaculture, Poultry, Dairy, Horticulture, Agro-processing, Sustainable Agriculture, Other
- **Target Region**: One of: All Regions, North, East, West, South
- **Budget Range**: Minimum and maximum estimated cost in DZD
- **Images**: Optional supporting images

> Example: An expert with a background in irrigation publishes an idea titled "Low-Cost Solar Pumping for Remote Farms" with a budget range of 80,000–150,000 DZD targeting the South region.

#### Browsing and Filtering Ideas
The expert home screen provides:
- **Tabs**: All Ideas / My Ideas / Published / Drafts
- **Category filter**: Dropdown to filter by agricultural category
- **Pull-to-refresh**: Reloads all ideas from the provider
- **Empty state handling**: Context-aware message depending on active filter
- Experts can see their own draft ideas, which are hidden from other users

#### Investor Interest Visibility
- Each expert can open `expert_interested_investors_page.dart` to view which investors have expressed interest in a specific idea
- This data includes the investor's message and proposed investment amount

#### Browsing Farmer Projects
- `expert_browse_projects_page.dart` allows experts to explore active farmer projects
- This supports the collaboration flow where experts identify farmers to pilot their ideas with

#### Idea Detail View
- `expert_idea_detail_page.dart` shows the full content of an idea
- Owners see edit/delete controls; non-owners see read-only content
- Draft ideas can be deleted; published ideas can be transitioned to pilot status

#### Messaging
- Available after profile completion (`hasCompletedProfile` flag)
- Experts can message farmers directly through the shared messaging interface

---

### Investor Features

**Registration endpoint**: `/api/auth/register/investor/`  
**Entry screen**: `investor_home_screen.dart`  
**Dashboard screen**: `investor_dashboard_screen.dart`  
**Profile completion screen**: `complete_investor_profile_page.dart`

#### Unified Content Feed
The investor home screen aggregates all three content types into a single scrollable feed:

| Badge Color | Type | Source |
|-------------|------|--------|
| Blue | Expert Idea | Expert-published ideas |
| Green | Pilot Project | Ideas in pilot phase |
| Orange | Farmer Project | Farmer-published agricultural projects |

Each card displays: title, short description, budget (DZD), region, type badge, expert name (if applicable), and a "View Details" button.

#### Filtering and Searching
Investors can narrow the feed using:
- **Type filter chips**: All / Expert Ideas / Pilot Projects / Farmer Projects
- **Region filter**: Dropdown matching the project's geographic region (All / North / South / East / West)
- **Search bar**: Full-text search across title, description, category, and expert name
- **Sort options**: Newest / Budget: Low→High / Budget: High→Low / Trust Score

Filtering and sorting are applied client-side on the already-loaded project list.

#### Project Detail View
- `investor_project_detail_screen.dart` shows the complete detail of a selected project
- Includes: full description, budget, production estimate, region, category, images, and expert/farmer contact info (when applicable)
- Interest expression is accessible from this screen (premium required)

#### Project Comparison Feature

The comparison feature allows investors to evaluate up to **3 projects side-by-side** before deciding where to invest.

**How it works:**
1. Each project card in the feed displays a small **compare toggle icon** (visible only to authenticated investors)
2. The investor taps the icon on a card to **select it for comparison** — the card border highlights in the app's primary color to confirm selection
3. Once 2 or more projects are selected, a **floating action button** appears at the bottom center of the screen: `Compare (N)` where N is the count
4. Tapping the FAB opens a **modal bottom sheet** (`_ComparisonSheet`) that occupies 75% of the screen height
5. The sheet displays a structured, row-by-row comparison table

**Comparison fields displayed:**

| Field | Notes |
|-------|-------|
| **Project Title** | Full name of each project |
| **Type** | Color-coded badge (Expert Idea / Farmer Project / Pilot Project) |
| **Budget** | Displayed in DZD; the **lowest budget** is highlighted with a primary-color background |
| **Region** | With location icon |
| **Category** | Agricultural category |
| **Production Estimate** | Expected yield or output |
| **Expert Name** | Shown if available; `N/A` otherwise |

**UI/UX details:**
- Maximum selection is capped at `_maxCompareProjects = 3`; the compare icon becomes disabled on unselected cards once the limit is reached
- The "best" budget (lowest) is highlighted automatically to help the investor identify the most accessible entry point
- The sheet includes a **Clear Selection** button (resets all selections and closes the sheet) and a **Done** button (closes the sheet without clearing)
- Haptic feedback (`HapticFeedback.selectionClick()`) is triggered on each toggle
- The comparison is entirely **client-side** — no API call is made

> Example: An investor selects a 200,000 DZD irrigation idea, a 450,000 DZD livestock pilot, and a 180,000 DZD organic farming project. The comparison sheet highlights the 180,000 DZD project as the lowest-budget option and displays all fields side-by-side.

#### Investor Dashboard
The `investor_dashboard_screen.dart` is a separate screen (accessible from the navigation drawer) with two tabs:

1. **Interested Projects tab** (`مشاريع مهتم بها`): Lists all projects the investor has expressed interest in. Sources are merged:
   - Regular farmer projects (from `MockApi.getInvestorInterests()`)
   - Expert ideas / pilot projects (from `ExpertProvider.allIdeas`, matched by `interestedInvestorIds`)
   - Each entry shows: project title, type badge, date, status ("Pending Review"), and two action buttons: "View Details" and "Withdraw Interest"
   - Withdrawing interest triggers a confirmation dialog and calls the appropriate provider method

2. **Statistics tab** (`الإحصائيات`): Summary metrics about the investor's activity on the platform

#### Premium Simulation Feature

The premium system is a **UI-only simulation** of a subscription paywall. There is no real payment gateway and no backend interaction. Premium state is managed entirely by `InvestorPaymentProvider` and persisted per-user in `SharedPreferences`.

**Before Premium (Free tier):**
- Investors can **browse** the full project feed without restriction
- The following features are **locked**:
  - Expressing interest in any project
  - Sending or receiving messages
  - Viewing owner contact details
- A persistent **orange upgrade banner** is shown at the top of the home screen: *"Upgrade to Premium — Unlock messaging, contact info & express interest"*
- In the navigation drawer, the **Messages** item shows a lock icon and redirects to the payment screen instead of the inbox

**Unlocking Premium:**
1. The investor taps the upgrade banner or the "Upgrade to Premium" drawer item
2. They are navigated to `payment_simulation_screen.dart`
3. The screen displays two subscription plans:
   - **Monthly**: 3,000 DZD/month
   - **Yearly**: 30,000 DZD/year (down from 36,000; saves 6,000 DZD — highlighted with an orange "SAVE 6,000" badge)
4. The investor selects a plan, then fills in a simulated CB (Carte Bancaire — Algerian bank card) form:
   - Card Number (16 digits, formatted with spaces)
   - Card Holder Name
   - Expiry Date (MM/YY)
   - CVV
5. On submission:
   - A 1,500ms simulated delay (`Future.delayed`) represents the processing step
   - **All-zeros card number** (`0000000000000000`) → payment is **declined**, error message shown
   - **Any other valid-format card** → payment is **approved**
6. On success, the user is navigated to `payment_success_screen.dart` and premium status is saved

**After Premium (Pro tier):**
- Premium state (`_isPremium = true`) is persisted to `SharedPreferences` via `StorageService.saveInvestorPremiumStatus(true, userId)`
- State is **per user ID** — switching accounts resets premium
- The upgrade banner is **hidden**
- The investor's **avatar displays a gold premium badge** (bottom-right overlay)
- A **"PRO" label** in amber appears next to the user's email in the drawer header
- The drawer shows: `Premium Active — All features unlocked` (non-tappable)
- **Messages** item in the drawer is now fully active
- **Express Interest** and **contact info** features become accessible on the project detail screen
- Premium features list (shown on payment screen): Direct messaging with owners, Express interest in projects, View owner contact details, Premium investor badge

**State Loading:**
On app startup, `app.dart` listens to `AuthProvider` changes. When a user logs in, `InvestorPaymentProvider.loadPaymentState(userId)` is called to restore premium status from storage. This ensures premium is preserved across app restarts.

---

### Role-Based Navigation

After successful login, users are redirected based on their role:

```dart
switch (user.role) {
  case 'Farmer':
    Navigator.pushReplacementNamed(context, AppRoutes.farmerProfile);
  case 'Expert':
    Navigator.pushReplacementNamed(context, AppRoutes.expertHome);
  case 'Investor':
    Navigator.pushReplacementNamed(context, AppRoutes.investorDashboard);
}
```

---

## Technical Stack

### Core Technologies

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | Flutter | SDK ^3.8.0 |
| **Language** | Dart | ^3.8.0 |
| **State Management** | Provider | ^6.1.1 |
| **HTTP Client** | http | ^1.1.0 |
| **Local Storage** | shared_preferences | ^2.2.2 |
| **Image Handling** | image_picker | ^1.0.7 |
| **Backend** | FastAPI + Django REST | External |
| **Authentication** | JWT Tokens | Backend-managed |

### Key Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  shared_preferences: ^2.2.2
  provider: ^6.1.1
  image_picker: ^1.0.7
  http: ^1.1.0
```

### Backend Configuration

- **Base URL**: `https://testo-3ki7.onrender.com`
- **Authentication**: JWT (access + refresh tokens)
- **Request Timeout**: 15 seconds
- **Content Type**: JSON (application/json)

---

## Folder Structure Philosophy

The `lib/` directory is the **single source of truth** for application logic.

```
lib/
├── main.dart                    # Application entry point
├── app.dart                      # Root widget with provider setup
├── routes.dart                   # Centralized route definitions
│
├── core/                         # Core utilities and configurations
│   ├── api/                      # API-related constants
│   │   ├── api_constants.dart    # Backend URLs and endpoints
│   │   └── mock_api.dart         # Offline fallback logic
│   ├── styles.dart               # Global UI styles and theme
│   └── validators.dart           # Input validation utilities
│
├── models/                       # Data models (DTOs)
│   ├── auth_response.dart        # Authentication response structure
│   ├── user.dart                 # User entity
│   ├── project.dart              # Farmer project model
│   ├── expert_idea.dart          # Expert idea model
│   ├── investor_interest.dart    # Investor interest model
│   ├── message.dart              # Messaging model
│   └── conversation.dart         # Conversation threads
│
├── providers/                    # State management (Provider pattern)
│   ├── auth_provider.dart        # Authentication state
│   ├── project_provider.dart     # Project management state
│   ├── expert_provider.dart      # Expert ideas state
│   ├── messaging_provider.dart   # Real-time messaging state
│   └── investor_payment_provider.dart  # Premium simulation state
│
├── services/                     # Business logic layer
│   ├── auth_service.dart         # Authentication API calls
│   └── storage_service.dart      # SharedPreferences abstraction
│
├── screens/                      # UI layer (role-based organization)
│   ├── auth/                     # Authentication screens
│   │   ├── login_page.dart
│   │   ├── signup_page.dart
│   │   └── role_selection_page.dart
│   │
│   ├── farmer/                   # Farmer-specific screens
│   │   ├── farmer_profile_page.dart
│   │   ├── complete_profile_page.dart
│   │   └── edit_farmer_profile_page.dart
│   │
│   ├── expert/                   # Expert-specific screens
│   │   ├── expert_home_screen.dart            # Main feed + idea filters
│   │   ├── expert_profile_page.dart           # Expert profile view
│   │   ├── complete_expert_profile_page.dart  # One-time profile setup
│   │   ├── edit_expert_profile_page.dart      # Profile editing
│   │   ├── create_edit_idea_page.dart         # Dual-mode idea form
│   │   ├── expert_idea_detail_page.dart       # Idea full detail + actions
│   │   ├── expert_browse_projects_page.dart   # Browse farmer projects
│   │   └── expert_interested_investors_page.dart  # Investor interest list
│   │
│   ├── investor/                 # Investor-specific screens
│   │   ├── investor_home_screen.dart          # Unified feed + comparison
│   │   ├── investor_dashboard_screen.dart     # Interests + statistics tabs
│   │   ├── investor_project_detail_screen.dart # Full project detail view
│   │   ├── investor_profile_page.dart         # Investor profile view
│   │   ├── edit_investor_profile_page.dart    # Profile editing
│   │   ├── complete_investor_profile_page.dart # One-time profile setup
│   │   ├── payment_simulation_screen.dart     # CB (bank card) payment form
│   │   └── payment_success_screen.dart        # Post-payment confirmation
│   │
│   ├── home/                     # Shared home screen
│   ├── project/                  # Project-related screens
│   ├── messaging/                # Messaging interface
│   └── settings/                 # Application settings
│
└── widgets/                      # Reusable UI components
```

### Architectural Principles

1. **Separation of Concerns**: Models, business logic, state, and UI are clearly separated
2. **Role-Based Organization**: Screens are grouped by user role for clarity
3. **Provider Pattern**: State is managed through dedicated providers
4. **Service Layer**: All API communication is abstracted in services
5. **Centralized Routing**: All navigation paths defined in `routes.dart`

---

## Authentication Flow Summary

### Registration Flow

```
User → SignupPage
  ↓
Email + Password Collection
  ↓
RoleSelectionPage
  ↓
Role Chosen (Farmer/Expert/Investor)
  ↓
Backend Registration API Call
  ↓
JWT Token Received
  ↓
Local Storage (token + role)
  ↓
Complete Profile Page (role-specific)
  ↓
Home Screen (role-based)
```

### Login Flow

```
User → LoginPage
  ↓
Email + Password → AuthService.login()
  ↓
POST /api/auth/login/
  ↓
Backend Returns:
  - access_token (JWT)
  - user { id, email, role }
  ↓
AuthProvider updates state
  ↓
Token stored in SharedPreferences
  ↓
Role-based navigation
  ↓
Home Screen
```

### Token Management

- **Storage**: JWT tokens stored in SharedPreferences via `StorageService`
- **Refresh**: `/api/auth/refresh/` endpoint (not yet fully implemented in mobile)
- **Expiration**: Handled by backend; mobile app checks authentication state
- **Logout**: Clears local storage and resets provider state

### Profile Completion

Each role has a mandatory profile completion step:
- **Farmer**: `complete_profile_page.dart`
- **Expert**: `complete_expert_profile_page.dart`
- **Investor**: `complete_investor_profile_page.dart`

Profile data is stored in the respective provider and synced with backend.

---

## API Communication Model

### Request Structure

All API requests follow this pattern:

```dart
final url = Uri.parse('${ApiConstants.BASE_URL}${endpoint}');
final response = await http.post(
  url,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer $token', // For authenticated requests
  },
  body: jsonEncode(payload),
).timeout(ApiConstants.REQUEST_TIMEOUT);
```

### Response Handling

```dart
if (response.statusCode == 200 || response.statusCode == 201) {
  final data = jsonDecode(response.body);
  return AuthResponse.fromJson(data);
} else {
  throw Exception('API Error: ${response.statusCode}');
}
```

### Fallback Strategy

When backend is unavailable (network error, timeout):
1. Catch exception in service layer
2. Log error with detailed context
3. Return mock data from `MockApi` class
4. Display appropriate user feedback

```dart
try {
  // Backend API call
} catch (e) {
  print('Backend unavailable: $e');
  // Return mock data for offline demo
}
```

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login/` | POST | User login (all roles) |
| `/api/auth/refresh/` | POST | Refresh JWT token |
| `/api/auth/register/farmer/` | POST | Farmer registration |
| `/api/auth/register/expert/` | POST | Expert registration |
| `/api/auth/register/investor/` | POST | Investor registration |

---

## State Management Strategy

### Provider Architecture

The application uses **Provider** pattern for state management across all features.

### Provider Hierarchy

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => AuthProvider()),
    ChangeNotifierProxyProvider<AuthProvider, ProjectProvider>(
      create: (_) => ProjectProvider(),
      update: (_, auth, previous) => previous!..updateAuth(auth),
    ),
    ChangeNotifierProxyProvider<AuthProvider, ExpertProvider>(
      create: (_) => ExpertProvider(),
      update: (_, auth, previous) => previous!..updateAuth(auth),
    ),
    ChangeNotifierProvider(create: (_) => MessagingProvider()),
    ChangeNotifierProvider(create: (_) => InvestorPaymentProvider()),
  ],
  child: MaterialApp(...),
)
```

### Key Providers

#### **AuthProvider**
- Manages authentication state (token, user, role)
- Handles login/logout/signup operations
- Stores user profile data (farmer/expert/investor)
- Provides `isAuthenticated`, `needsRoleSelection`, `hasCompletedProfile` flags

#### **ProjectProvider**
- Manages farmer projects
- Handles CRUD operations for projects
- Depends on AuthProvider for token

#### **ExpertProvider**
- Manages expert ideas
- Handles idea creation/editing
- Provides collaboration features

#### **MessagingProvider**
- Manages conversation threads
- Handles message sending/receiving
- Real-time updates for messaging interface

#### **InvestorPaymentProvider**
- Simulates premium subscription status
- Manages payment state locally (no backend integration)
- Persists state per user via SharedPreferences

### State Persistence

- **Authentication State**: Stored in SharedPreferences
- **Premium Status**: Stored locally per user ID
- **User Profiles**: Cached in memory, sync with backend on changes
- **App State**: Rehydrated on app startup via `_initializeApp()` in `app.dart`

---

## Current Limitations

### 1. Premium Payment Simulation
- Investor premium status is **simulated locally**
- No real payment gateway integration
- State stored in SharedPreferences (not synced with backend)

### 2. Mock API Fallback
- Offline mode uses hardcoded mock data
- Mock logic resides in `core/api/mock_api.dart`
- Mock data is not production-ready

### 3. Token Refresh Not Fully Implemented
- JWT refresh endpoint exists but not actively used
- Mobile app re-login required on token expiration

### 4. Image Upload
- Image picker implemented but upload to backend may be incomplete
- Profile pictures stored locally only

### 5. Real-Time Messaging
- Messaging is request/response based
- No WebSocket or push notification support
- No true real-time sync

### 6. Tablet/Desktop UI
- Mobile-first design
- No responsive layouts for larger screens
- May require UI adjustments for web

---

## Important Constraints for Web Extension

### **Critical: Do Not Modify**

1. **Backend APIs**: The backend is deployed and stable. Do NOT change endpoints, request payloads, or authentication flow.
   
2. **Authentication Logic**: The JWT-based role authentication system is battle-tested. Do NOT rewrite `AuthService` or `AuthProvider`.

3. **Mobile Build**: The Flutter mobile app must remain functional. Any shared code must be backward-compatible.

4. **Data Models**: All models in `lib/models/` are aligned with backend schemas. Do NOT alter field names or structure without backend coordination.

5. **SharedPreferences Keys**: Storage keys used by `StorageService` must remain consistent to avoid breaking existing user sessions.

### **Technical Constraints**

- **State Management**: Web version should use the same Provider pattern to maintain consistency
- **API Client**: Reuse `http` package or ensure web HTTP implementation is compatible
- **Authentication Flow**: Must preserve role-based navigation logic
- **Profile Completion**: Web version must enforce profile completion before full access

---

## Development Guidelines for Web Version

### Recommended Approach

1. **Code Reuse**:
   - Reuse all models, providers, and services
   - Reuse core business logic (validators, API constants)
   - Create web-specific UI layer in separate directory

2. **Responsive Design**:
   - Implement responsive layouts for desktop browsers
   - Adapt mobile-first screens to larger viewports
   - Consider dashboard layouts for investor role

3. **Routing**:
   - Flutter web uses same routing system
   - May need URL-based routing for web navigation
   - Consider deep linking for web bookmarks

4. **Platform Detection**:
   ```dart
   import 'package:flutter/foundation.dart' show kIsWeb;
   
   if (kIsWeb) {
     // Web-specific logic
   } else {
     // Mobile-specific logic
   }
   ```

5. **State Persistence**:
   - SharedPreferences works on web (uses localStorage)
   - No changes needed for `StorageService`

6. **Image Handling**:
   - `image_picker` has web support
   - Test file uploads to backend from web context

### Testing Strategy

- **Unit Tests**: Test providers and services independently
- **Integration Tests**: Test authentication flow end-to-end
- **Platform Tests**: Run web and mobile builds in parallel to ensure no regressions
- **API Tests**: Verify all endpoints work identically across platforms

### Web-Specific Considerations

1. **CORS**: Ensure backend allows web origin for API requests
2. **Session Management**: Browser-based session handling (cookies vs. tokens)
3. **File Downloads**: Web may need different approach for file handling
4. **Navigation**: Browser back/forward buttons require proper routing setup

---

## What Must Not Be Changed

### Backend

- ✗ Do NOT modify backend APIs, schemas, or authentication endpoints
- ✗ Do NOT add new roles without backend coordination
- ✗ Do NOT change JWT token structure or refresh logic

### Mobile Application

- ✗ Do NOT break existing mobile functionality
- ✗ Do NOT refactor shared code without thorough testing
- ✗ Do NOT alter `lib/` structure without architectural review

### Authentication System

- ✗ Do NOT rewrite authentication flow
- ✗ Do NOT change role-based navigation logic
- ✗ Do NOT modify user model structure
- ✗ Do NOT alter token storage mechanism

### Data Models

- ✗ Do NOT rename fields in model classes
- ✗ Do NOT change JSON serialization logic
- ✗ Do NOT modify API response parsing

### State Management

- ✗ Do NOT replace Provider with another state management solution (maintain consistency)
- ✗ Do NOT change provider notification patterns
- ✗ Do NOT alter state persistence logic

---

## Quick Reference

### Key Files to Understand

| File | Purpose |
|------|---------|
| `lib/main.dart` | Application entry point |
| `lib/app.dart` | Provider setup and initialization |
| `lib/routes.dart` | All application routes |
| `lib/services/auth_service.dart` | Authentication API logic |
| `lib/providers/auth_provider.dart` | Authentication state management |
| `lib/core/api/api_constants.dart` | Backend configuration |

### Important Screens by Role

| Role | Key Screen |
|------|------------|
| Farmer | `lib/screens/farmer/farmer_profile_page.dart` |
| Expert | `lib/screens/expert/expert_home_screen.dart` |
| Investor | `lib/screens/investor/investor_dashboard_screen.dart` |

### State Management Providers

- **AuthProvider**: Authentication and user state
- **ProjectProvider**: Farmer project management
- **ExpertProvider**: Expert idea management
- **MessagingProvider**: Messaging and conversations
- **InvestorPaymentProvider**: Premium simulation

---

## Contact and Support

For questions regarding this architecture or Web development planning:

- Review existing mobile code thoroughly before starting Web implementation
- Test backend API endpoints using Postman or similar tools
- Coordinate any data model changes with backend team
- Ensure web and mobile builds remain compatible

---

**Document Version**: 1.0  
**Last Updated**: March 4, 2026  
**Maintained By**: ProdNet Development Team

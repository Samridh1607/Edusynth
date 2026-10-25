# EduSynth (Angular)

Angular version of `edusynth_landing_page.html`. The layout, styles, and
behaviour match the original page. Each view now has its own URL, and the app
adds the consent, accessibility, and security basics a public web app needs.

| URL        | Page                                   |
|------------|----------------------------------------|
| `/`        | Landing page with the Start button     |
| `/tasks`   | Available Tasks (requires sign-in)     |
| `/privacy` | Privacy Statement                      |
| `/cookies` | Cookie Policy                          |
| `/terms`   | Terms of Use                           |

---

## 1. Build and run

### Step 1: Install Node.js

Angular 21 needs Node.js 20.19+, 22.12+, or 24+. On Windows:

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen the terminal, then check:

```powershell
node -v
npm -v
```

### Step 2: Install the Angular CLI (optional)

The project scripts use the local CLI, so this is only for running `ng` directly.

```powershell
npm install -g @angular/cli@21
```

### Step 3: Install dependencies

```powershell
cd edusynth-angular
npm install
```

### Step 4: Run the development server

```powershell
npm start
```

Open http://localhost:4200. The page reloads when you save a file.

### Step 5: Create a production build

```powershell
npm run build
```

The deployable site is written to `dist/edusynth/browser/`.

### Step 6: Deploy

Upload the contents of `dist/edusynth/browser/` to any static host.

- **Netlify or Cloudflare Pages.** The `public/_redirects` file sends every URL
  to `index.html`, so links like `/privacy` work on refresh. The `public/_headers`
  file adds the security headers listed in section 3.
- **Vercel.** Add a rewrite of `/(.*)` to `/index.html` and copy the headers
  from `public/_headers` into `vercel.json`.
- **GitHub Pages.** Build with `ng build --base-href /<repo-name>/` and copy
  `index.html` to `404.html` for deep links. GitHub Pages cannot set custom
  security headers.

---

## 2. How the project is built from scratch

These are the steps used to create this project, if you want to rebuild it
yourself with the CLI instead of using the files here.

1. **Create the workspace.**
   ```powershell
   ng new edusynth --routing --style=scss --ssr=false
   ```
2. **Copy the original styles.** Move everything inside the original
   `<style>` tag into `src/styles.scss` unchanged. Global styles keep the
   layout identical without rewriting any CSS.
3. **Copy assets.** Put `full_logo1.png` in `public/`. Use a lowercase
   extension, because production servers treat `.PNG` and `.png` as different files.
4. **Generate services and a guard.**
   ```powershell
   ng generate service core/auth
   ng generate service core/consent
   ng generate guard core/auth --functional
   ```
5. **Generate layout and page components.**
   ```powershell
   ng generate component layout/header
   ng generate component layout/footer
   ng generate component features/landing
   ng generate component features/tasks
   ng generate component features/auth-modal
   ng generate component features/cookie-consent
   ng generate component features/legal/legal-page
   ng generate component features/legal/privacy
   ng generate component features/legal/cookies
   ng generate component features/legal/terms
   ```
6. **Move markup into templates.** Copy each block of the original HTML into
   its component template, keeping the original CSS class names.
7. **Replace DOM scripting with Angular bindings.** See the mapping table below.
8. **Add routes** in `src/app/app.routes.ts`, with a page title for each route
   and `authGuard` on `/tasks`.
9. **Add the compliance features** listed in section 3.
10. **Run, build, and deploy** as in section 1.

### Original functions and their Angular equivalents

| Original function       | Angular version                                                       |
|-------------------------|-----------------------------------------------------------------------|
| `showAuthModal()`       | `AuthService.openModal()`, rendered by `AuthModal`                    |
| `closeAuthModal()`      | `AuthModal.close()`, also on backdrop click and the Escape key       |
| `switchTab(tab)`        | `AuthModal.switchTab()` with an `activeTab` signal                    |
| `handleSignIn(event)`   | `AuthModal.handleSignIn()` using a reactive form with validation      |
| `handleSignUp(event)`   | `AuthModal.handleSignUp()` using a reactive form with validation      |
| `showTasksPage()`       | Navigation to `/tasks`                                                |
| `backToLanding()`       | `Tasks.backToLanding()`, navigating to `/`                            |
| `launchTask(type)`      | `Tasks.launchTask()`, same alert as before                            |
| `showLegalPage(which)`  | Footer `routerLink`s to `/privacy`, `/cookies`, `/terms`              |
| `closeLegalPage()`      | `LegalPage.back()`, returning to the previous page                    |
| `toggleCategory(id)`    | `Tasks.toggleCategory()` with a signal of open categories             |
| `toggleDropdown()`      | `Header.toggleDropdown()`                                             |
| `showSupport(option)`   | `Header.showSupport()`, same alert as before                          |
| `showUserInfo()`        | `Header.showUserInfo()`, same alert as before                         |
| `window.onclick`        | Document click listeners on `Header` and backdrop handlers on dialogs |

**Behaviour changes.** Clicking Start after signing in now goes straight to the
tasks page instead of reopening the sign-in modal, as the original spec in
`prompts.txt` describes. Category task counts are now calculated from the task
list. The original page showed "3 tasks" for two categories that have two tasks.

---

## 3. Legal and compliance features

### Built into the code

| Area | What the app does | Regulation it supports |
|------|-------------------|------------------------|
| Cookie consent | A banner on first visit. Accept and Reject are equally prominent. Nothing non-essential is pre-ticked. | EU GDPR and ePrivacy Directive, UK PECR, India DPDP Act 2023 |
| Granular choices | "Customise" and the footer "Cookie settings" let users turn analytics and functional cookies on or off. | GDPR Art. 7(3): withdrawing consent must be as easy as giving it |
| Consent expiry | Choices expire after 12 months, or when `CONSENT_VERSION` changes, and the banner returns. | EU regulator guidance |
| Withdrawal clean-up | Turning a category off deletes its cookies. | GDPR |
| Browser privacy signals | Do Not Track and Global Privacy Control are treated as a refusal. | California CCPA/CPRA (GPC), and the existing Cookie Policy promise |
| Terms acceptance | Sign-up requires an unticked "I agree to the Terms and have read the Privacy Statement" box. The time of acceptance is passed to `AuthService.signUp()`. | Contract formation, GDPR accountability |
| Age and guardian consent | Sign-up requires confirming age 18+ or guardian consent. | India DPDP Act 2023 s.9, GDPR Art. 8 |
| Notice at collection | Sign-up explains why name and email are collected and links to the Privacy Statement. | GDPR Art. 13, DPDP Act s.5 |
| Legal pages | Privacy, Cookie, and Terms pages have their own URLs and are linked from every page. | GDPR, DPDP Act, IT Act 2000 |
| Accessibility | Real buttons, labelled form fields, error messages tied to fields, focus trapped in dialogs, Escape to close, a skip link, visible focus, a title per page, and reduced motion support. | WCAG 2.1 AA, EU Accessibility Act, Rights of Persons with Disabilities Act 2016 (India) |
| Security headers | `public/_headers` sets a Content Security Policy, HSTS, nosniff, frame blocking, and a referrer policy. | GDPR Art. 32, IT Act s.43A |

### Legal text changes

These additions keep the policy text consistent with what the app does.

- **Privacy Statement.** Added the right to nominate, a Children's Data section, and a Grievance Redressal section.
- **Cookie Policy.** Listed the `edu_consent` storage entry, described the reject option and footer settings link, and added Global Privacy Control.
- **Terms of Use.** Changed the minimum age from 13 to 18, or younger with guardian consent, to match the DPDP Act.

### Still required before launch

The app is front-end only. These items need a backend or legal review.

1. **Real authentication.** Sign-in is still simulated, as in the original. Replace the bodies of `signIn()` and `signUp()` in `src/app/core/auth.service.ts` with a real identity provider. Passwords must be hashed server-side.
2. **Server-side consent records.** Store the terms acceptance time, the policy version, and guardian consent with the user account.
3. **Data subject requests.** Build a way to handle access, correction, deletion, and export requests within the 30 days the Privacy Statement promises.
4. **Verifiable parental consent.** A checkbox is not verification. Under-18 users need a real verification flow under the DPDP Rules.
5. **Analytics loading.** No analytics code exists yet. When adding Azure Application Insights, load it only when `ConsentService.analyticsAllowed()` is true.
6. **Legal review.** Have a lawyer review all three policies. Update their effective dates when the changes above are approved, and name a Grievance Officer if required.
7. **Accessibility audit.** Test with a screen reader and an automated checker such as axe or Lighthouse.

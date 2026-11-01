import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import {
  getInquiries,
  signIn,
  submitInquiry,
  updateInquiryStatus,
} from "./api.js";

const userTypes = ["Parent", "Student", "School"];
const categories = ["Scholarship", "Concert", "Admission", "General Query"];
const inquiryStatuses = ["New", "In Progress", "Resolved"];

function SiteHeader({ adminPage = false }) {
  return (
    <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
      <Link
        className="flex items-center gap-2.5 font-sans text-xl font-extrabold tracking-tight text-stone-800"
        to="/"
        aria-label="Brightpath home"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg rounded-bl-sm bg-blue-700 text-lg font-bold text-white">
          b
        </span>
        <span>brightpath</span>
      </Link>
      <nav
        className="flex items-center gap-4 text-sm font-medium text-stone-600 sm:gap-8"
        aria-label="Main navigation"
      >
        <a
          className="hidden transition-colors hover:text-blue-700 sm:inline"
          href={adminPage ? "/" : "#how-it-works"}
        >
          {adminPage ? "Public form" : "How it works"}
        </a>
        <Link
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-blue-800 transition-colors hover:bg-blue-50 sm:px-4"
          to={adminPage ? "/" : "/admin"}
        >
          {adminPage ? "Back to site" : "Admin"}
        </Link>
      </nav>
    </header>
  );
}

function InquiryForm() {
  const [form, setForm] = useState({
    userType: "",
    category: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      await submitInquiry(form);
      setForm({
        userType: "",
        category: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setFeedback({
        type: "success",
        message: "Thanks for reaching out. Our team will be in touch soon.",
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-stone-50 font-sans text-stone-800 antialiased">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-8 sm:px-8 md:gap-12 md:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-12">
          <div className="max-w-md">
            <p className="flex items-center gap-2 text-xs font-medium text-stone-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> A little
              help goes a long way
            </p>
            <h1 className="mb-4 mt-5 font-sans text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Let&apos;s find the{" "}
              <span className="text-blue-700">right path</span> for you.
            </h1>
            <p className="max-w-sm text-sm leading-7 text-stone-600 sm:text-base">
              Have a question about learning, an upcoming event, or what comes
              next? We&apos;re real people, and we&apos;re happy to help.
            </p>
          </div>

          <section
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="form-title"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-wider text-stone-500">
                  WE&apos;RE LISTENING
                </p>
                <h2
                  className="mb-1 mt-2 font-sans text-xl font-bold tracking-tight text-stone-900"
                  id="form-title"
                >
                  Send us a message
                </h2>
                <p className="m-0 text-xs text-stone-500">
                  Fill in the details below and our team will get back to you.
                </p>
              </div>
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700"
                aria-hidden="true"
              >
                ✳
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                  <span>
                    I&apos;m a <span className="text-red-600">*</span>
                  </span>
                  <select
                    className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    name="userType"
                    value={form.userType}
                    onChange={updateField}
                    required
                  >
                    <option value="">Choose one</option>
                    {userTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                  <span>
                    Asking about <span className="text-red-600">*</span>
                  </span>
                  <select
                    className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    required
                  >
                    <option value="">Choose a topic</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                <span>
                  Your name <span className="text-red-600">*</span>
                </span>
                <input
                  className="h-10 rounded-lg border border-stone-300 px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                  <span>
                    Email address <span className="text-red-600">*</span>
                  </span>
                  <input
                    className="h-10 rounded-lg border border-stone-300 px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    maxLength={254}
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                  <span>
                    Phone number <span className="text-red-600">*</span>
                  </span>
                  <input
                    className="h-10 rounded-lg border border-stone-300 px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="(555) 000-0000"
                    autoComplete="tel"
                    required
                    maxLength={30}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
                <span>
                  Your message <span className="text-red-600">*</span>
                </span>
                <textarea
                  className="resize-y rounded-lg border border-stone-300 px-3 py-2.5 text-sm leading-5 outline-none transition placeholder:text-stone-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Tell us what you have in mind..."
                  rows="4"
                  required
                  maxLength={3000}
                />
              </label>

              {feedback && (
                <p
                  className={`rounded-lg px-3 py-2.5 text-xs leading-5 ${feedback.type === "success" ? "bg-blue-50 text-blue-800" : "bg-red-50 text-red-800"}`}
                  role="status"
                >
                  {feedback.message}
                </p>
              )}

              <button
                className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending your message..." : "Send my message"}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
              <p className="m-0 text-center text-[11px] text-stone-500">
                Your details stay with our team. We&apos;ll only use them to
                follow up.
              </p>
            </form>
          </section>
        </section>

        <section
          className="bg-blue-50 px-5 py-10 sm:px-8 sm:py-14"
          id="how-it-works"
        >
          <div className="mx-auto max-w-6xl">
            <p className="m-0 text-[11px] font-semibold tracking-wider text-stone-500">
              WHAT HAPPENS NEXT
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.5fr] lg:gap-10">
              <h2 className="m-0 font-sans text-2xl font-bold tracking-tight text-stone-900">
                Simple as one, two, three.
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-blue-700">01</span>
                  <p className="m-0 text-xs leading-5 text-stone-600">
                    <strong className="text-sm text-stone-800">
                      You say hello
                    </strong>
                    <br />
                    Send us your question using the form.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-blue-700">02</span>
                  <p className="m-0 text-xs leading-5 text-stone-600">
                    <strong className="text-sm text-stone-800">
                      We find the right person
                    </strong>
                    <br />
                    Your message goes straight to our team.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-blue-700">03</span>
                  <p className="m-0 text-xs leading-5 text-stone-600">
                    <strong className="text-sm text-stone-800">
                      We get back to you
                    </strong>
                    <br />
                    Expect a personal reply from us soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          className="flex items-center gap-2 font-sans text-base font-extrabold tracking-tight text-stone-800"
          to="/"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg rounded-bl-sm bg-blue-700 text-sm font-bold text-white">
            b
          </span>
          <span>brightpath</span>
        </Link>
        <p className="m-0 text-[11px] text-stone-500">
          Good things start with a conversation.
        </p>
      </footer>
    </div>
  );
}

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  function handleSignOut() {
    localStorage.removeItem("adminToken");
    setToken(null);
  }

  if (token) {
    return <AdminDashboard token={token} onSignOut={handleSignOut} />;
  }

  return (
    <AdminLogin
      onSignIn={(newToken) => {
        localStorage.setItem("adminToken", newToken);
        setToken(newToken);
      }}
    />
  );
}

function AdminLogin({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      onSignIn(result.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-stone-50 font-sans text-stone-800 antialiased">
      <SiteHeader adminPage />
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center px-5 pb-16">
        <section className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
          <span
            className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg text-blue-700"
            aria-hidden="true"
          >
            ✳
          </span>
          <p className="m-0 text-[11px] font-semibold tracking-wider text-stone-500">
            TEAM ACCESS
          </p>
          <h1 className="mb-2 mt-2 font-sans text-3xl font-bold tracking-tight text-stone-900">
            Welcome back.
          </h1>
          <p className="mb-6 text-sm leading-6 text-stone-600">
            Sign in to see the messages waiting for your team.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
              <span>Email address</span>
              <input
                className="h-10 rounded-lg border border-stone-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-stone-700">
              <span>Password</span>
              <input
                className="h-10 rounded-lg border border-stone-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-800"
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>
          <Link
            className="mt-6 block text-center text-xs text-stone-500 transition-colors hover:text-blue-700"
            to="/"
          >
            ← Back to the inquiry form
          </Link>
        </section>
      </main>
    </div>
  );
}

function AdminDashboard({ token, onSignOut }) {
  const [inquiries, setInquiries] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    userType: "",
    search: "",
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingInquiryId, setUpdatingInquiryId] = useState(null);
  const [error, setError] = useState("");

  async function loadInquiries(activeFilters = {}) {
    setIsLoading(true);
    setError("");

    try {
      const result = await getInquiries(token, activeFilters);
      setInquiries(result.inquiries);
    } catch (requestError) {
      if (requestError.message === "Invalid or expired token") {
        onSignOut();
        return;
      }
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }

  async function changeStatus(id, status) {
    setError("");
    setUpdatingInquiryId(id);
    try {
      await updateInquiryStatus(token, id, status);
      setInquiries((currentInquiries) =>
        currentInquiries.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status } : inquiry,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message === "Invalid or expired token") {
        onSignOut();
      }
    } finally {
      setUpdatingInquiryId(null);
    }
  }

  const visibleInquiries = statusFilter
    ? inquiries.filter((inquiry) => inquiry.status === statusFilter)
    : inquiries;
  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "New",
  ).length;
  const inProgressCount = inquiries.filter(
    (inquiry) => inquiry.status === "In Progress",
  ).length;
  const resolvedCount = inquiries.filter(
    (inquiry) => inquiry.status === "Resolved",
  ).length;
  const selectedInquiry = inquiries.find(
    (inquiry) => inquiry.id === selectedInquiryId,
  );

  return (
    <div className="min-h-screen min-w-[320px] bg-stone-50 font-sans text-stone-800 antialiased">
      <SiteHeader adminPage />
      <main className="mx-auto my-8 max-w-6xl px-5 pb-12 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] font-semibold tracking-wider text-stone-500">
              YOUR INBOX
            </p>
            <h1 className="mb-2 mt-2 font-sans text-3xl font-bold tracking-tight text-stone-900">
              Inquiry dashboard
            </h1>
            <p className="m-0 text-sm text-stone-600">
              A little organization goes a long way. Here&apos;s what&apos;s
              come in.
            </p>
          </div>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            onClick={onSignOut}
          >
            Sign out <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="my-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <button
            aria-pressed={statusFilter === ""}
            className={`grid grid-cols-[1fr_auto] rounded-xl border bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 ${statusFilter === "" ? "border-blue-300 ring-1 ring-blue-100" : "border-stone-200"}`}
            onClick={() => setStatusFilter("")}
            type="button"
          >
            <span className="text-xs font-medium text-stone-600">
              All inquiries
            </span>
            <strong className="row-span-2 self-center font-sans text-2xl text-stone-800">
              {inquiries.length}
            </strong>
            <small className="mt-1 text-[11px] text-stone-500">
              Matching your search
            </small>
          </button>
          <button
            aria-pressed={statusFilter === "New"}
            className={`grid grid-cols-[1fr_auto] rounded-xl border bg-white p-4 text-left transition hover:border-amber-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${statusFilter === "New" ? "border-amber-300 ring-1 ring-amber-100" : "border-stone-200"}`}
            onClick={() => setStatusFilter("New")}
            type="button"
          >
            <span className="text-xs font-medium text-stone-600">New</span>
            <strong className="row-span-2 self-center font-sans text-2xl text-amber-700">
              {newCount}
            </strong>
            <small className="mt-1 text-[11px] text-stone-500">
              Needs a first look
            </small>
          </button>
          <button
            aria-pressed={statusFilter === "In Progress"}
            className={`grid grid-cols-[1fr_auto] rounded-xl border bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 ${statusFilter === "In Progress" ? "border-blue-300 ring-1 ring-blue-100" : "border-stone-200"}`}
            onClick={() => setStatusFilter("In Progress")}
            type="button"
          >
            <span className="text-xs font-medium text-stone-600">
              In progress
            </span>
            <strong className="row-span-2 self-center font-sans text-2xl text-blue-800">
              {inProgressCount}
            </strong>
            <small className="mt-1 text-[11px] text-stone-500">
              Being followed up
            </small>
          </button>
          <button
            aria-pressed={statusFilter === "Resolved"}
            className={`grid grid-cols-[1fr_auto] rounded-xl border bg-white p-4 text-left transition hover:border-green-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600/30 ${statusFilter === "Resolved" ? "border-green-300 ring-1 ring-green-100" : "border-stone-200"}`}
            onClick={() => setStatusFilter("Resolved")}
            type="button"
          >
            <span className="text-xs font-medium text-stone-600">Resolved</span>
            <strong className="row-span-2 self-center font-sans text-2xl text-green-700">
              {resolvedCount}
            </strong>
            <small className="mt-1 text-[11px] text-stone-500">
              All wrapped up
            </small>
          </button>
        </div>

        <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between px-4 pb-4 pt-5 sm:px-6">
            <div>
              <h2 className="mb-1 font-sans text-base font-bold text-stone-900">
                All messages
              </h2>
              <p className="m-0 text-xs text-stone-500">
                Search by name or phone, or narrow things down.
              </p>
            </div>
            <span className="text-xs text-stone-500" aria-live="polite">
              Showing {visibleInquiries.length} of {inquiries.length}
            </span>
          </div>
          <form
            className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-6"
            onSubmit={(event) => {
              event.preventDefault();
              loadInquiries(filters);
            }}
          >
            <label className="flex h-10 min-w-48 flex-1 items-center gap-2 rounded-lg border border-stone-300 px-3 text-stone-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
              <span className="text-lg" aria-hidden="true">
                ⌕
              </span>
              <span className="sr-only">Search by name or phone</span>
              <input
                className="w-full border-0 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                name="search"
                value={filters.search}
                onChange={updateFilter}
                placeholder="Search name or phone..."
              />
            </label>
            <label className="sr-only" htmlFor="filter-category">
              Filter by category
            </label>
            <select
              className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              id="filter-category"
              name="category"
              value={filters.category}
              onChange={updateFilter}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="filter-user-type">
              Filter by user type
            </label>
            <select
              className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              id="filter-user-type"
              name="userType"
              value={filters.userType}
              onChange={updateFilter}
            >
              <option value="">All user types</option>
              {userTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button
              className="h-10 rounded-lg bg-blue-700 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              type="submit"
            >
              Apply filters
            </button>
            <button
              className="rounded px-2 py-2 text-sm text-stone-600 hover:text-blue-700"
              type="button"
              onClick={() => {
                const clearedFilters = {
                  category: "",
                  userType: "",
                  search: "",
                };
                setFilters(clearedFilters);
                setStatusFilter("");
                loadInquiries(clearedFilters);
              }}
            >
              Clear
            </button>
          </form>

          {error && (
            <p
              className="mx-4 mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-800 sm:mx-6"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-stone-50 text-[10px] font-semibold tracking-wide text-stone-500">
                <tr>
                  <th className="border-y border-stone-200 px-3 py-3 pl-4 sm:pl-6">
                    PERSON
                  </th>
                  <th className="border-y border-stone-200 px-3 py-3">
                    CONTACT
                  </th>
                  <th className="border-y border-stone-200 px-3 py-3">TYPE</th>
                  <th className="border-y border-stone-200 px-3 py-3">TOPIC</th>
                  <th className="border-y border-stone-200 px-3 py-3">
                    RECEIVED
                  </th>
                  <th className="border-y border-stone-200 px-3 py-3">
                    STATUS
                  </th>
                  <th className="border-y border-stone-200 px-3 py-3 pr-4 sm:pr-6">
                    DETAILS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-stone-500"
                      colSpan="7"
                    >
                      Loading messages...
                    </td>
                  </tr>
                ) : visibleInquiries.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-stone-500"
                      colSpan="7"
                    >
                      {inquiries.length === 0
                        ? "No messages found. Try changing your search or filters."
                        : `There are no ${statusFilter.toLowerCase()} messages in this view.`}
                    </td>
                  </tr>
                ) : (
                  visibleInquiries.map((inquiry) => (
                    <tr
                      className="border-b border-stone-100 last:border-0"
                      key={inquiry.id}
                    >
                      <td className="px-3 py-3.5 pl-4 sm:pl-6">
                        <strong className="block text-stone-800">
                          {inquiry.name}
                        </strong>
                        <span className="mt-1 block max-w-xs whitespace-normal break-words text-[11px] leading-5 text-stone-600">
                          {inquiry.message.length > 110
                            ? `${inquiry.message.slice(0, 110)}…`
                            : inquiry.message}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <a
                          className="text-blue-800 hover:underline"
                          href={`mailto:${inquiry.email}`}
                        >
                          {inquiry.email}
                        </a>
                        <span className="mt-1 block text-[11px] text-stone-500">
                          {inquiry.phone}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-stone-600">
                        {inquiry.userType}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="whitespace-nowrap rounded-md bg-blue-50 px-2 py-1 text-[11px] text-blue-800">
                          {inquiry.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-stone-600">
                        {new Date(inquiry.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </td>
                      <td>
                        <label
                          className="sr-only"
                          htmlFor={`status-${inquiry.id}`}
                        >
                          Status for {inquiry.name}
                        </label>
                        <select
                          id={`status-${inquiry.id}`}
                          aria-label={`Update status for ${inquiry.name}`}
                          className={`rounded-md border-0 px-2 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-blue-600/30 disabled:cursor-wait disabled:opacity-60 ${inquiry.status === "New" ? "bg-amber-50 text-amber-800" : inquiry.status === "In Progress" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"}`}
                          value={inquiry.status}
                          disabled={updatingInquiryId === inquiry.id}
                          onChange={(event) =>
                            changeStatus(inquiry.id, event.target.value)
                          }
                        >
                          {inquiryStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 pr-4 sm:pr-6">
                        <button
                          className="rounded-md px-2 py-1.5 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                          onClick={() => setSelectedInquiryId(inquiry.id)}
                          type="button"
                        >
                          Read message
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-10 flex items-end justify-center bg-stone-900/40 p-0 sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInquiryId(null);
            }
          }}
        >
          <section
            aria-labelledby="inquiry-detail-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-wider text-stone-500">
                  INQUIRY DETAILS
                </p>
                <h2
                  className="mb-1 mt-2 text-xl font-semibold text-stone-900"
                  id="inquiry-detail-title"
                >
                  {selectedInquiry.name}
                </h2>
                <p className="m-0 text-xs text-stone-500">
                  Received{" "}
                  {new Date(selectedInquiry.createdAt).toLocaleString(
                    undefined,
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    },
                  )}
                </p>
              </div>
              <button
                aria-label="Close inquiry details"
                className="rounded-lg px-3 py-2 text-lg leading-none text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                onClick={() => setSelectedInquiryId(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-stone-50 p-3">
                <p className="m-0 text-[11px] font-medium text-stone-500">
                  User type
                </p>
                <p className="mb-0 mt-1 text-sm text-stone-800">
                  {selectedInquiry.userType}
                </p>
              </div>
              <div className="rounded-lg bg-stone-50 p-3">
                <p className="m-0 text-[11px] font-medium text-stone-500">
                  Category
                </p>
                <p className="mb-0 mt-1 text-sm text-stone-800">
                  {selectedInquiry.category}
                </p>
              </div>
              <div className="rounded-lg bg-stone-50 p-3">
                <p className="m-0 text-[11px] font-medium text-stone-500">
                  Email
                </p>
                <a
                  className="mt-1 block break-all text-sm text-blue-700 hover:underline"
                  href={`mailto:${selectedInquiry.email}`}
                >
                  {selectedInquiry.email}
                </a>
              </div>
              <div className="rounded-lg bg-stone-50 p-3">
                <p className="m-0 text-[11px] font-medium text-stone-500">
                  Phone
                </p>
                <a
                  className="mt-1 block text-sm text-blue-700 hover:underline"
                  href={`tel:${selectedInquiry.phone}`}
                >
                  {selectedInquiry.phone}
                </a>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-stone-800">
                Message
              </h3>
              <p className="whitespace-pre-wrap break-words rounded-lg border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-700">
                {selectedInquiry.message}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-600">
                Status
                <select
                  aria-label="Update inquiry status"
                  className={`rounded-md border-0 px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600/30 disabled:opacity-60 ${selectedInquiry.status === "New" ? "bg-amber-50 text-amber-800" : selectedInquiry.status === "In Progress" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"}`}
                  disabled={updatingInquiryId === selectedInquiry.id}
                  onChange={(event) =>
                    changeStatus(selectedInquiry.id, event.target.value)
                  }
                  value={selectedInquiry.status}
                >
                  {inquiryStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                {updatingInquiryId === selectedInquiry.id && (
                  <span className="text-[11px] text-stone-500" role="status">
                    Saving…
                  </span>
                )}
              </label>
              <button
                className="rounded-lg border border-stone-300 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                onClick={() => setSelectedInquiryId(null)}
                type="button"
              >
                Done
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InquiryForm />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

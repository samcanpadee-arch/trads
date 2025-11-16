import { describe, it, expect, vi, beforeEach } from "vitest"
import { actions } from "./+page.server"
import { fail, redirect } from "@sveltejs/kit"

vi.mock("@sveltejs/kit", async () => {
  const actual = await vi.importActual("@sveltejs/kit")
  return {
    ...actual,
    fail: vi.fn(),
    redirect: vi.fn().mockImplementation(() => {
      throw new Error("Redirect error")
    }),
  }
})

describe("toggleEmailSubscription", () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null }),
    update: vi.fn().mockReturnThis(),
  }

  const mockSafeGetSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should redirect if no session", async () => {
    mockSafeGetSession.mockResolvedValue({ session: null })

    await expect(
      actions.toggleEmailSubscription({
        locals: {
          supabase: mockSupabase,
          safeGetSession: mockSafeGetSession,
        },
      } as any),
    ).rejects.toThrow("Redirect")

    expect(redirect).toHaveBeenCalledWith(303, "/login")
  })

  it("should toggle subscription status from false to true", async () => {
    const mockSession = { user: { id: "user123" } }
    mockSafeGetSession.mockResolvedValue({ session: mockSession })

    // Mock the first query to get the current status
    mockSupabase.single.mockResolvedValueOnce({ data: { unsubscribed: false } })

    // Mock the update query
    const mockUpdateChain = {
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    mockSupabase.update.mockReturnValue(mockUpdateChain)

    const result = await actions.toggleEmailSubscription({
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
    expect(mockSupabase.select).toHaveBeenCalledWith("unsubscribed")
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "user123")
    expect(mockSupabase.single).toHaveBeenCalled()
    expect(mockSupabase.update).toHaveBeenCalledWith({ unsubscribed: true })
    expect(mockUpdateChain.eq).toHaveBeenCalledWith("id", "user123")
    expect(result).toEqual({ unsubscribed: true })
  })

  it("should toggle subscription status from true to false", async () => {
    const mockSession = { user: { id: "user123" } }
    mockSafeGetSession.mockResolvedValue({ session: mockSession })

    // Mock the first query to get the current status
    mockSupabase.single.mockResolvedValueOnce({ data: { unsubscribed: true } })

    // Mock the update query
    const mockUpdateChain = {
      eq: vi.fn().mockResolvedValue({ error: null }),
    }

    mockSupabase.update.mockReturnValue(mockUpdateChain)

    const result = await actions.toggleEmailSubscription({
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
    expect(mockSupabase.select).toHaveBeenCalledWith("unsubscribed")
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "user123")
    expect(mockSupabase.single).toHaveBeenCalled()
    expect(mockSupabase.update).toHaveBeenCalledWith({ unsubscribed: false })
    expect(mockUpdateChain.eq).toHaveBeenCalledWith("id", "user123")
    expect(result).toEqual({ unsubscribed: false })
  })

  it("should return fail response if update operation fails", async () => {
    const mockSession = { user: { id: "user123" } }
    mockSafeGetSession.mockResolvedValue({ session: mockSession })

    // Mock the first query to get the current status
    mockSupabase.single.mockResolvedValueOnce({ data: { unsubscribed: false } })

    // Mock the update query to return an error
    const mockUpdateChain = {
      eq: vi.fn().mockResolvedValue({ error: new Error("Update failed") }),
    }

    mockSupabase.update.mockReturnValue(mockUpdateChain)

    await actions.toggleEmailSubscription({
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    // Check if fail was called with the correct arguments
    expect(fail).toHaveBeenCalledWith(500, {
      message: "Failed to update subscription status",
    })
  })
})

describe("updateEmail", () => {
  const mockUpdateUser = vi.fn()
  const mockSupabase = {
    auth: {
      updateUser: mockUpdateUser,
    },
  }
  const mockSafeGetSession = vi.fn()

  const buildRequest = (emailValue: string | null | undefined) => ({
    formData: vi.fn().mockResolvedValue({
      get: (key: string) => {
        if (key === "email") {
          return emailValue ?? null
        }
        return null
      },
    }),
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockSafeGetSession.mockResolvedValue({ session: { user: { id: "user123" } } })
    mockUpdateUser.mockResolvedValue({ error: null })
  })

  it("redirects to login when no session is present", async () => {
    mockSafeGetSession.mockResolvedValue({ session: null })

    await expect(
      actions.updateEmail({
        request: buildRequest("tradie@example.com") as any,
        locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
      } as any),
    ).rejects.toThrow("Redirect error")

    expect(redirect).toHaveBeenCalledWith(303, "/login")
  })

  it("fails when no email is provided", async () => {
    const request = buildRequest("")

    await actions.updateEmail({
      request: request as any,
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(fail).toHaveBeenCalledWith(400, {
      errorMessage: "An email address is required",
      errorFields: ["email"],
      email: "",
    })
  })

  it("fails when email is invalid", async () => {
    const request = buildRequest("not-an-email")

    await actions.updateEmail({
      request: request as any,
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(fail).toHaveBeenCalledWith(400, {
      errorMessage: "A valid email address is required",
      errorFields: ["email"],
      email: "not-an-email",
    })
  })

  it("updates the user email and returns payload on success", async () => {
    const request = buildRequest(" new-email@example.com ")

    const result = await actions.updateEmail({
      request: request as any,
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(mockUpdateUser).toHaveBeenCalledWith({ email: "new-email@example.com" })
    expect(result).toEqual({ email: "new-email@example.com" })
  })

  it("surfaces unknown Supabase errors", async () => {
    mockUpdateUser.mockResolvedValueOnce({ error: new Error("nope") })

    const request = buildRequest("tradie@example.com")

    await actions.updateEmail({
      request: request as any,
      locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession },
    } as any)

    expect(fail).toHaveBeenCalledWith(500, {
      errorMessage: "Unknown error. If this persists please contact us.",
      email: "tradie@example.com",
    })
  })
})

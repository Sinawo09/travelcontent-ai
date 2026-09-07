import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("TravelContent AI workspace", () => {
  it("exposes the current user through auth.me", async () => {
    const user: AuthenticatedUser = {
      id: 7,
      openId: "travel-user",
      email: "creator@example.com",
      name: "Travel Creator",
      loginMethod: "manus",
      role: "user",
      company: "Cape & Coast Travel",
      jobTitle: "Travel Marketer",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    const caller = appRouter.createCaller(createContext(user));
    await expect(caller.auth.me()).resolves.toMatchObject({ id: 7, email: "creator@example.com" });
  });

  it("protects text generation from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.content.generateText({
      contentType: "Blog Article",
      destination: "Cape Town",
      audience: "International Tourists",
      tone: "Inspirational",
      length: "Medium",
      platform: "Website",
      instructions: "Highlight Table Mountain and local food.",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects private prompt browsing from unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.prompts.list({ search: "Cape Town", category: "All" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

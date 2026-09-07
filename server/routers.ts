import { z } from "zod";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { campaigns, generations, prompts } from "../drizzle/schema";
import {
  createCampaign,
  createGeneration,
  createPrompt,
  deletePrompt,
  getProfile,
  getSettings,
  getStats,
  listCampaigns,
  listGenerations,
  listPrompts,
  updateProfile,
  updatePrompt,
  upsertSettings,
} from "./db";

function textFromResponse(response: any) {
  const content = response?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => part?.text ?? "").join("");
  return "";
}

const sharedPromptFields = z.object({
  destination: z.string().min(2),
  audience: z.string().min(2),
  tone: z.string().min(2),
  length: z.string().min(2),
  platform: z.string().min(2),
  instructions: z.string().min(2),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    generateText: protectedProcedure
      .input(z.object({ contentType: z.string(), ...sharedPromptFields.shape }))
      .mutation(async ({ ctx, input }) => {
        const prompt = `Create ${input.length} ${input.contentType} for ${input.platform}. Destination: ${input.destination}. Target audience: ${input.audience}. Tone: ${input.tone}. Additional instructions: ${input.instructions}. Use accurate, useful travel marketing language, clear structure, and a compelling call-to-action.`;
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are TravelContent AI, an expert travel marketing copywriter. Write polished, specific, audience-aware content. Do not claim real-time facts you cannot verify." },
            { role: "user", content: prompt },
          ],
        });
        const output = textFromResponse(response);
        await createGeneration({ userId: ctx.user.id, type: "text", title: `${input.contentType} · ${input.destination}`, prompt, output });
        return { output, prompt };
      }),
    generateImage: protectedProcedure
      .input(z.object({ destination: z.string(), imageType: z.string(), style: z.string(), ratio: z.string(), prompt: z.string().min(2) }))
      .mutation(async ({ ctx, input }) => {
        const fullPrompt = `Create a ${input.style} ${input.imageType} for ${input.destination}. Aspect ratio: ${input.ratio}. ${input.prompt}. Avoid text overlays, watermarks, and inaccurate landmarks.`;
        const result = await generateImage({ prompt: fullPrompt });
        const imageUrl = result.url ?? "";
        await createGeneration({ userId: ctx.user.id, type: "image", title: `${input.imageType} · ${input.destination}`, prompt: fullPrompt, output: imageUrl });
        return { url: imageUrl, prompt: fullPrompt };
      }),
    generateCode: protectedProcedure
      .input(z.object({ language: z.string(), component: z.string(), prompt: z.string().min(2) }))
      .mutation(async ({ ctx, input }) => {
        const fullPrompt = `Generate production-ready ${input.language} for a ${input.component}. ${input.prompt}. Return only the code in one fenced block, with accessible markup and responsive styling where applicable.`;
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a senior frontend engineer specializing in travel marketing sites. Produce clean, maintainable, responsive code with no hidden dependencies." },
            { role: "user", content: fullPrompt },
          ],
        });
        const output = textFromResponse(response);
        await createGeneration({ userId: ctx.user.id, type: "code", title: `${input.component} · ${input.language}`, prompt: fullPrompt, output });
        return { output, prompt: fullPrompt };
      }),
    optimizePrompt: protectedProcedure
      .input(z.object({ prompt: z.string().min(3) }))
      .mutation(async ({ ctx, input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a prompt optimization specialist for travel marketing. Identify missing brief elements and rewrite the prompt into a specific, high-performing instruction." },
            { role: "user", content: `Analyze this basic prompt: ${input.prompt}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "prompt_optimization",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  missing: { type: "array", items: { type: "string" } },
                  optimizedPrompt: { type: "string" },
                  rationale: { type: "string" },
                },
                required: ["missing", "optimizedPrompt", "rationale"],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = textFromResponse(response);
        let result: { missing: string[]; optimizedPrompt: string; rationale: string };
        try {
          result = JSON.parse(raw);
        } catch {
          result = { missing: ["Target audience", "Platform", "Tone", "Objective", "Length", "Call-to-action"], optimizedPrompt: `${input.prompt} Make it specific to travel marketing, name the audience and platform, add a clear objective, tone, length, destination details, and a booking call-to-action.`, rationale: "The optimized version adds the brief elements an AI needs to produce focused content." };
        }
        await createGeneration({ userId: ctx.user.id, type: "prompt", title: "Prompt optimization", prompt: input.prompt, output: JSON.stringify(result) });
        return result;
      }),
    generateCampaign: protectedProcedure
      .input(z.object({ destination: z.string(), duration: z.number().min(1).max(30), audience: z.string(), goal: z.string(), platform: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a travel campaign strategist. Build a structured, multi-day marketing campaign with a clear objective, channel-ready content, hashtags, and CTAs." },
            { role: "user", content: `Create a ${input.duration}-day campaign for ${input.destination}, targeting ${input.audience}, with the goal ${input.goal}, for ${input.platform}.` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "travel_campaign",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  days: { type: "array", items: { type: "object", properties: { day: { type: "integer" }, theme: { type: "string" }, content: { type: "string" }, cta: { type: "string" }, hashtags: { type: "array", items: { type: "string" } } }, required: ["day", "theme", "content", "cta", "hashtags"], additionalProperties: false } },
                },
                required: ["title", "summary", "days"],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = textFromResponse(response);
        let campaign: any;
        try { campaign = JSON.parse(raw); } catch { campaign = { title: `${input.destination} campaign`, summary: "A structured travel marketing campaign.", days: Array.from({ length: input.duration }, (_, index) => ({ day: index + 1, theme: "Destination inspiration", content: `Share a compelling story about ${input.destination}.`, cta: "Explore the experience", hashtags: [`#${input.destination.replace(/\s+/g, "")}`, "#TravelWithPurpose"] })) }; }
        await createCampaign({ userId: ctx.user.id, destination: input.destination, audience: input.audience, duration: input.duration, goal: input.goal, platform: input.platform, content: JSON.stringify(campaign) });
        await createGeneration({ userId: ctx.user.id, type: "campaign", title: campaign.title, prompt: JSON.stringify(input), output: JSON.stringify(campaign) });
        return campaign;
      }),
  }),
  prompts: router({
    list: protectedProcedure.input(z.object({ search: z.string().optional(), category: z.string().optional() }).optional()).query(({ ctx, input }) => listPrompts(ctx.user.id, input?.search ?? "", input?.category)),
    create: protectedProcedure.input(z.object({ title: z.string(), category: z.string(), description: z.string(), promptText: z.string(), optimizedPrompt: z.string().optional() })).mutation(({ ctx, input }) => createPrompt({ ...input, userId: ctx.user.id })),
    update: protectedProcedure.input(z.object({ id: z.number(), title: z.string().optional(), category: z.string().optional(), description: z.string().optional(), promptText: z.string().optional(), optimizedPrompt: z.string().optional(), usedCount: z.number().optional() })).mutation(({ ctx, input }) => { const { id, ...values } = input; return updatePrompt(ctx.user.id, id, values); }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => deletePrompt(ctx.user.id, input.id)),
  }),
  history: router({
    list: protectedProcedure.input(z.object({ type: z.string().optional(), search: z.string().optional() }).optional()).query(({ ctx, input }) => listGenerations(ctx.user.id, input?.type, input?.search ?? "")),
  }),
  campaigns: router({ list: protectedProcedure.query(({ ctx }) => listCampaigns(ctx.user.id)) }),
  workspace: router({
    stats: protectedProcedure.query(({ ctx }) => getStats(ctx.user.id)),
    profile: protectedProcedure.query(({ ctx }) => getProfile(ctx.user.id)),
    updateProfile: protectedProcedure.input(z.object({ name: z.string().min(2), company: z.string().optional(), jobTitle: z.string().optional() })).mutation(({ ctx, input }) => updateProfile(ctx.user.id, input)),
    settings: protectedProcedure.query(({ ctx }) => getSettings(ctx.user.id)),
    updateSettings: protectedProcedure.input(z.object({ theme: z.enum(["light", "dark", "system"]).optional(), language: z.string().optional(), defaultTone: z.string().optional(), defaultLength: z.string().optional(), emailNotifications: z.number().optional() })).mutation(({ ctx, input }) => upsertSettings(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;

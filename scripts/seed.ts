import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

async function seed() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@stackdaily.xyz";
  const adminPassword = process.env.ADMIN_PASSWORD || "stackdaily123";

  const passwordHash = await hash(adminPassword, 12);

  try {
    await db.insert(schema.admins).values({
      email: adminEmail,
      passwordHash,
      name: "Admin",
    });
    console.log(`Created admin user: ${adminEmail}`);
  } catch {
    console.log("Admin user already exists");
  }

  // Create categories
  const categoryData = [
    { name: "Career Growth", slug: "career-growth", color: "#ef4444" },
    { name: "Portfolio Tips", slug: "portfolio-tips", color: "#3b82f6" },
    { name: "Application Strategy", slug: "application-strategy", color: "#22c55e" },
  ];

  const categoryIds: Record<string, string> = {};

  for (const cat of categoryData) {
    try {
      const [inserted] = await db.insert(schema.categories).values(cat).returning();
      categoryIds[cat.slug] = inserted.id;
      console.log(`Created category: ${cat.name}`);
    } catch {
      const [existing] = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.slug, cat.slug))
        .limit(1);
      if (existing) categoryIds[cat.slug] = existing.id;
      console.log(`Category ${cat.name} already exists`);
    }
  }

  // Job Application Guide Content
  const jobGuideContent = `
<h2>PART 1: The Mistakes That Cost People Jobs</h2>

<p>I've reviewed hundreds of applications at this point, and the same patterns keep showing up. These aren't about skill or experience. They're about attention to detail and effort.</p>

<p>Here's what actually gets people rejected:</p>

<h3>1. Not Reading Instructions</h3>
<p>People with years of experience still skipped reading the assignment. They missed requirements, submitted incomplete work, or answered the wrong questions entirely.</p>

<h3>2. Incomplete Portfolios</h3>
<p>Multiple applicants sent only 1-2 work samples when the form clearly asked for more. Some sent no portfolio at all.</p>

<h3>3. Using ChatGPT Poorly</h3>
<p>Several submissions were obviously AI-generated. We could tell from:</p>
<ul>
  <li>Repeated phrases across multiple applications</li>
  <li>Links to posts from 2018 that ChatGPT pulled from old data</li>
  <li>Generic answers that didn't address specific requirements</li>
</ul>
<p><strong>Fix:</strong> If you use AI, edit it heavily. We care about effort, not whether you used AI.</p>

<h3>4. No Context on Work Samples</h3>
<p>Someone submitted 10 random replies from their daily posting without explaining:</p>
<ul>
  <li>Why they chose those specific examples</li>
  <li>What strategy they used</li>
  <li>What results they achieved</li>
</ul>
<p><strong>Fix:</strong> Add brief notes to each work sample explaining your thinking and approach.</p>

<h3>5. Generic Responses</h3>
<p>In a column asking for links to the specific types of replies we're looking for, someone wrote:</p>
<blockquote>
"Perfect that's a well-rounded audience mix. Targeting both large and small creators alongside marketers, founders, and communities will help us build diverse engagement and stronger network visibility."
</blockquote>
<p>This got rejected immediately.</p>

<h3>6. Poor Formatting</h3>
<p>Nobody organized their links or made their application easy to review. Everything was walls of text or random lists with no structure.</p>

<p>One low hanging fruit most people missed is sharing the thought behind the replies they shared. When hiring reply guys, companies want to see if that person has the thinking style to be able to reply from our relevant account.</p>

<hr />

<h2>PART 2: What Actually Gets Your Application Reviewed</h2>

<p>The bar is lower than you think. Most people don't do these things, which means doing them puts you ahead of 95% of applicants.</p>

<h3>1. Show your thinking process</h3>
<p>When you submit work samples, don't just drop links. Format them with context:</p>

<blockquote>
<strong>Example 1: Growth Strategy Reply</strong><br />
<strong>Link:</strong> [URL]<br /><br />
<strong>Context:</strong> Founder asking about scaling their community<br /><br />
<strong>My Approach:</strong> Started with empathy about their challenge, then gave 3 tactical steps they could implement that week<br /><br />
<strong>Why this worked:</strong> Shows I can provide real value while driving engagement back to their brand
</blockquote>

<p>This takes 2 extra minutes per example, but it shows you understand strategy, not just execution.</p>

<h3>2. Make everything scannable</h3>
<p>Use clear section headers, bullet points for lists, one blank line between sections, and bold text for key information. When someone is reviewing 25 applications, they're looking for reasons to say yes quickly or no quickly. Make it easy for them to say yes.</p>

<h3>3. Be complete with what they asked for</h3>
<p>If the form asks for 5 work samples, send 5. If it asks about your strategy, explain your strategy. If it requests specific information, provide exactly that information. This seems obvious, but most people don't do it.</p>

<h3>4. Go one step beyond what's required</h3>
<p>Most people do the bare minimum. A few simple ways to stand out:</p>
<ul>
  <li>Organize your links in a clean doc</li>
  <li>Add a brief overview of your work</li>
  <li>Include a short analysis of what the company actually needs based on their brand</li>
  <li>Format everything to be immediately scannable</li>
</ul>
<p>These take maybe 20 extra minutes but put you in a different category entirely.</p>

<hr />

<h2>PART 3: Why This Actually Matters</h2>

<p>Only 25 out of 400+ people applied.</p>

<p>Of those 25, most had significant issues that got them rejected immediately.</p>

<p>Real competition was maybe 2-3 people who actually put in effort.</p>

<blockquote>
<strong>Key takeaway:</strong><br /><br />
When you submit a thoughtful, complete, well-formatted application, you're not competing against hundreds of people. You're competing against the tiny handful who also took it seriously.
</blockquote>

<p>Most people won't read instructions carefully. Most won't provide complete information. Most won't format their work to be easy to review.</p>

<p>Do those basic things and you're already in the top 5% of applicants.</p>

<p>The opportunity is there. Most people just don't take it seriously enough to capture it.</p>
`;

  // Create the job application guide resource
  try {
    await db.insert(schema.resources).values({
      title: "Why 95% of job applications get rejected (and how to be in the 5% that don't)",
      slug: "job-application-guide",
      description: "Most people overlook the basics of job applications, but mastering them is the fastest way to stand out and actually get your work reviewed.",
      content: jobGuideContent,
      type: "guide",
      categoryId: categoryIds["application-strategy"] || null,
      author: "Juanito",
      thumbnail: null,
      externalUrl: "https://www.notion.so/Why-95-of-job-applications-get-rejected-and-how-to-be-in-the-5-that-don-t-2a93b1c57eaf8172b3b9e78457075008",
    });
    console.log("Created resource: Job Application Guide");
  } catch {
    console.log("Resource already exists");
  }

  console.log("\nSeeding complete!");
  console.log(`\nAdmin login: ${adminEmail} / ${adminPassword}`);

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

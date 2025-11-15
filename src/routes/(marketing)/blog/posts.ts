export const blogInfo = {
  name: "Tradie Assistant Field Notes",
  description: "Workflow tips, quoting plays, and AI automation ideas for busy tradies.",
}

export type BlogPost = {
  link: string
  date: string // date is a string 'YYYY-MM-DD'
  title: string
  description: string
  parsedDate?: Date // Optional because it's added dynamically
}

// Update this list with the actual blog post list
// Create a page in the "(posts)" directory for each entry
const blogPosts: BlogPost[] = [
  {
    title: "Smart Chat templates for job updates clients trust",
    description:
      "Turn site photos and field notes into on-brand emails and SMS updates with reusable Smart Chat prompts.",
    link: "/blog/smart_chat_job_updates",
    date: "2024-05-18",
  },
  {
    title: "Inside the Tradie Library: manuals that answer compliance questions",
    description:
      "How Pro crews use Smart Assistant to cite standards, manuals, and safety guides while they write.",
    link: "/blog/tradie_library_manuals",
    date: "2024-04-02",
  },
  {
    title: "A quoting playbook that keeps margins healthy",
    description:
      "Pair Smart Tools with your price book to draft proposals, variations, and upsells in minutes.",
    link: "/blog/quoting_playbook",
    date: "2024-02-26",
  },
]

// Parse post dates from strings to Date objects
for (const post of blogPosts) {
  if (!post.parsedDate) {
    const dateParts = post.date.split("-")
    post.parsedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
    ) // Note: months are 0-based
  }
}

export const sortedBlogPosts = blogPosts.sort(
  (a: BlogPost, b: BlogPost) =>
    (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0),
)

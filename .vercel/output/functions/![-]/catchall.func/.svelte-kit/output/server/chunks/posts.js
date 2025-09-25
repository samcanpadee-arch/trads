const blogInfo = {
  name: "SaaS Starter Blog",
  description: "A sample blog"
};
const blogPosts = [
  {
    title: "How we built a beautiful 41kb SaaS website with this template",
    description: "How to use this template you to bootstrap your own site.",
    link: "/blog/how_we_built_our_41kb_saas_website",
    date: "2024-03-10"
  },
  {
    title: "Example Blog Post 2",
    description: "Even more example content!",
    link: "/blog/awesome_post",
    date: "2022-9-23"
  },
  {
    title: "Example Blog Post",
    description: "A sample blog post, showing our blog engine",
    link: "/blog/example_blog_post",
    date: "2023-03-13"
  }
];
for (const post of blogPosts) {
  if (!post.parsedDate) {
    const dateParts = post.date.split("-");
    post.parsedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
  }
}
const sortedBlogPosts = blogPosts.sort(
  (a, b) => (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0)
);
export {
  blogInfo as b,
  sortedBlogPosts as s
};

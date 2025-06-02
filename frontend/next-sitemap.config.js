/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://hoatuoiuit.id.vn",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    "/login",
    "/signup",
    "/forgetpassword",
    "/confirmpassword",
    "/myaccount",
    "/cart",
    "/checkout/*",
    "/order-confirmation",
    "/wishlist",
    "/apple-icon.png",
    "/about",
    "/contact",
    "/products",
    "/blog",
  ],
  additionalPaths: async (config) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/blog`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return await res.json();
      } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
      }
    }

    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        return await res.json();
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    }

    const createSlug = (title) => {
      return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    };

    const blogs = await fetchBlogs();
    const products = await fetchProducts();

    const staticPages = [
      {
        loc: "https://hoatuoiuit.id.vn/",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0,
      },
      {
        loc: "https://hoatuoiuit.id.vn/about",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      },
      {
        loc: "https://hoatuoiuit.id.vn/contact",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      },
      {
        loc: "https://hoatuoiuit.id.vn/products",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9,
      },
      {
        loc: "https://hoatuoiuit.id.vn/blog",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.8,
      },
    ];

    const blogUrls = blogs.map((blog) => ({
      loc: `${config.siteUrl}/blog/${createSlug(blog.title)}`,
      lastmod: blog.updatedAt || new Date().toISOString(),
      changefreq: "daily",
      priority: 0.8,
    }));

    const productUrls = products.map((product) => ({
      loc: `${config.siteUrl}/products/${createSlug(product.name)}`,
      lastmod: product.updatedAt || new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
    }));

    return [...staticPages, ...blogUrls, ...productUrls];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/signup",
          "/forgetpassword",
          "/confirmpassword",
          "/myaccount",
          "/cart",
          "/checkout/*",
          "/order-confirmation",
          "/wishlist",
        ],
      },
    ],
  },
  // Thêm cấu hình để tránh vòng lặp sitemap index
  generateIndexSitemap: true,
  sitemapBaseFileName: "sitemap",
  outDir: "public",
};